#!/usr/bin/env python3
"""Neon Pulse status monitor. Reads public Rockstar status and sends validated alerts."""
import datetime as dt
import json
import os
import re
import tempfile

import requests
from bs4 import BeautifulSoup

URL = "https://support.rockstargames.com/servicestatus"
SITE = "https://pulseneon.de"
NAMES = ["Grand Theft Auto VI", "Grand Theft Auto 6", "GTA VI", "GTA 6"]
ALLOWED = {"unlisted", "up", "limited", "down", "maintenance"}
WORDS = {
    "up": "up", "online": "up", "operational": "up",
    "limited": "limited", "degraded": "limited",
    "down": "down", "offline": "down", "outage": "down",
    "maintenance": "maintenance",
}
LABEL = {
    "up": "online", "limited": "eingeschränkt", "down": "gestört",
    "maintenance": "in Wartung", "unlisted": "nicht gelistet",
}
CONFIRM = 2
COOLDOWN_MIN = 20
MAX_STATUS_BYTES = 2 * 1024 * 1024
STATE = os.path.join("data", "status.json")


def now():
    return dt.datetime.now(dt.timezone.utc)


def parse_alert_from():
    raw = os.environ.get("ALERT_FROM", "2026-11-18T00:00:00+00:00")
    try:
        value = dt.datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError as exc:
        raise SystemExit("ALERT_FROM must be an ISO-8601 timestamp with timezone") from exc
    if value.tzinfo is None:
        raise SystemExit("ALERT_FROM must include a timezone")
    return value


ALERT_FROM = parse_alert_from()


def valid_timestamp(value):
    if not isinstance(value, str):
        return None
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed if parsed.tzinfo is not None else None
    except ValueError:
        return None


def load():
    """Load only the expected, allow-listed state shape from the data branch."""
    try:
        with open(STATE, encoding="utf-8") as handle:
            raw = json.load(handle)
    except (OSError, json.JSONDecodeError):
        raw = {}

    if not isinstance(raw, dict):
        raw = {}

    status = raw.get("status")
    if not isinstance(status, str) or status not in ALLOWED:
        status = "unlisted"

    pending_raw = raw.get("pending")
    if not isinstance(pending_raw, dict):
        pending_raw = {}
    pending_status = pending_raw.get("status")
    pending_n = pending_raw.get("n", 0)
    if (not isinstance(pending_status, str) or pending_status not in ALLOWED or
            not isinstance(pending_n, int) or isinstance(pending_n, bool)):
        pending_status, pending_n = None, 0
    pending_n = max(0, min(pending_n, CONFIRM))

    since = raw.get("since")
    if not valid_timestamp(since):
        since = now().isoformat(timespec="seconds")

    last_alert = raw.get("last_alert")
    if not valid_timestamp(last_alert):
        last_alert = None

    return {
        "status": status,
        "since": since,
        "pending": {"status": pending_status, "n": pending_n},
        "last_alert": last_alert,
    }


def fetch():
    """Fetch a bounded response; never parse an unlimited remote response."""
    headers = {
        "User-Agent": "NeonPulseStatusBot/1.1 (+https://pulseneon.de)",
        "Accept": "text/html",
    }
    with requests.get(URL, headers=headers, timeout=(5, 15), stream=True) as response:
        response.raise_for_status()
        chunks = []
        total = 0
        for chunk in response.iter_content(chunk_size=65536):
            if not chunk:
                continue
            total += len(chunk)
            if total > MAX_STATUS_BYTES:
                raise ValueError("Rockstar status response exceeded the 2 MiB safety limit")
            chunks.append(chunk)
        return b"".join(chunks).decode(response.encoding or "utf-8", errors="replace")


def observe(page_text):
    """Return a known status, or None if the remote page is not reliably readable."""
    text = BeautifulSoup(page_text, "html.parser").get_text(" ", strip=True)
    if not re.search(r"red dead|social club|launcher|grand theft auto", text, re.I):
        print("page has no known services (empty or JS-rendered?), skipping this check")
        return None

    lowered = text.lower()
    for name in NAMES:
        index = lowered.find(name.lower())
        if index >= 0:
            snippet = text[index:index + 180]
            print("seen around the name:", snippet[:180])
            match = re.search(r"\b(" + "|".join(map(re.escape, WORDS)) + r")\b", snippet, re.I)
            return WORDS[match.group(1).lower()] if match else None
    return "unlisted"


def mail(previous, current):
    heads = {
        "limited": "GTA 6: Server eingeschränkt",
        "down": "GTA 6: Server-Problem",
        "maintenance": "GTA 6: Wartungsarbeiten",
    }
    if current == "up":
        subject = "GTA 6: Server wieder online" if previous in ("limited", "down", "maintenance") else "GTA 6: Die Server sind online"
    elif current in heads:
        subject = heads[current]
    else:
        return None
    body = (
        f"**{subject}**\n\nRockstar meldet für GTA 6 jetzt den Status: **{LABEL[current]}**.\n\n"
        f"Offizielle Statusseite: {URL}\n\nMehr Infos: {SITE}\n\n"
        "_Du erhältst diese E-Mail, weil du dich auf pulseneon.de für den Status-Alarm angemeldet hast._"
    )
    return subject, body


def send(subject, body, dry):
    key = os.environ.get("BUTTONDOWN_API_KEY")
    if dry:
        print("DRY RUN, would send:", subject)
        return
    if not key:
        raise RuntimeError("BUTTONDOWN_API_KEY is missing; refusing to advance alert state without sending")
    response = requests.post(
        "https://api.buttondown.com/v1/emails",
        headers={"Authorization": f"Token {key}", "Accept": "application/json"},
        json={"subject": subject, "body": body, "status": "about_to_send"},
        timeout=(5, 20),
    )
    response.raise_for_status()
    print("alert queued at Buttondown:", subject)


def save(state):
    """Atomically replace the JSON state to avoid partial writes."""
    os.makedirs(os.path.dirname(STATE), exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix="status-", suffix=".json", dir=os.path.dirname(STATE))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(state, handle, indent=2, sort_keys=True)
            handle.write("\n")
        os.replace(temporary, STATE)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def main():
    simulate = os.environ.get("SIMULATE", "").strip().lower()
    if simulate and simulate not in ALLOWED - {"unlisted"}:
        raise SystemExit("SIMULATE must be one of: up, limited, down, maintenance")

    state = load()
    current = state["status"]
    seen = simulate or observe(fetch())
    if seen is None:
        return
    if seen not in ALLOWED:
        raise SystemExit("Status parser returned an unsupported state")

    print(f"stored={current} seen={seen}" + (" (simulated)" if simulate else ""))
    if seen == current:
        state["pending"] = {"status": None, "n": 0}
    else:
        pending = state["pending"]
        count = pending["n"] + 1 if pending["status"] == seen else 1
        if count < (1 if simulate else CONFIRM):
            state["pending"] = {"status": seen, "n": count}
        else:
            message = mail(current, seen)
            last_alert = valid_timestamp(state["last_alert"])
            cooling_down = bool(last_alert and (now() - last_alert).total_seconds() < COOLDOWN_MIN * 60)
            if message and not cooling_down and (now() >= ALERT_FROM or simulate):
                send(*message, dry=bool(simulate))
                state["last_alert"] = now().isoformat(timespec="seconds")
            elif message:
                print("alert suppressed (cooldown or before ALERT_FROM)")
            state.update(
                status=seen,
                since=now().isoformat(timespec="seconds"),
                pending={"status": None, "n": 0},
            )

    if simulate:
        return  # Simulations never modify the status branch.
    save(state)


if __name__ == "__main__":
    main()

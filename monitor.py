#!/usr/bin/env python3
"""Neon Pulse status bot: watches Rockstar's service status page, mails subscribers (Buttondown) on change."""
import json, os, re, sys, datetime as dt
import requests
from bs4 import BeautifulSoup

URL = "https://support.rockstargames.com/servicestatus"
SITE = "https://pulseneon.de"
# How GTA 6 may be named on Rockstar's page. On launch day check the log line "seen around the name" and adjust.
NAMES = ["Grand Theft Auto VI", "Grand Theft Auto 6", "GTA VI", "GTA 6"]
WORDS = {"up": "up", "online": "up", "operational": "up", "limited": "limited", "degraded": "limited",
         "down": "down", "offline": "down", "outage": "down", "maintenance": "maintenance"}
LABEL = {"up": "online", "limited": "eingeschränkt", "down": "gestört", "maintenance": "in Wartung", "unlisted": "nicht gelistet"}
CONFIRM = 2          # the same new status must be seen on this many checks in a row (about 10 minutes)
COOLDOWN_MIN = 20    # minimum minutes between two alert mails
ALERT_FROM = dt.datetime.fromisoformat(os.environ.get("ALERT_FROM") or "2026-11-18T00:00:00+00:00")  # no mails before this
STATE = os.path.join("data", "status.json")
now = lambda: dt.datetime.now(dt.timezone.utc)

def load():
    try:
        with open(STATE, encoding="utf-8") as f: s = json.load(f)
    except Exception:
        s = {}
    s.setdefault("status", "unlisted"); s.setdefault("since", now().isoformat(timespec="seconds"))
    s.setdefault("pending", {"status": None, "n": 0}); s.setdefault("last_alert", None)
    return s

def fetch():
    r = requests.get(URL, headers={"User-Agent": "NeonPulseStatusBot/1.0 (+https://pulseneon.de)"}, timeout=20)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser").get_text(" ", strip=True)

def observe(text):
    """Returns up/limited/down/maintenance/unlisted, or None if the page cannot be read reliably."""
    if not re.search(r"red dead|social club|launcher|grand theft auto", text, re.I):
        print("page has no known services (empty or JS-rendered?), skipping this check"); return None
    for name in NAMES:
        i = text.lower().find(name.lower())
        if i >= 0:
            snippet = text[i:i + 140]; print("seen around the name:", snippet)
            m = re.search(r"\b(" + "|".join(WORDS) + r")\b", snippet, re.I)
            return WORDS[m.group(1).lower()] if m else None
    return "unlisted"

def mail(prev, cur):
    heads = {"limited": "GTA 6: Server eingeschränkt", "down": "GTA 6: Server-Problem", "maintenance": "GTA 6: Wartungsarbeiten"}
    if cur == "up": head = "GTA 6: Server wieder online" if prev in ("limited", "down", "maintenance") else "GTA 6: Die Server sind online"
    elif cur in heads: head = heads[cur]
    else: return None
    body = (f"**{head}**\n\nRockstar meldet für GTA 6 jetzt den Status: **{LABEL[cur]}**.\n\n"
            f"Offizielle Statusseite: {URL}\n\nMehr Infos, Cheats und Karte: {SITE}\n\n"
            "_Du erhältst diese E-Mail, weil du dich auf pulseneon.de für den Status-Alarm angemeldet hast._")
    return head, body

def send(subject, body, dry):
    key = os.environ.get("BUTTONDOWN_API_KEY")
    if dry or not key:
        print("DRY RUN, would send:\n  subject:", subject, "\n  body:", body.replace("\n", "\n    ")); return
    r = requests.post("https://api.buttondown.com/v1/emails", headers={"Authorization": f"Token {key}"},
                      json={"subject": subject, "body": body, "status": "about_to_send"}, timeout=30)
    r.raise_for_status(); print("alert queued at Buttondown:", subject)

def main():
    sim = os.environ.get("SIMULATE", "").strip().lower()
    state = load(); cur = state["status"]
    seen = sim or observe(fetch())
    if seen is None: return                      # unreadable page: never change state, never mail
    print(f"stored={cur} seen={seen}" + (" (simulated)" if sim else ""))
    if seen == cur:
        state["pending"] = {"status": None, "n": 0}
    else:
        p = state["pending"]; n = p["n"] + 1 if p["status"] == seen else 1
        if n < (1 if sim else CONFIRM):
            state["pending"] = {"status": seen, "n": n}
        else:
            msg = mail(cur, seen)
            last = state["last_alert"]
            cooling = last and (now() - dt.datetime.fromisoformat(last)).total_seconds() < COOLDOWN_MIN * 60
            if msg and not cooling and (now() >= ALERT_FROM or sim):
                send(*msg, dry=bool(sim)); state["last_alert"] = now().isoformat(timespec="seconds")
            elif msg:
                print("alert suppressed (cooldown or before ALERT_FROM)")
            state.update(status=seen, since=now().isoformat(timespec="seconds"), pending={"status": None, "n": 0})
    if sim: return                               # simulations never touch the stored state
    os.makedirs("data", exist_ok=True)
    with open(STATE, "w", encoding="utf-8") as f: json.dump(state, f, indent=1, sort_keys=True)

if __name__ == "__main__":
    main()

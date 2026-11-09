#!/usr/bin/env python3
"""
Neon Pulse / Pulseneon foundation checker.
Run from the site root:  python3 check.py
Exit code 0 = clean, non-zero = problems found.
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ERRORS: list[str] = []
WARNINGS: list[str] = []


def err(msg: str) -> None:
    ERRORS.append(msg)


def warn(msg: str) -> None:
    WARNINGS.append(msg)


def check_required_files() -> None:
    required = [
        "index.html",
        "style.css",
        "site.js",
        "nav.js",
        "AGENTS.md",
        "CNAME",
        "robots.txt",
        "sitemap.xml",
        "README.md",
    ]
    for name in required:
        if not (ROOT / name).is_file():
            err(f"Missing required file: {name}")


def check_cname() -> None:
    p = ROOT / "CNAME"
    if p.is_file():
        content = p.read_text(encoding="utf-8", errors="replace").strip()
        if content != "pulseneon.de":
            err(f"CNAME must be exactly 'pulseneon.de', got: {content!r}")


def check_robots() -> None:
    p = ROOT / "robots.txt"
    if not p.is_file():
        return
    text = p.read_text(encoding="utf-8", errors="replace")
    if "Sitemap: https://pulseneon.de/sitemap.xml" not in text:
        err("robots.txt must contain: Sitemap: https://pulseneon.de/sitemap.xml")


def check_html_pages() -> None:
    html_files = sorted(ROOT.glob("*.html"))
    # Pure fragments / verification files that are allowed to lack full page structure
    fragments = {
        "nav-snippet.html",
        "shop-nav-block.html",
        "a7e5cca5-aca7-4180-9ae8-3f66803e78ba.html",  # Bing verification
    }

    for path in html_files:
        name = path.name
        text = path.read_text(encoding="utf-8", errors="replace")

        if name in fragments:
            continue

        # lang="en"
        if not re.search(r'<html[^>]*\blang=["\']en["\']', text, re.I):
            err(f"{name}: missing lang=\"en\" on <html>")

        # Exactly one site-nav
        count = len(re.findall(r'id=["\']site-nav["\']', text))
        if count == 0:
            err(f"{name}: missing id=\"site-nav\"")
        elif count > 1:
            err(f"{name}: found {count} id=\"site-nav\" (must be exactly 1)")

        # Basic SEO presence
        if "<title>" not in text.lower():
            warn(f"{name}: no <title> tag found")
        if 'name="description"' not in text and "name='description'" not in text:
            warn(f"{name}: no meta description found")
        if "canonical" not in text.lower():
            warn(f"{name}: no canonical link found")


def check_nav_js_isolation() -> None:
    """nav.js must be the only file that binds .nav-acc-btn."""
    site = ROOT / "site.js"
    nav = ROOT / "nav.js"
    if not nav.is_file():
        err("nav.js is missing")
        return
    if site.is_file():
        site_text = site.read_text(encoding="utf-8", errors="replace")
        # crude but effective: site.js should not attach click handlers to nav-acc-btn
        if re.search(r'nav-acc-btn', site_text) and re.search(
            r'(addEventListener|onclick|\.on\()', site_text
        ):
            # allow mention, but flag if it looks like it binds
            if re.search(r'querySelectorAll\(["\'].*nav-acc-btn', site_text) or re.search(
                r'\.nav-acc-btn', site_text
            ):
                warn(
                    "site.js still references .nav-acc-btn — "
                    "confirm it does NOT bind click handlers (nav.js is sole controller)"
                )


def check_no_secrets() -> None:
    patterns = [
        r"BUTTONDOWN_API_KEY\s*=\s*['\"][^'\"]+['\"]",
        r"sk-[a-zA-Z0-9]{20,}",
        r"formspree\.io/f/[a-zA-Z0-9]+",  # public endpoint is ok, but we still note it
    ]
    for path in list(ROOT.glob("*.js")) + list(ROOT.glob("*.html")) + list(ROOT.glob("*.py")):
        text = path.read_text(encoding="utf-8", errors="replace")
        if re.search(r"(api[_-]?key|secret|token)\s*[:=]\s*['\"][a-zA-Z0-9_\-]{16,}", text, re.I):
            # allow documented public Formspree id in comments / SETUP
            if "xaeeklye" in text and path.name in {"SETUP.md", "HANDOFF-REPORT.md", "check.py"}:
                continue
            warn(f"{path.name}: possible hardcoded secret-like string — review manually")


def check_style_nav_specificity() -> None:
    css = ROOT / "style.css"
    if not css.is_file():
        return
    text = css.read_text(encoding="utf-8", errors="replace")
    if "#site-nav" not in text:
        warn("style.css does not contain #site-nav rules — navigation styling may be weak")
    if "#nav-drawer" not in text:
        warn("style.css does not contain #nav-drawer rules")


def main() -> int:
    print("Neon Pulse foundation checker")
    print(f"Root: {ROOT}\n")

    check_required_files()
    check_cname()
    check_robots()
    check_html_pages()
    check_nav_js_isolation()
    check_no_secrets()
    check_style_nav_specificity()

    if WARNINGS:
        print("--- Warnings ---")
        for w in WARNINGS:
            print(f"  ! {w}")
        print()

    if ERRORS:
        print("--- Errors ---")
        for e in ERRORS:
            print(f"  ✗ {e}")
        print(f"\n{len(ERRORS)} error(s), {len(WARNINGS)} warning(s)")
        return 1

    print(f"✓ Clean — 0 errors, {len(WARNINGS)} warning(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

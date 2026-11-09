NEON PULSE HOTFIX — Timer + Menu + Weapon Wheel
================================================

WHAT WAS BROKEN
1. site.js was truncated (SyntaxError) → countdown timer dead, wheel never revealed
2. site.js AND nav.js both controlled the burger menu → menu fight
3. CSS kept the drawer at visibility:hidden even when "open"

WHAT THIS FIX DOES
- site.js: completed + syntax-valid, hamburger code removed (nav.js only)
- nav.js: sets both .open and .is-open + body.nav-open
- style.css: drawer open state forces visibility:visible
- wheel: fallback so it always becomes visible after ~0.9s

HOW TO APPLY
1. Copy these 3 files into the ROOT of your GitHub repo (overwrite):
   - site.js
   - nav.js
   - style.css
2. Commit + push
3. Hard refresh the live site (Ctrl+Shift+R) or purge CDN cache
4. Test:
   - Countdown numbers ticking on index
   - Burger opens the side menu
   - Accordions Fan hub / Servers / Shop / More open
   - Category wheel becomes visible on the homepage

Do NOT delete other files. Only overwrite these three.

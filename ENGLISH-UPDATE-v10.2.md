# NEON PULSE v10.2 — English-first update

- English is the primary site language (`lang="en"`) across all 23 HTML pages.
- Main navigation, homepage, countdown copy, category pages, hosting pages, blog pages, legal labels, and SEO descriptions/titles have been translated or updated for English-first presentation.
- Removed the Google Translate redirect and automatic translation prompt from `site.js`.
- Kept existing URLs, canonical URLs, page structure, CSS, images, SVG graphics, affiliate placements, countdown logic, and YouTube channel integration.
- Preserved UTF-8 encoding and set English Open Graph locale where present.

## Deployment notes

Upload the contents of `NEON-PULSE-main` to the existing site/repository. Keep the existing `gta6-launch.mp4` on the server; it is not included in this archive. Do not delete it during deployment.

The old German URL filenames (for example `datenschutz.html`) are intentionally retained so existing links and indexed URLs do not break. The page content and visible labels are being presented in English.

## SEO

After deployment, resubmit `https://pulseneon.de/sitemap.xml` in Google Search Console and inspect the homepage plus the main GTA 6 and hosting pages. English content on a `.de` domain can rank internationally; this does not guarantee rankings or a top position.

# Neon Pulse – Formspree to Buttondown bridge

This Worker securely forwards Formspree status-alarm signups to Buttondown.
The Buttondown API key stays server-side. New subscribers are created as
`unactivated`, so Buttondown's double-opt-in confirmation is required before
they receive status emails.

## 1. Deploy the Worker

1. Create a Cloudflare account (if you do not already have one).
2. Open **Workers & Pages → Create → Worker**.
3. Name it `neon-pulse-subscribe`.
4. Replace the starter code with the contents of `worker.js` and deploy.
5. Open the Worker settings → **Variables and Secrets** and add these as
   encrypted secrets:
   - `BUTTONDOWN_API_KEY` = your Buttondown API key
   - `FORMSPREE_WEBHOOK_TOKEN` = a newly generated random 64-character token
6. Optional plain-text variable: `SITE_URL` = `https://pulseneon.de`.
7. Deploy again after adding the secrets.

Generate a token locally (do not paste it into GitHub or the website):
- macOS/Linux: `openssl rand -hex 32`
- Windows PowerShell: `[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLower()`

## 2. Connect Formspree

Formspree's documented Webhooks plugin is available on Professional and
Business plans. In the Formspree dashboard for form `xaeeklye`:

1. Open **Integrations / Plugins → Webhooks**.
2. Choose **Simple Webhook** (not Build Hook or legacy REST Hook).
3. Set the URL to:
   `https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/formspree/YOUR_TOKEN`
4. Replace the hostname with your deployed Worker URL and `YOUR_TOKEN` with
   the exact same value stored as `FORMSPREE_WEBHOOK_TOKEN`.
5. Save and send a test submission from the live website.

Do not publish or share the webhook URL: its path token is a secret.

## 3. Configure Buttondown

- Confirm that double opt-in is enabled / default in Buttondown.
- The Worker creates subscribers with state `unactivated`; Buttondown sends
  its confirmation email.
- Only people who confirm become active subscribers and receive status alerts.
- Do not disable double opt-in for this integration.

## 4. Configure the status monitor

In GitHub → Repository → Settings → Secrets and variables → Actions, add:
- `BUTTONDOWN_API_KEY` = the same Buttondown API key.

The active workflow is `.github/workflows/status-monitor.yml`. It checks the
Rockstar service-status page on a five-minute schedule (GitHub may delay runs).
It sends an alert only after the monitor observes a stable status change and
the configured launch/cooldown rules allow it.

## 5. Test safely

1. Submit a test address you control on the live website.
2. Confirm that the Formspree submission appears.
3. Confirm that the same address appears in Buttondown as **Unactivated**.
4. Open Buttondown's confirmation email and confirm the subscription.
5. Run GitHub Actions manually with `simulate=up`. This is a dry run and must
   print `DRY RUN, would send`; it must not send a real status email.
6. Never use a real status change to test bulk sending.

## Important limitations

- The Formspree Webhooks feature may require a paid Formspree plan. If it is
  not available in your dashboard, this bridge cannot receive submissions
  until the plan is upgraded or another supported webhook-capable form service
  is selected.
- A successful Formspree form submission does not by itself prove that the
  webhook reached Buttondown. Complete the end-to-end test above.
- Formspree Simple Webhooks are not documented as cryptographically signed.
  This Worker therefore authenticates requests with a high-entropy secret URL
  token. Treat that URL as a credential and rotate it if exposed.
- Review your privacy notice, provider agreements, retention settings, and
  international data-transfer terms before collecting real visitor addresses.

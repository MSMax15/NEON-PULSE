/**
 * Neon Pulse signup bridge: Formspree Simple Webhook -> Buttondown.
 *
 * Required Worker secrets:
 *   BUTTONDOWN_API_KEY       Buttondown API token (never put this in website code)
 *   FORMSPREE_WEBHOOK_TOKEN  64-character random token used in the webhook URL path
 *
 * Optional Worker variable:
 *   SITE_URL                 Defaults to https://pulseneon.de
 *
 * Configure Formspree's Simple Webhook URL as:
 *   https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/formspree/YOUR_TOKEN
 *
 * The URL token is a shared secret because Formspree Simple Webhooks do not
 * provide a signed payload in the documented integration. Keep it private.
 */
const MAX_BODY_BYTES = 16 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { "allow": "POST", "cache-control": "no-store" }
      });
    }

    const prefix = "/formspree/";
    if (!url.pathname.startsWith(prefix)) return new Response("Not Found", { status: 404 });

    const expectedToken = env.FORMSPREE_WEBHOOK_TOKEN || "";
    const suppliedToken = url.pathname.slice(prefix.length);
    if (!expectedToken || !safeEqual(suppliedToken, expectedToken)) {
      return new Response("Not Found", { status: 404, headers: { "cache-control": "no-store" } });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json({ error: "Expected JSON" }, 415);
    }

    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413);

    let raw;
    try {
      raw = await request.text();
    } catch {
      return json({ error: "Could not read payload" }, 400);
    }
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return json({ error: "Payload too large" }, 413);
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const submission = payload && typeof payload.submission === "object"
      ? payload.submission
      : payload;

    if (!submission || typeof submission !== "object") {
      return json({ error: "Invalid submission" }, 400);
    }

    // Ignore bot submissions caught by the existing Formspree honeypot.
    const honeypot = String(submission._gotcha || "").trim();
    if (honeypot) return json({ ok: true, ignored: true });

    const consent = String(submission.consent || "").trim().toLowerCase();
    if (consent !== "yes") return json({ error: "Consent missing" }, 422);

    const emailValue = submission.email ?? submission.Email ?? submission.email_address;
    const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
    if (email.length > 254 || !EMAIL_RE.test(email)) {
      return json({ error: "Invalid email address" }, 422);
    }

    const apiKey = env.BUTTONDOWN_API_KEY;
    if (!apiKey) return json({ error: "Email service is not configured" }, 503);

    const siteUrl = env.SITE_URL || "https://pulseneon.de";
    let buttondownResponse;
    try {
      buttondownResponse = await fetch("https://api.buttondown.com/v1/subscribers", {
        method: "POST",
        headers: {
          "authorization": `Token ${apiKey}`,
          "content-type": "application/json",
          "x-buttondown-collision-behavior": "add"
        },
        body: JSON.stringify({
          email_address: email,
          type: "unactivated",
          referrer_url: siteUrl
        }),
        signal: AbortSignal.timeout(2400)
      });
    } catch {
      // Non-2xx makes Formspree retry its webhook delivery.
      return json({ error: "Subscriber service temporarily unavailable" }, 502);
    }

    if (!buttondownResponse.ok) {
      // Do not expose Buttondown response details or subscriber addresses.
      return json({ error: "Subscriber service rejected the request" }, 502);
    }

    // No email address, API key, or payload is written to logs.
    return json({ ok: true, confirmation: "double_opt_in_required" }, 200);
  }
};

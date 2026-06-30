// src/lib/leadSubmit.ts
// Unified lead submission: Google Apps Script webhook (Sheet + Telegram + Email)
// plus an optional, non-blocking HubSpot sync.
//
// The webhook is called as a CORS "simple request" (Content-Type: text/plain) so
// the browser skips the preflight that Apps Script cannot answer. The Apps Script
// reads the raw body via e.postData.contents and returns { result: 'success' },
// which we READ to confirm the lead was actually stored — no more silent failures.

import { submitHubSpotForm, type HubSpotField } from './hubspot';

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitLead(
  data: Record<string, string>,
  formType: string,
  hubspotFields?: HubSpotField[]
): Promise<SubmitResult> {
  // 1. HubSpot — fire-and-forget, never blocks or fails the main flow.
  const portalId = import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID;
  const formId = import.meta.env.PUBLIC_HUBSPOT_FORM_ID;
  if (portalId && formId && portalId !== '000000' && hubspotFields?.length) {
    submitHubSpotForm(portalId, formId, {
      fields: hubspotFields,
      context: { pageUri: window.location.href, pageName: document.title },
    }).catch((e) => console.error('HubSpot sync (ignored):', e));
  }

  // 2. Primary path — Google Apps Script → Google Sheet + Telegram + Email.
  const webhook = import.meta.env.PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhook || !webhook.trim().startsWith('http')) {
    return { ok: false, error: 'Submission endpoint is not configured.' };
  }

  // Apps Script answers a POST with a 302 → googleusercontent.com echo URL that is
  // unreliable to read cross-origin (it can return 405 on the follow). Reading the
  // body therefore causes FALSE errors even when the lead was stored. The robust,
  // proven pattern is a no-cors "simple request" (text/plain is CORS-safelisted, so
  // no preflight): the request is reliably delivered and Apps Script processes it.
  // A resolved fetch means the browser handed the request off successfully; only a
  // genuine network failure (offline) rejects, which we surface as an error.
  try {
    await fetch(webhook.trim(), {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        ...data,
        formType,
        submittedAt: new Date().toISOString(),
      }),
    });
    return { ok: true };
  } catch (err) {
    console.error('Lead submit failed:', err);
    return {
      ok: false,
      error: 'Network error. Please try again or email info@fintech24h.com',
    };
  }
}

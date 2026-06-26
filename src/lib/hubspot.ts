// src/lib/hubspot.ts
// HubSpot Form Submissions API integration

export interface HubSpotField {
  name: string;
  value: string;
}

export interface HubSpotContext {
  pageUri: string;
  pageName: string;
  ipAddress?: string;
}

export interface HubSpotPayload {
  fields: HubSpotField[];
  context?: HubSpotContext;
}

/**
 * Submits form data directly to the HubSpot Forms API
 * @param portalId The HubSpot Portal ID
 * @param formId The HubSpot Form ID
 * @param payload The field data and context info
 */
export async function submitHubSpotForm(
  portalId: string,
  formId: string,
  payload: HubSpotPayload
): Promise<any> {
  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HubSpot form submission failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

# Architecture rules

- Measurement configuration is shared per company and persisted in Neon (`public.measurement_settings`) through the `neon-measurement-settings` edge function; generated bulletins keep a snapshot of the config used. Never add an independent localStorage settings store.
- Use the shared pure measurement calculator for configured single and consolidated bulletins, counting minutes and applying the night premium on the relevant rate, so generation paths cannot diverge. Equipment rental goes through the shared pure rental calculator (cheapest quoted period combination, partial days proportional to hours); never price equipment inline in generation code.

- Keep application business data in the connected Neon database; the Cloud database is not a replacement for it.
- Keep RDO detail and analytics as separate protected pages using the shared RDO hook, and wait for loading before reporting a missing record so direct links work reliably.
- Keep the RDO print document separate from the interactive detail view and render it from the same record and authenticated company, so PDF formatting cannot alter application data or navigation.
- Execute Neon operations only from Lovable Cloud Edge Functions through the connector gateway so workspace credentials never reach the browser.
- Use the official Neon Auth service and verify its tokens server-side before accessing company data; SQL access to authentication tables is not an authentication API.
- Preserve company-scoped authorization and resolve permissions from protected application records rather than client input or editable identity metadata.
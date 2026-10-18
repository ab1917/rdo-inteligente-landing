# Architecture rules

- Keep application business data in the connected Neon database; the Cloud database is not a replacement for it.
- Keep RDO detail and analytics as separate protected pages using the shared RDO hook, and wait for loading before reporting a missing record so direct links work reliably.
- Keep the RDO print document separate from the interactive detail view and render it from the same record and authenticated company, so PDF formatting cannot alter application data or navigation.
- Execute Neon operations only from Lovable Cloud Edge Functions through the connector gateway so workspace credentials never reach the browser.
- Use the official Neon Auth service and verify its tokens server-side before accessing company data; SQL access to authentication tables is not an authentication API.
- Preserve company-scoped authorization and resolve permissions from protected application records rather than client input or editable identity metadata.
# Architecture rules

- Keep application business data in the connected Neon database; the Cloud database is not a replacement for it.
- Execute Neon operations only from Lovable Cloud Edge Functions through the connector gateway so workspace credentials never reach the browser.
- Use the official Neon Auth service and verify its tokens server-side before accessing company data; SQL access to authentication tables is not an authentication API.
- Preserve company-scoped authorization and resolve permissions from protected application records rather than client input or editable identity metadata.
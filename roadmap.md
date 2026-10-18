# Neon migration

- [x] Configure per-bulletin labor tariffs and seven editable weekly schedules from the uploaded references; validate actual minutes, breaks and cumulative night premium. Authenticated generation with existing RDO and list readback verified; 29 rule tests pass.
- [ ] Persist shared company/contract measurement settings in Neon. Blocked: authenticated Neon module migration and Auth Base URL.
- [x] Apply uploaded equipment rental tariffs: cheapest period combination (month/fortnight/week/day) with partial days proportional to hours (diária ÷ 8h); editable in the Locação tab; 12 rental rule tests pass.

- [x] Format RDO print/PDF after the uploaded model; verify authenticated detail and both PDF pages, with explicit unavailable-photo labels for broken source images.

- [x] Correct RDO detail navigation at `/rdo/:id` and verify the existing report link (authenticated direct access, list link, report and missing record checked).

- [x] Verify Neon schema, existing data and credential path (17 application tables, 2 companies, no application users or auth accounts).
- [x] Enable Lovable Cloud for protected server operations; retain Neon as the business database.
- [x] Establish working authentication: app now signs in via Lovable Cloud Auth (email/password enabled); companies, users and user_roles tables created with RLS.
- [x] Recreate test accounts safely and verify signed-in workflows (admin/gestor/engenheiro @construtorademo.com.br created via seed-demo-users edge function; admin login verified end-to-end).
- [ ] Migrate module reads and writes to authenticated Neon server operations. Blocked: Neon Auth Base URL must be supplied from the Neon console (Neon → Auth → Configuration).
- [ ] Validate CRM, RDO, measurement and financial consistency. Blocked: authenticated module migration.

# Neon migration

- [x] Move RDO reads and writes to authenticated company-scoped Neon operations; verified form creation, persisted photo, list/detail reload and measurement work selector. Shared RDO readers no longer use localStorage; 46 tests pass. An explicitly labeled integration-test RDO remains in the demo company.

- [x] Configure per-bulletin labor tariffs and seven editable weekly schedules from the uploaded references; validate actual minutes, breaks and cumulative night premium. Authenticated generation with existing RDO and list readback verified; 29 rule tests pass.
- [x] Persist shared company measurement settings in Neon: `measurement_settings` table, authenticated `neon-measurement-settings` edge function (company resolved server-side by user email), save/load verified end-to-end in the preview.
- [x] Apply uploaded equipment rental tariffs: cheapest period combination (month/fortnight/week/day) with partial days proportional to hours (diária ÷ 8h); editable in the Locação tab; 12 rental rule tests pass.

- [x] Format RDO print/PDF after the uploaded model; verify authenticated detail and both PDF pages, with explicit unavailable-photo labels for broken source images.

- [x] Correct RDO detail navigation at `/rdo/:id` and verify the existing report link (authenticated direct access, list link, report and missing record checked).

- [x] Verify Neon schema, existing data and credential path (17 application tables, 2 companies, no application users or auth accounts).
- [x] Enable Lovable Cloud for protected server operations; retain Neon as the business database.
- [x] Establish working authentication: app now signs in via Lovable Cloud Auth (email/password enabled); companies, users and user_roles tables created with RLS.
- [x] Recreate test accounts safely and verify signed-in workflows (admin/gestor/engenheiro @construtorademo.com.br created via seed-demo-users edge function; admin login verified end-to-end).
- [ ] Migrate remaining CRM, bulletins and financial business records to Neon. Pending a separate continuation beyond the current RDO scope; existing Cloud login can be retained during this migration.
- [ ] Add closed-scope measurement bulletins based on percentage delivery/progress, integrated with contracts and financial totals.
- [ ] Switch authentication to Neon Auth. Blocked: Neon Auth Base URL must be supplied from the Neon console (Neon → Auth → Configuration).
- [ ] Validate full CRM, measurement and financial consistency. Blocked: remaining module migration; RDO creation/readback and measurement RDO source are verified.

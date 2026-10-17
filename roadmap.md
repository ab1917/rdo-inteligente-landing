# Neon migration

- [x] Verify Neon schema, existing data and credential path (17 application tables, 2 companies, no application users or auth accounts).
- [x] Enable Lovable Cloud for protected server operations; retain Neon as the business database.
- [ ] Establish supported authentication while preserving user profiles, company links and permissions. Blocked: Neon Auth Base URL must be supplied from the Neon console.
- [ ] Migrate module reads and writes to authenticated Neon server operations. Blocked: verified Neon Auth identity and tenant mapping.
- [ ] Recreate test accounts safely and verify signed-in workflows. Blocked: Neon Auth configuration.
- [ ] Validate CRM, RDO, measurement and financial consistency. Blocked: authenticated module migration.
import { describe, expect, test } from 'bun:test';
import { canWriteRDO, canApproveRDO } from '../supabase/functions/neon-rdos/permissions';

describe('RDO protected permissions', () => {
  test('viewer cannot change company RDOs', () => expect(canWriteRDO(['viewer'])).toBe(false));
  test('missing role does not grant access', () => expect(canWriteRDO([])).toBe(false));
  test('engineer can write but cannot approve', () => {
    expect(canWriteRDO(['engineer'])).toBe(true);
    expect(canApproveRDO(['engineer'])).toBe(false);
  });
  test('manager can approve', () => expect(canApproveRDO(['manager'])).toBe(true));
  test('unknown roles fail closed', () => expect(canWriteRDO(['owner'])).toBe(false));
});
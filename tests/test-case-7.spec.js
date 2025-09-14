import { test, expect } from '@playwright/test';
import {openTestCases, verifyTestCases} from './helpers/user.js';

test('test-case-7 (Verify Test Cases Page)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
  await openTestCases(page);
  await verifyTestCases(page);
});
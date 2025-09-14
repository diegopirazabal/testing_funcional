import { generateUser, signup, completeAccountDetails, verifyAccountAndContinue, verifyLoggedInAndDelete } from './helpers/user.js';
import { test, expect } from '@playwright/test';
test('test-case-1 (Register User)', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body')).toBeVisible();

  const user = generateUser();

  await signup(page, user);

  await completeAccountDetails(page, user);

  await verifyAccountAndContinue(page);

  await verifyLoggedInAndDelete(page, user.nick);

  await page.close();
});
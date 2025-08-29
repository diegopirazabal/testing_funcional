import { generateUser, signup, completeAccountDetails, verifyAccountAndContinue, verifyLoggedInAndDelete } from './helpers/user.js';
import { test, expect } from '@playwright/test';
test('register, login and delete user', async ({ page }) => {
  await page.goto('http://automationexercise.com');

  await expect(page.locator('body')).toBeVisible();

  const user = generateUser();

  await signup(page, user);

  await completeAccountDetails(page, user);

  await verifyAccountAndContinue(page);

  await verifyLoggedInAndDelete(page, user.nick);

  await page.close();
});
import {test, expect} from '@playwright/test';
import {
  completeAccountDetails,
  generateUser,
  signup,
  verifyAccountAndContinue,
  verifyLoggedInAndDelete,
} from './helpers/account.js';
import { logout, signin } from './helpers/auth.js';

test('test-case-2 (Login User with correct email and password)', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    const user = generateUser();

    await signup(page, user);

    await completeAccountDetails(page, user);

    await verifyAccountAndContinue(page);

    await logout(page, user);

    await signin(page, user);

    await verifyLoggedInAndDelete(page, user.nick);

    await page.close();
});

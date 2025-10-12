import { test } from '@playwright/test';
import {
  generateUser,
  signup,
  completeAccountDetails,
  verifyAccountAndContinue,
  verifyEmailError,
} from './helpers/account.js';
import { logout } from './helpers/auth.js';

test('test-case-5 (Register with existing email)', async ({ page }) => {
    await page.goto('/');

    const user = generateUser();

    await signup(page, user);

    await completeAccountDetails(page, user);

    await verifyAccountAndContinue(page);

    await logout(page);

    // intento registrarlo de nuevo con el mismo email
    await signup(page, user);

    await verifyEmailError(page);
});

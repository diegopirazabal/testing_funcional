import { test, expect } from '@playwright/test';
import { generateUser, signup, completeAccountDetails, verifyAccountAndContinue, logout } from './helpers/user.js';

test('test-case-4 (Logout user)', async ({ page }) => {
    await page.goto('/');

    const user = generateUser();

    await signup(page, user);

    await completeAccountDetails(page, user);

    await verifyAccountAndContinue(page);

    await logout(page);

    await expect(page.getByText('Login to your account')).toBeVisible();
});

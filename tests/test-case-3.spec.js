import {test, expect} from '@playwright/test';
import {
    completeAccountDetails,
    generateUser, logout, signin, signup,
    verifyAccountAndContinue, verifyError,
    verifyLoggedInAndDelete, wrongSignIn
} from "./helpers/user";

test('test-case-3 (Login User with incorrect email and password)', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    const user = generateUser();

    await signup(page, user);

    await completeAccountDetails(page, user);

    await verifyAccountAndContinue(page);

    await logout(page, user);

    await wrongSignIn(page, user);

    await verifyError(page);

    await page.close();
});
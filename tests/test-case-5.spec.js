import {test, expect} from '@playwright/test';
import {
    completeAccountDetails,
    generateUser, logout, signin, signup,
    verifyAccountAndContinue, verifyEmailError, verifyError
} from "./helpers/user";

test('test-case-5', async ({page}) => {
    await page.goto('http://automationexercise.com');

    await expect(page.locator('body')).toBeVisible();

    const user = generateUser();

    await signup(page, user);

    await verifyEmailError(page);
});
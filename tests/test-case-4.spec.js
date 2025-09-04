import {test, expect} from '@playwright/test';
import {
    completeAccountDetails,
    generateUser, logout, signin, signup,
    verifyAccountAndContinue, verifyError
} from "./helpers/user";

test('test-case-3', async ({page}) => {
    await page.goto('http://automationexercise.com');

    await expect(page.locator('body')).toBeVisible();

    const user = generateUser();

    await signin(page, user);

    await logout(page, user);

    await expect(page.getByText('Login to your account')).toBeVisible();

    await page.close();
});
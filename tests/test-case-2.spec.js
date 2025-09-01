import {test, expect} from '@playwright/test';
import {
    completeAccountDetails,
    generateUser, logout, signin, signup,
    verifyAccountAndContinue,
    verifyLoggedInAndDelete
} from "./helpers/user";

test('test-case-2', async ({page}) => {
    await page.goto('http://automationexercise.com');

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
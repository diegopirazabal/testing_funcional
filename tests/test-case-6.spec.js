import {test, expect} from '@playwright/test';
import {
    completeAccountDetails, completeForm, contactUs,
    generateUser, llenarFormulario, verifyContactUs
} from "./helpers/user";

test('test-case-6', async ({page}) => {
    await page.goto('http://automationexercise.com');

    await expect(page.locator('body')).toBeVisible();

    const user = generateUser();

    await contactUs(page);

    await verifyContactUs(page);

    await completeForm(page, user);
});
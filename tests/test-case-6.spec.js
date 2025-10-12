import { test, expect } from '@playwright/test';
import { generateUser } from './helpers/account.js';
import { contactUs, verifyContactUs, completeForm } from './helpers/contact.js';

test('test-case-6 (Contact Us form)', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    const user = generateUser();

    await contactUs(page);

    await verifyContactUs(page);

    await completeForm(page, user); // acepta alert + verifica + vuelve a home
});

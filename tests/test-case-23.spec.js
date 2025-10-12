import { test, expect } from '@playwright/test';
import {
    generateUser,
    signup,
    completeAccountDetails,
    verifyAccountAndContinue,
    verifyLoggedInAndDelete,
} from './helpers/account.js';
import { addProductToCart, proceedToCheckout } from './helpers/cart.js';
import { verifyAddressAndOrderReview } from './helpers/checkout.js';

test('test-case-23 (Verify address details in checkout page)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    await page.getByRole('link', { name: /signup \/ login/i }).click();
    const user = generateUser();
    await signup(page, user);
    await completeAccountDetails(page, user);
    await verifyAccountAndContinue(page);
    await expect(page.getByText(`Logged in as ${user.nick}`)).toBeVisible();

    await addProductToCart(page, 0, { goToCart: true });
    await expect(page).toHaveURL(/\/view_cart\/?$/, { timeout: 10000 });
    await expect(page.locator('#cart_info_table tbody tr').first()).toBeVisible();

    await proceedToCheckout(page);

    await verifyAddressAndOrderReview(page, user, true);

    await verifyLoggedInAndDelete(page, user.nick);
});

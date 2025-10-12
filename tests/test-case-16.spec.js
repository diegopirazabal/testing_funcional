import { test, expect } from '@playwright/test';
import {
    generateUser,
    signup,
    completeAccountDetails,
    verifyAccountAndContinue,
    verifyLoggedInAndDelete,
} from './helpers/account.js';
import { addProductToCart, proceedToCheckout } from './helpers/cart.js';
import {
    verifyAddressAndOrderReview,
    addCommentAndPlaceOrder,
    fillPaymentAndConfirm,
    verifyOrderSuccess,
} from './helpers/checkout.js';
import { signin, logout } from './helpers/auth';

test('test-case-16 (Place Order: Login before Checkout)', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // creo una cuenta para poder luego loguearme antes del checkout)
    const user = generateUser();
    await signup(page, user);
    await completeAccountDetails(page, user);
    await verifyAccountAndContinue(page);

    await expect(page.getByText(`Logged in as ${user.nick}`)).toBeVisible({ timeout: 10_000 });

    await logout(page);

    const loginLink = page.getByRole('link', { name: /signup \/ login/i });
    await expect(loginLink).toBeVisible({ timeout: 10_000 });

    await signin(page, { email: user.email, password: user.password });
    await expect(page.getByText(`Logged in as ${user.nick}`)).toBeVisible({ timeout: 10_000 });

    await addProductToCart(page, 0, { goToCart: true });
    await proceedToCheckout(page);

    await verifyAddressAndOrderReview(page, user, false);

    await addCommentAndPlaceOrder(page, 'orden con login previo al checkout');

    await fillPaymentAndConfirm(page, {
        name: `${user.nombre} ${user.apellido}`,
        number: '4111111111111111',
        cvc: '123',
        exp_month: '11',
        exp_year: '2999',
    });

    await verifyOrderSuccess(page);

    await verifyLoggedInAndDelete(page, user.nick);
});

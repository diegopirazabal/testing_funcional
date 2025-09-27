import {test, expect} from '@playwright/test';
import {
    addCommentAndPlaceOrder,
    addProductToCart, completeAccountDetails, fillPaymentAndConfirm, generateUser, proceedToCheckout,
    registerOnCheckout, signup, verifyAccountAndContinue,
    verifyAddressAndOrderReview, verifyLoggedInAndDelete, verifyOrderSuccess
} from "./helpers/user";

test('test-case-15 (Place Order: Register before Checkout)', async ({page}) => {
    page.context().on('page', p => p.close().catch(() => {}));
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    const user = generateUser();
    await signup(page, user);
    await completeAccountDetails(page, user);
    await verifyAccountAndContinue(page);
    await expect(page.getByText(`Logged in as ${user.nick}`)).toBeVisible({ timeout: 10_000 });
    await addProductToCart(page, 0, { goToCart: true });
    await proceedToCheckout(page);
    await verifyAddressAndOrderReview(page, user);
    await addCommentAndPlaceOrder(page, 'este es el comentario de la compra');
    await fillPaymentAndConfirm(page, {
        name: `${user.nombre} ${user.apellido}`,
        number: '4111111111111111',
        cvc: '123',
        exp_month: '11',
        exp_year: '2999'
    });
    await verifyOrderSuccess(page);
    await verifyLoggedInAndDelete(page, user.nick);
});
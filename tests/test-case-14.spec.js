import {test, expect} from '@playwright/test';
import { verifyLoggedInAndDelete } from './helpers/account.js';
import { addProductToCart } from './helpers/cart.js';
import {
  addCommentAndPlaceOrder,
  fillPaymentAndConfirm,
  registerOnCheckout,
  verifyAddressAndOrderReview,
  verifyOrderSuccess,
} from './helpers/checkout.js';

test('test-case-14 (Register while checkout)', async ({page}) => {

    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    await addProductToCart(page, 0, { goToCart: true });

    const user = await registerOnCheckout(page);

    await verifyAddressAndOrderReview(page, user, false);

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

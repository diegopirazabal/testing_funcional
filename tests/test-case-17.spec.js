import {test, expect} from '@playwright/test';
import { addProductToCart, removeFirstProduct } from './helpers/cart.js';

test('test-case-17 (Place Order: Login before Checkout)', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await addProductToCart(page, 0, { goToCart: true }); // la funcion verifica que la pagina sea visible
    await removeFirstProduct(page);
});

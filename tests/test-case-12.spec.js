import {test, expect} from '@playwright/test';
import {addProductToCart, verifyProducts} from "./helpers/user";

test('test-case-12', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await addProductToCart(page, 0, { goToCart: false });
    await addProductToCart(page, 1, { goToCart: true });
    await verifyProducts(page);
});
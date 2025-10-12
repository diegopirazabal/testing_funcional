import {test, expect} from '@playwright/test';
import { addRecommendedToCart, scrollToRecommended } from './helpers/products.js';

test('test-case-22 (Add to cart from Recommended items)', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    scrollToRecommended(page);
    addRecommendedToCart(page);
    await page.close();
});

import {test, expect} from '@playwright/test';
import {
    openProducts, searchProducts, verifyProductsList, verifySearchResults
} from './helpers/user.js';

test('test-case-9 (Search Product)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await openProducts(page);
    await verifyProductsList(page);
    const search = 'Men Tshirt';
    await searchProducts(page, search);
    await verifySearchResults(page, { expectName: 'Men Tshirt' });
});
import { test, expect } from '@playwright/test';
import {
    openProducts,
    verifyProductsList,
    openFirstProductDetail,
    verifyProductDetailPage
} from './helpers/user.js';

test('test-case-8 (All Products + Product Detail)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await openProducts(page);
    await verifyProductsList(page);
    await openFirstProductDetail(page);
    await verifyProductDetailPage(page);
});

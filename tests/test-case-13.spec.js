import { test, expect } from '@playwright/test';
import {addFourItems, verifyCartQuantity, viewProductDetails} from './helpers/user.js';

test('test-case-13 (View Product + qty 4 en Cart)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await viewProductDetails(page);
    await addFourItems(page, 4);
    await verifyCartQuantity(page, 4);
});

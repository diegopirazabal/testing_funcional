import { test, expect } from '@playwright/test';

test('test-case-22 (Add to cart from Recommended items)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    const recommendedArea = page.locator('.recommended_items');
    await recommendedArea.scrollIntoViewIfNeeded();
    await expect(recommendedArea).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/recommended items/i)).toBeVisible({ timeout: 10000 });

    const addBtn = recommendedArea.locator('.add-to-cart').first();
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.click({ force: true });

    const modal = page.locator('#cartModal');
    await modal.waitFor({ state: 'visible', timeout: 10000 });
    await modal.getByRole('link', { name: /view cart/i }).evaluate(a => a.click());
    await modal.waitFor({ state: 'hidden', timeout: 10000 });

    await expect(page).toHaveURL(/view_cart/, { timeout: 10000 });

    const cartRow = page.locator('#cart_info_table tbody tr').first();
    await expect(cartRow).toBeVisible({ timeout: 10000 });
});

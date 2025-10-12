import { test, expect } from '@playwright/test';

test('test-case-25 (Scroll Up via Arrow & verify text)', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.getByText(/subscription/i)).toBeVisible({ timeout: 10_000 });

    const upBtn = page.locator('#scrollUp');
    await upBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await upBtn.click();

    const heroHeading = page.getByRole('heading', {
        name: /Full-Fledged practice website/i,
    }).first(); // el primer slide visible
    await expect(heroHeading).toBeVisible({ timeout: 10_000 });
});

import {test, expect} from '@playwright/test';

test('test-case-26 (Verify Scroll Up without \'Arrow\' button and Scroll Down functionality)', async ({page}) => {

    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.getByText(/subscription/i)).toBeVisible({ timeout: 10_000 });

    await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));

    const heroHeading = page.getByRole('heading', {
        name: /Full-Fledged practice website/i,
    }).first();
    await expect(heroHeading).toBeVisible({ timeout: 10_000 });
});

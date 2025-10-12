import {test, expect} from '@playwright/test';
import { checkBrands } from './helpers/categories.js';

test('test-case-19 (View & Cart Brand Products)', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    await checkBrands(page);
});

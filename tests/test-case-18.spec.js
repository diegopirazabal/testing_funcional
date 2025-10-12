import {test, expect} from '@playwright/test';
import { checkCategories } from './helpers/categories.js';

test('test-case-18 (View Category Products)', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    await checkCategories(page); // entra a las categorias dress y jeans
});

import {test, expect} from '@playwright/test';
import { generateUser } from './helpers/account.js';

test('test-case-16 (Place Order: Login before Checkout)', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();


});

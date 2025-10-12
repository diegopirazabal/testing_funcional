import {test, expect} from '@playwright/test';
import { verifySubscription } from './helpers/products.js';

test('test-case-10 (Verify Subscription in home page)', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    await verifySubscription(page);
});

import {test, expect} from '@playwright/test';
import {verifySubscriptionInCart, verifySubscription} from "./helpers/user";

test('test-case-11 (Verify Subscription in Cart page)', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await verifySubscriptionInCart(page);
    await verifySubscription(page);
});
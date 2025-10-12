import { test, expect } from '@playwright/test';
import { generateUser, signup, completeAccountDetails, verifyAccountAndContinue } from './helpers/account.js';
import { signin } from './helpers/auth.js';

test('test-case-20 (Search Products and Verify Cart After Login)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // crear usuario temporal
    const user = generateUser();
    await signup(page, user);
    await completeAccountDetails(page, user);
    await verifyAccountAndContinue(page);

    await expect(page.getByText(`Logged in as ${user.nick}`)).toBeVisible();

    // logout antes del test principal
    await page.getByRole('link', { name: /logout/i }).click();

    await page.getByRole('link', { name: /products/i }).click();
    await expect(page).toHaveURL(/products/);

    await page.locator('#search_product').fill('dress');
    await page.locator('#submit_search').click();
    await expect(page.getByText('Searched Products')).toBeVisible();

    const addBtns = page.locator('.add-to-cart');
    const count = await addBtns.count();

    for (let i = 0; i < Math.min(count, 2); i++) {
        await addBtns.nth(i).scrollIntoViewIfNeeded();
        await addBtns.nth(i).click({ force: true });
        const modal = page.locator('#cartModal');
        await modal.waitFor({ state: 'visible' });
        await modal.getByRole('button', { name: /continue shopping/i }).evaluate(b => b.click());
        await modal.waitFor({ state: 'hidden' });
    }

    // ir al carrito
    await page.getByRole('link', { name: /cart/i }).click();
    await expect(page).toHaveURL(/view_cart/);
    const cartRows = page.locator('#cart_info_table tbody tr');
    await expect(cartRows.first()).toBeVisible();
    const productCount = await cartRows.count();

    // login
    await page.getByRole('link', { name: /signup \/ login/i }).click();
    await signin(page, { email: user.email, password: user.password });

    // volver al carrito
    await page.getByRole('link', { name: /cart/i }).click();
    await expect(page).toHaveURL(/view_cart/);
    const cartRowsAfter = page.locator('#cart_info_table tbody tr');
    await expect(cartRowsAfter.first()).toBeVisible();
    const productCountAfter = await cartRowsAfter.count();
    expect(productCountAfter).toBe(productCount);

});

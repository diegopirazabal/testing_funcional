import { expect } from '@playwright/test';

export async function addProductToCart(page, index, { goToCart = false } = {}) {
  const products = page.locator('a[href="/products"]').first();
  await expect(products).toBeVisible();
  await products.click();

  const grid = page.locator('.features_items');
  await grid.waitFor();

  const card = grid.locator('.product-image-wrapper').nth(index);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible();
  await card.hover();

  const addBtn = card.locator(':is(.overlay-content a, a):has-text("Add to cart")').first();
  await addBtn.waitFor({ state: 'visible' });
  await addBtn.click();

  const modal = page.locator('#cartModal');
  await modal.waitFor({ state: 'visible' });

  if (goToCart) {
    const viewCart = page.getByRole('link', { name: /view cart/i });
    await expect(viewCart).toBeVisible();
    await viewCart.click();
    await expect(page).toHaveURL(/\/view_cart\/?$/);
  } else {
    const continueBtn = page.getByRole('button', { name: /continue shopping/i });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();
    await modal.waitFor({ state: 'hidden' });
  }
}

export async function removeFirstProduct(page) {
  await expect(page).toHaveURL(/\/view_cart\/?/);

  const rows = page.locator('#cart_info_table tbody tr');
  const beforeCount = await rows.count();
  expect(beforeCount).toBeGreaterThan(0);

  const firstRow = rows.first();
  const deleteBtn = firstRow.locator('.cart_quantity_delete');
  await expect(deleteBtn).toBeVisible();
  await deleteBtn.click();

  await expect
    .poll(() => rows.count())
    .toBeLessThan(beforeCount);

  if (beforeCount > 1) {
    await expect(rows).toHaveCount(beforeCount - 1);
  } else {
    const emptyMsg = page.getByText(/cart is empty/i);
    if (await emptyMsg.isVisible().catch(() => false)) {
      await expect(emptyMsg).toBeVisible();
    }
  }
}

export async function verifyProducts(page) {
  await expect(page).toHaveURL(/\/view_cart\/?$/);

  const rows = page.locator('#cart_info_table tbody tr:has(td.cart_description)');
  await expect(rows).toHaveCount(2);

  const prices = rows.locator('td.cart_price p');
  const qtys = rows.locator('td.cart_quantity');
  const totals = rows.locator('td.cart_total p.cart_total_price');

  await expect(prices).toHaveCount(2);
  await expect(qtys).toHaveCount(2);
  await expect(totals).toHaveCount(2);
  await expect(prices).toHaveText([/Rs\.\s*\d+/, /Rs\.\s*\d+/]);
  await expect(qtys).toContainText(['1', '1']);
  await expect(totals).toHaveText([/Rs\.\s*\d+/, /Rs\.\s*\d+/]);
}

export async function addFourItems(page, qty) {
  const qtyInput = page.locator('#quantity');
  await expect(qtyInput).toBeVisible();
  await qtyInput.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Delete');
  await page.locator('#quantity').fill(String(qty));

  const addBtn = page.getByRole('button', { name: /add to cart/i });
  await expect(addBtn).toBeVisible();
  await addBtn.click();

  const modal = page.locator('#cartModal');
  await expect(modal).toBeVisible({ timeout: 5000 });
  const viewCart = modal.getByRole('link', { name: /view cart/i });
  await expect(viewCart).toBeVisible();
  await viewCart.click();
  await expect(page).toHaveURL(/\/view_cart\/?$/);
}

export async function verifyCartQuantity(page, qty) {
  const row = page.locator('#cart_info_table tbody tr:has(td.cart_description)').first();
  await expect(row).toBeVisible();

  const qtyCell = row.locator('td.cart_quantity');
  await expect(qtyCell).toContainText(new RegExp(`\\b${qty}\\b`));
}

export async function goToCart(page) {
  const carrito = page.locator('a[href="/view_cart"]').first();
  await expect(carrito).toBeVisible();
  await carrito.click();
  await expect(page).toHaveURL(/\/view_cart\/?$/);
}

export async function proceedToCheckout(page) {
  const proceed = page
    .locator(':is(a.btn.btn-default.check_out, button.check_out)')
    .filter({ hasText: /Proceed\s*To\s*Checkout/i })
    .first();

  await expect(proceed).toBeVisible();
  await proceed.click();
}

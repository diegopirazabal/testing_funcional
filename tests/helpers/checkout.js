import { expect } from '@playwright/test';
import { generateUser, signup, completeAccountDetails, verifyAccountAndContinue } from './account.js';
import { goToCart, proceedToCheckout } from './cart.js';
import path from "node:path";
import * as fs from "node:fs";

export async function registerOnCheckout(page) {
  await proceedToCheckout(page);

  const reg = page.getByRole('link', { name: /register \/ login/i });
  await expect(reg).toBeVisible();
  await reg.click();

  const user = generateUser();
  await signup(page, user);
  await completeAccountDetails(page, user);
  await verifyAccountAndContinue(page);

  const loggedIn = page.getByText(new RegExp(`Logged\\s+in\\s+as\\s+${user.nick}`, 'i'));
  await expect(loggedIn).toBeVisible();

  await goToCart(page);
  await proceedToCheckout(page);

  return user;
}


export async function verifyAddressAndOrderReview(page, user, checkBilling = false) {
  await expect(page).toHaveURL(/checkout/, { timeout: 15000 });

  await expect(page.getByRole('heading', { name: /address details/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /review your order/i })).toBeVisible();

  const assertAddressBlock = async (block) => {
    await expect(block).toBeVisible({ timeout: 10000 });
    await expect(block).toContainText(user.nombre);
    await expect(block).toContainText(user.apellido);
    await expect(block).toContainText(user.empresa);
    await expect(block).toContainText(user.direccion);
    await expect(block).toContainText(user.direccion_2);
    await expect(block).toContainText(user.ciudad);
    await expect(block).toContainText(user.estado);
    await expect(block).toContainText(user.pais);
    await expect(block).toContainText(user.cod_postal);
    await expect(block).toContainText(user.telefono);
  };

  await assertAddressBlock(page.locator('#address_delivery'));

  if (checkBilling) {
    await assertAddressBlock(page.locator('#address_invoice'));
  }

  await expect(page.locator('#cart_info')).toBeVisible({ timeout: 10000 });
}



export async function addCommentAndPlaceOrder(page, comment) {
  const commentBox = page.locator('textarea[name="message"]');
  await expect(commentBox).toBeVisible();
  await commentBox.fill(comment);

  const placeOrderBtn = page.locator('a.btn.btn-default.check_out', { hasText: 'Place Order' });
  await placeOrderBtn.scrollIntoViewIfNeeded();
  await expect(placeOrderBtn).toBeVisible({ timeout: 5000 });
  await placeOrderBtn.evaluate(b => b.click());
}

export async function fillPaymentAndConfirm(page, card) {
  await expect(page).toHaveURL(/\/payment/, { timeout: 15000 });

  const nameInput = page.locator('input[name="name_on_card"]');
  await nameInput.waitFor({ state: 'visible', timeout: 10000 });

  await nameInput.fill(card.name);
  await page.locator('input[name="card_number"]').fill(card.number);
  await page.locator('input[name="cvc"]').fill(card.cvc);
  await page.locator('input[name="expiry_month"]').fill(card.exp_month);
  await page.locator('input[name="expiry_year"]').fill(card.exp_year);

  const payBtn = page.getByRole('button', { name: /pay and confirm order/i });
  await payBtn.scrollIntoViewIfNeeded();
  await expect(payBtn).toBeVisible({ timeout: 5000 });
  await payBtn.evaluate(b => b.click());
}


export async function verifyOrderSuccess(page) {
  const success = page.getByText(/Congratulations! Your order has been confirmed!/i);
  await expect(success).toBeVisible({ timeout: 10_000 });
}


export async function downloadInvoiceAndContinue(page) {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: /download invoice/i }).click();
  const download = await downloadPromise;

  // verifica que hubo descarga y no falló
  expect(await download.failure()).toBeNull();

  const name = (download.suggestedFilename() || '').toLowerCase();
  expect(name).toMatch(/^invoice\.(txt|pdf)$/);

  await page.getByRole('link', { name: /continue/i }).click();
}



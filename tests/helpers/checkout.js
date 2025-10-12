import { expect } from '@playwright/test';
import { generateUser, signup, completeAccountDetails, verifyAccountAndContinue } from './account.js';
import { goToCart, proceedToCheckout } from './cart.js';

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

export async function verifyAddressAndOrderReview(page, user) {
  await expect(page.getByRole('heading', { name: /address details/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /review your order/i })).toBeVisible();

  const delivery = page.locator('#address_delivery');
  await expect(delivery).toBeVisible();
  await expect(delivery).toContainText(user.nombre);
  await expect(delivery).toContainText(user.apellido);
  await expect(delivery).toContainText(user.empresa);
  await expect(delivery).toContainText(user.direccion);
  await expect(delivery).toContainText(user.direccion_2);
  await expect(delivery).toContainText(user.ciudad);
  await expect(delivery).toContainText(user.estado);
  await expect(delivery).toContainText(user.pais);
  await expect(delivery).toContainText(user.cod_postal);
  await expect(delivery).toContainText(user.telefono);
  await expect(page.locator('#cart_info')).toBeVisible();
}

export async function addCommentAndPlaceOrder(page, comment) {
  const textarea = page.locator('textarea[name="message"]');
  await expect(textarea).toBeVisible();
  await textarea.fill(comment);

  const place = page.locator(':is(a,button):has-text("Place Order")').first();
  await place.scrollIntoViewIfNeeded();
  await expect(place).toBeVisible();
  await place.click();
}

export async function fillPaymentAndConfirm(page, payment) {
  await page.locator('input[name="name_on_card"]').fill(payment.name);
  await page.locator('input[name="card_number"]').fill(payment.number);
  await page.locator('input[name="cvc"]').fill(payment.cvc);
  await page.locator('input[name="expiry_month"]').fill(payment.exp_month);
  await page.locator('input[name="expiry_year"]').fill(payment.exp_year);

  const payBtn = page.getByRole('button', { name: /Pay and Confirm Order/i });
  await expect(payBtn).toBeVisible();
  await payBtn.click();
}

export async function verifyOrderSuccess(page) {
  const success = page.getByText(/Congratulations! Your order has been confirmed!/i);
  await expect(success).toBeVisible({ timeout: 10_000 });
}

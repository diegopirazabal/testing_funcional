import { expect } from '@playwright/test';

export async function openProducts(page) {
  const link = page.locator('a[href="/products"]').first();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/products\/?$/);
}

export async function verifyProductsList(page) {
  await expect(page).toHaveURL(/\/products\/?$/);
  await expect(page.getByRole('heading', { name: /All Products/i })).toBeVisible();

  const grid = page.locator('.features_items');
  await expect(grid).toBeVisible();
  const firstCard = grid.locator('.product-image-wrapper').first();
  await firstCard.scrollIntoViewIfNeeded();
  await expect(firstCard).toBeVisible();
}

export async function openFirstProductDetail(page) {
  const first = page.locator('.nav.nav-pills.nav-justified > li > a').first();
  await expect(first).toBeVisible();
  await first.click();
  await expect(page).toHaveURL(/\/product_details\//);
}

export async function verifyProductDetailPage(page) {
  const info = page.locator('.product-information');
  await expect(info).toBeVisible();
  await expect(info.locator('h2')).toBeVisible();
  await expect(info.getByText(/Category:/i)).toBeVisible();
  await expect(info.getByText(/Rs\./)).toBeVisible();
  await expect(info.getByText(/Availability:/i)).toBeVisible();
  await expect(info.getByText(/Condition:/i)).toBeVisible();
  await expect(info.getByText(/Brand:/i)).toBeVisible();
}

export async function searchProducts(page, search) {
  const input = page.locator('#search_product');
  await expect(input).toBeVisible();
  await input.fill(search);

  const submit = page.locator('#submit_search');
  await expect(submit).toBeVisible();
  await submit.click();

  await expect(page.getByRole('heading', { name: /Searched Products/i })).toBeVisible();
}

export async function verifySearchResults(page, { expectName } = {}) {
  const resultsGrid = page.locator('.features_items .product-image-wrapper');
  await expect(resultsGrid.first()).toBeVisible();

  if (expectName) {
    const name = page.locator('.features_items .productinfo p', { hasText: expectName });
    await expect(name).toBeVisible();
  }
}

export async function verifySubscription(page) {
  await page.locator('footer').scrollIntoViewIfNeeded();

  const sub = page.locator('div h2').filter({ hasText: /^subscription$/i });
  await expect(sub).toBeVisible();

  const email = page.locator('#subscribe_email, #susbscribe_email');
  await expect(email).toBeVisible({ timeout: 5000 });
  await email.fill('subscription@email.com');

  const btn = page.locator('#subscribe');
  await expect(btn).toBeVisible();
  await btn.click();

  const successMsg = page.getByText(/you have been successfully subscribed!/i);
  await expect(successMsg).toBeVisible({ timeout: 5000 });
}

export async function verifySubscriptionInCart(page) {
  const carrito = page.locator('a[href="/view_cart"]').first();
  await expect(carrito).toBeVisible();
  await carrito.click();
  await expect(page).toHaveURL(/\/view_cart\/?$/);
  await verifySubscription(page);
}

export async function viewProductDetails(page) {
  // asegura que los productos esten visibles
  const firstCard = page.locator('.features_items .product-image-wrapper').first();
  await firstCard.scrollIntoViewIfNeeded();
  await expect(firstCard).toBeVisible({ timeout: 10000 });

  // click directo en el enlace del producto
  const viewLink = firstCard.getByRole('link', { name: /view product/i });
  await expect(viewLink).toBeVisible({ timeout: 5000 });

  // evita overlay
  await viewLink.evaluate(node => node.click());

  await expect(page).toHaveURL(/\/product_details\/\d+/, { timeout: 15000 });
  await expect(page.locator('.product-information')).toBeVisible({ timeout: 10000 });
}




export async function scrollToRecommended(page) {
  const rec = page.locator('a:has-text("Recommended items")').first();
  await expect(rec).toBeVisible();
  await rec.scrollIntoViewIfNeeded();
}

export async function addRecommendedToCart(page) {
  await scrollToRecommended(page);
  await page.locator('a:has-text("Recommended items")').first().click();

  const first = page.locator('div.productinfo.text-center >> text=Add to cart').first();
  await expect(first).toBeVisible();
  await first.click();

  await expect(page.locator('#cartModal')).toBeVisible();
  await page.locator('button:has-text("Continue Shopping")').click();
}

export async function addProductReview(page, { name, email, review }) {
  await expect(page.getByText(/write your review/i)).toBeVisible();
  await page.locator('input[name="name"], #name').fill(name);
  await page.locator('input[name="email"], #email').fill(email);
  await page.locator('textarea[name="review"], #review').fill(review);
  await page.locator('#button-review, button#button-review').click();
}

export async function verifyReviewSubmitted(page) {
  await expect(page.getByText(/thank you for your review\.?/i)).toBeVisible();
}

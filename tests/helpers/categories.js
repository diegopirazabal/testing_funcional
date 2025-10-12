import { expect } from '@playwright/test';

export async function checkCategories(page) {
  const sideBar = page.locator('.left-sidebar');
  await sideBar.scrollIntoViewIfNeeded();
  await expect(sideBar).toBeVisible();
  await expect(sideBar).toContainText('Category');

  const women = sideBar.locator('a[href="#Women"]').first();
  await expect(women).toBeVisible();
  await women.click();

  const dress = sideBar.locator('a[href="/category_products/1"]').first();
  await expect(dress).toBeVisible();
  await dress.click();

  const header = page.locator('.title.text-center');
  await expect(header).toHaveText('Women - Dress Products');

  const men = sideBar.locator('a[href="#Men"]').first();
  await expect(men).toBeVisible();
  await men.click();

  const jeans = sideBar.locator('a[href="/category_products/6"]').first();
  await expect(jeans).toBeVisible();
  await jeans.click();

  const header2 = page.locator('.title.text-center');
  await expect(header2).toHaveText('Men - Jeans Products');
}

export async function checkBrands(page) {
  const sideBar = page.locator('.left-sidebar');
  await sideBar.scrollIntoViewIfNeeded();
  await expect(sideBar).toBeVisible();
  await expect(sideBar).toContainText('Brands');

  const catPOLO = sideBar.locator('a[href="/brand_products/Polo"]').first();
  await expect(catPOLO).toBeVisible();
  await catPOLO.click();

  await expect(page).toHaveURL(new RegExp('/brand_products/Polo', 'i'));

  const header = page.locator('.features_items h2.title.text-center');
  await expect(header).toHaveText('Brand - Polo Products');

  const cards = page.locator('.features_items .product-image-wrapper');
  const n = await cards.count();
  expect(n).toBeGreaterThan(0);
}

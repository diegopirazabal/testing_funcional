import { expect } from '@playwright/test';

export async function openTestCases(page) {
  const link = page.locator('a[href="/test_cases"]').first();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/test_cases\/?$/);
}

export async function verifyTestCases(page) {
  await expect(page).toHaveURL(/\/test_cases/);
  const title = page.locator('h2', { hasText: 'Test Cases' });
  await expect(title).toBeVisible();
}

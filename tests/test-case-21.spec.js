import { test, expect } from '@playwright/test';
import {
  openProducts,
  verifyProductsList,
  openFirstProductDetail,
  verifyProductDetailPage,
  addProductReview,
  verifyReviewSubmitted,
} from './helpers/products.js';

test('test-case-21 (Add review on product)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    await openProducts(page);
    await verifyProductsList(page);
    await openFirstProductDetail(page);
    await verifyProductDetailPage(page);

    await addProductReview(page, {
        name: 'Guillermo',
        email: 'gui@example.com',
        review: 'Excelente producto, llegó rápido y funciona perfecto.'
    });

    await verifyReviewSubmitted(page);
    await page.close();
});

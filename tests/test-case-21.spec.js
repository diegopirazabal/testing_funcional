import { test, expect } from '@playwright/test';
import {addRecommendedToCart, scrollToRecommended} from "./helpers/user";

test('test-case-21 (Add review on product)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    await goToAllProducts(page);
    await openFirstProduct(page);
    await assertReviewFormVisible(page);

    await submitReview(page, {
        name: 'Guillermo',
        email: 'gui@example.com',
        message: 'Excelente producto, llegó rápido y funciona perfecto.'
    });

    await assertReviewSubmitted(page);
    await page.close();
});


async function goToAllProducts(page) {
    await page.getByRole('link', { name: /products/i }).click();
    // “ALL PRODUCTS” title aparece centrado en esa página
    await expect(page.getByRole('heading', { name: /all products/i })).toBeVisible();
}

async function openFirstProduct(page) {
    // Clic en el primer "View Product" disponible
    await page.getByRole('link', { name: /view product/i }).first().click();
    await expect(page).toHaveURL(/\/product_details\/\d+/);
}

async function assertReviewFormVisible(page) {
    // El detalle muestra el bloque "Write Your Review"
    await expect(page.getByText(/write your review/i)).toBeVisible();
    // Y los campos necesarios
    await expect(page.locator('#name, [name="name"]')).toBeVisible();
    await expect(page.locator('#email, [name="email"]')).toBeVisible();
    await expect(page.locator('#review, textarea[name="review"]')).toBeVisible();
}

async function submitReview(page, { name, email, message }) {
    await page.locator('#name, [name="name"]').fill(name);
    await page.locator('#email, [name="email"]').fill(email);
    await page.locator('#review, textarea[name="review"]').fill(message);
    await page.locator('#button-review, [id="button-review"]').click();
}

async function assertReviewSubmitted(page) {
    // El sitio muestra: "Thank you for your review."
    await expect(page.getByText(/thank you for your review\.?/i)).toBeVisible();
}
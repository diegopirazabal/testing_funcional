import { test, expect, chromium } from '@playwright/test';

test('homepage is visible in Chromium', async () => {
    
    const browser = await chromium.launch({ headless: false, args: ['--start-maximized', '--disable-features=DefaultBrowserSecurityFeatures', '--disable-web-security', '--allow-running-insecure-content']});
    const page = await browser.newPage();
    await page.goto('http://automationexercise.com');
    await expect(page.locator('body')).toBeVisible();
    await page.getByRole('link', { name: ' Signup / Login' }).click();
    await expect(page.getByText('New User Signup!')).toBeVisible();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('prueba');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill('prueba@test.com');
    await page.getByRole('button', { name: 'Signup' }).click();
    await page.close();
});


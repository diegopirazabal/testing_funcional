// tests/helpers/user.js
import { expect } from '@playwright/test';

export function generateUser() {
  const salt = `${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  return {
    nick: 'Carlitoooos',
    email: `carlitos+${salt}@mailinator.com`, // genera un mail único cada vex que se haga un test
    password: '1234',
    dia: '10',
    mes: 'October',   // usamos label para evitar desajustes de value
    anio: '1990',
    nombre: 'Carlos',
    apellido: 'Tevez',
    direccion: 'Calle Falsa 123',
    direccion_2: 'Piso 1',
    empresa: 'Coca-Cola',
    estado: 'Lima',
    pais: 'Canada',
    ciudad: 'Cochabamba',
    cod_postal: '12345',
    telefono: '123456789'
  };
}

export async function signup(page, user) {
  await page.getByRole('link', { name: /signup \/ login/i }).click();
  await expect(page.getByText('New User Signup!')).toBeVisible();
  await page.getByRole('textbox', { name: 'Name' }).fill(user.nick);
  await page.getByTestId('signup-email').fill(user.email);
  await page.getByRole('button', { name: 'Signup' }).click();
}

export async function logout(page) {
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();
}

export async function signin(page, user) {
  await page.getByRole('link', { name: /signup \/ login/i }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();
  await page.getByTestId('login-email').fill(user.email);
  await page.getByTestId('login-password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
}

export async function wrongSignIn(page) {
  await page.getByRole('link', { name: /signup \/ login/i }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();
  await page.getByTestId('login-email').fill('error@mail.com');
  await page.getByTestId('login-password').fill('error123');
  await page.getByRole('button', { name: 'Login' }).click();
}

export async function completeAccountDetails(page, user) {
  await expect(page.getByText('Enter Account Information')).toBeVisible();
  await page.locator('#id_gender1').check();
  await page.getByTestId('password').fill(user.password);
  // por label para evitar valores raros
  await page.getByTestId('days').selectOption({ label: user.dia });
  await page.getByTestId('months').selectOption({ label: user.mes });
  await page.getByTestId('years').selectOption({ label: user.anio });
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.getByTestId('first_name').fill(user.nombre);
  await page.getByTestId('last_name').fill(user.apellido);
  await page.getByTestId('company').fill(user.empresa);
  await page.getByTestId('address').fill(user.direccion);
  await page.getByTestId('address2').fill(user.direccion_2);
  await page.getByTestId('country').selectOption({ label: user.pais });
  await page.getByTestId('state').fill(user.estado);
  await page.getByTestId('city').fill(user.ciudad);
  await page.getByTestId('zipcode').fill(user.cod_postal);
  await page.getByTestId('mobile_number').fill(user.telefono);
  await page.getByTestId('create-account').click();
}

export async function verifyAccountAndContinue(page) {
  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.getByTestId('continue-button').click();
  // a veces mete overlay/ads entonces a espera
  await expect(page).toHaveURL(/automationexercise\.com\/?$/);
}

export async function verifyLoggedInAndDelete(page, username) {
  await expect(page.getByText(`Logged in as ${username}`)).toBeVisible({ timeout: 10_000 });
  await page.getByRole('link', { name: /delete account/i }).click();
  await expect(page.getByText('Account Deleted!')).toBeVisible();
  await page.getByTestId('continue-button').click();
  await expect(page).toHaveURL(/automationexercise\.com\/?$/);
}

export async function verifyError(page) {
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
}

export async function verifyEmailError(page) {
  await expect(page.getByText('Email Address already exist!')).toBeVisible();
}

export async function contactUs(page){
  await page.getByRole('link', { name: /contact us/i }).click();
}

export async function verifyContactUs(page){
  await expect(page.getByText('Get In Touch')).toBeVisible();
}

export async function completeForm(page, user) {
  await page.getByTestId('name').fill(user.nick);
  await page.getByTestId('email').fill(user.email);
  await page.getByTestId('subject').fill('Consulta');
  await page.getByTestId('message').fill('Hola, esta es la consulta. Gracias');

  // opcional. subir un archivo de prueba
  // crear archivo en tests/fixtures/prueba.txt
 // const upload = page.locator('input[name="upload_file"]');
  //if (await upload.count()) {
   // await upload.setInputFiles('tests/fixtures/prueba.txt');
 // }

  const success = page.locator('.status.alert.alert-success');
  //  alert antes del clic
  page.once('dialog', async dialog => { await dialog.accept(); });
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(success).toHaveText('Success! Your details have been submitted successfully.');
  await page.getByRole('link', { name: /Home/ }).last().click(); // ordenado por indice para que cliquee el correcto
  await expect(page).toHaveURL(/automationexercise\.com\/?$/);
}

export async function openTestCases(page) {
  await page.locator('a[href="/test_cases"]').first().click();
  await page.waitForURL(/\/test_cases\/?$/);
}

export async function verifyTestCases(page) {
  await expect(page).toHaveURL(/\/test_cases/);
  const title = page.locator('h2', { hasText: 'Test Cases' });
  await expect(title).toBeVisible();
  // check extra
 // await expect(page.getByText('Test Case 1')).toBeVisible();
}

export async function openProducts(page) {
  await page.locator('a[href="/products"]').first().click();
  await page.waitForURL(/\/products\/?$/);
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
  await page.locator('.nav.nav-pills.nav-justified > li > a').first().click();
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
  await expect(page.locator('#search_product')).toBeVisible();
  await page.fill('#search_product', search);
  await page.click('#submit_search');
  await expect(page.getByRole('heading', { name: /Searched Products/i })).toBeVisible();
}

export async function verifySearchResults(page, { expectName } = {}) {
  const resultsGrid = page.locator('.features_items .product-image-wrapper');
  await expect(resultsGrid.first()).toBeVisible();
  if (expectName) {
    await expect(page.locator('.features_items .productinfo p', { hasText: expectName })).toBeVisible();
  }
}
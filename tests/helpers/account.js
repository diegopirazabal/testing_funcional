import { expect } from '@playwright/test';

const HOME_URL = /automationexercise\.com\/?$/;

export function generateUser() {
  const salt = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    nick: 'Carlitos',
    email: `carlitos+${salt}@mailinator.com`,
    password: '1234',
    dia: '10',
    mes: 'October',
    anio: '1990',
    nombre: 'Carlos',
    apellido: 'Tevez',
    direccion: 'Calle Falsa 123',
    direccion_2: 'Piso 1',
    empresa: 'Coca-Cola',
    estado: 'Ontario',
    pais: 'Canada',
    ciudad: 'Toronto',
    cod_postal: 'A1A 1A1',
    telefono: '123456789',
  };
}

export async function signup(page, user) {
  const signupLogin = page.getByRole('link', { name: /signup \/ login/i });
  await expect(signupLogin).toBeVisible();
  await signupLogin.click();

  await expect(page.getByText('New User Signup!')).toBeVisible();
  await page.getByRole('textbox', { name: 'Name' }).fill(user.nick);
  await page.getByTestId('signup-email').fill(user.email);
  await page.getByRole('button', { name: 'Signup' }).click();
}

export async function completeAccountDetails(page, user) {
  await expect(page.getByText('Enter Account Information')).toBeVisible();

  const gender = page.locator('#id_gender1');
  await expect(gender).toBeVisible();
  await gender.check();

  await page.getByTestId('password').fill(user.password);
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

  const createBtn = page.getByTestId('create-account');
  await expect(createBtn).toBeVisible();
  await createBtn.click();
}

export async function verifyAccountAndContinue(page) {
  await expect(page.getByText('Account Created!')).toBeVisible();
  const cont = page.getByTestId('continue-button');
  await expect(cont).toBeVisible();
  await cont.click();
  await expect(page).toHaveURL(HOME_URL);
}

export async function verifyLoggedInAndDelete(page, username) {
  await expect(page.getByText(`Logged in as ${username}`)).toBeVisible({ timeout: 10_000 });

  const del = page.getByRole('link', { name: /delete account/i });
  await expect(del).toBeVisible();
  await del.click();

  await expect(page.getByText('Account Deleted!')).toBeVisible();
  const cont = page.getByTestId('continue-button');
  await expect(cont).toBeVisible();
  await cont.click();
  await expect(page).toHaveURL(HOME_URL);
}

export async function verifyEmailError(page) {
  await expect(page.getByText('Email Address already exist!')).toBeVisible();
}

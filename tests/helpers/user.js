import { expect, test } from '@playwright/test';
export function generateUser() {
  const timestamp = Date.now();
  return {
    nick: 'Carlitoooos',
    email: `carlitos@tevez.com`,
    password: '1234',
    dia: '10',
    mes: '10',
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

export async function logout(page, user) {
  await page.getByRole('link', { name: 'Logout' }).click();
}


export async function signin(page, user) {
  await page.getByRole('link', { name: /signup \/ login/i }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();
  await page.getByTestId('login-email').fill(user.email);
  await page.getByTestId('login-password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
}

export async function wrongSignIn(page, user) {
  await page.getByRole('link', { name: /signup \/ login/i }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();
  await page.getByRole('textbox', { name: 'email' }).fill("error@mail.com");
  await page.getByTestId('login-password').fill("error123");
  await page.getByRole('button', { name: 'Login' }).click();
}

export async function completeAccountDetails(page, user) {
  await expect(page.getByText('Enter Account Information', { exact: false })).toBeVisible();
  await page.locator('#id_gender1').check();
  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('days').selectOption(user.dia);
  await page.getByTestId('months').selectOption(user.mes);
  await page.getByTestId('years').selectOption(user.anio);
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.getByTestId('first_name').fill(user.nombre);
  await page.getByTestId('last_name').fill(user.apellido);
  await page.getByTestId('company').fill(user.empresa);
  await page.getByTestId('address').fill(user.direccion);
  await page.getByTestId('address2').fill(user.direccion_2);
  await page.getByTestId('country').selectOption(user.pais);
  await page.getByTestId('state').fill(user.estado);
  await page.getByTestId('city').fill(user.ciudad);
  await page.getByTestId('zipcode').fill(user.cod_postal);
  await page.getByTestId('mobile_number').fill(user.telefono);
  await page.getByTestId('create-account').click();
}

export async function loginRightAccountDetails(page, user) {

}

export async function loginWrongAccountDetails(page, user) {

}

export async function verifyAccountAndContinue(page) {
  await expect(page.getByText('Account Created!', { exact: false })).toBeVisible();
  await page.getByTestId('continue-button').click();
}

export async function verifyLoggedInAndDelete(page, username) {
  await expect(page.getByText(`Logged in as ${username}`)).toBeVisible();
  await page.getByRole('link', { name: /delete account/i }).click();
  await expect(page.getByText('Account Deleted!', { exact: false })).toBeVisible();
  await page.getByTestId('continue-button').click();
}

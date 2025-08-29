import { expect, test } from '@playwright/test';
export function generateUser() {
  const timestamp = Date.now();
  return {
    name: 'Carlos',
    email: `carlitos@tevez.com`,
    password: '1234',
    birthDay: '10',
    birthMonth: '10',
    birthYear: '1990',
    firstName: 'Carlos',
    lastName: 'Tevez',
    address1: 'Calle Falsa 123',
    address2: 'Piso 1',
    company: 'Coca-Cola',
    state: 'Lima',
    pais: 'Canada',
    city: 'Cochabamba',
    zipcode: '12345',
    mobile: '123456789'
  };
}

export async function signup(page, user) {
  await page.getByRole('link', { name: /signup \/ login/i }).click();
  await expect(page.getByText('New User Signup!')).toBeVisible();
  await page.getByRole('textbox', { name: 'Name' }).fill(user.name);
  await page.getByTestId('signup-email').fill(user.email);
  await page.getByRole('button', { name: 'Signup' }).click();
}

export async function completeAccountDetails(page, user) {
  await expect(page.getByText('Enter Account Information', { exact: false })).toBeVisible();
  await page.locator('#id_gender1').check();
  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('days').selectOption(user.birthDay);
  await page.getByTestId('months').selectOption(user.birthMonth);
  await page.getByTestId('years').selectOption(user.birthYear);
  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();
  await page.getByTestId('first_name').fill(user.firstName);
  await page.getByTestId('last_name').fill(user.lastName);
  await page.getByTestId('company').fill(user.company);
  await page.getByTestId('address').fill(user.address1);
  await page.getByTestId('address2').fill(user.address2);
  await page.getByTestId('country').selectOption(user.pais);
  await page.getByTestId('state').fill(user.state);
  await page.getByTestId('city').fill(user.city);
  await page.getByTestId('zipcode').fill(user.zipcode);
  await page.getByTestId('mobile_number').fill(user.mobile);
  await page.getByTestId('create-account').click();
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

import { expect } from '@playwright/test';

export async function logout(page) {
  const logoutLink = page.getByRole('link', { name: 'Logout' });
  await expect(logoutLink).toBeVisible();
  await logoutLink.click();
  await expect(page.getByText('Login to your account')).toBeVisible();
}

export async function signin(page, user) {
  const signupLogin = page.getByRole('link', { name: /signup \/ login/i });
  await expect(signupLogin).toBeVisible();
  await signupLogin.click();

  await expect(page.getByText('Login to your account')).toBeVisible();
  await page.getByTestId('login-email').fill(user.email);
  await page.getByTestId('login-password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
}

export async function wrongSignIn(page) {
  const signupLogin = page.getByRole('link', { name: /signup \/ login/i });
  await expect(signupLogin).toBeVisible();
  await signupLogin.click();

  await expect(page.getByText('Login to your account')).toBeVisible();
  await page.getByTestId('login-email').fill('error@mail.com');
  await page.getByTestId('login-password').fill('error123');
  await page.getByRole('button', { name: 'Login' }).click();
}

export async function verifyError(page) {
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
}

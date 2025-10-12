import { expect } from '@playwright/test';

export async function contactUs(page) {
  const contact = page.getByRole('link', { name: /contact us/i });
  await expect(contact).toBeVisible();
  await contact.click();
}

export async function verifyContactUs(page) {
  await expect(page.getByText('Get In Touch')).toBeVisible();
}

export async function completeForm(page, user) {
  await page.getByTestId('name').fill(user.nick);
  await page.getByTestId('email').fill(user.email);
  await page.getByTestId('subject').fill('Consulta');
  await page.getByTestId('message').fill('Hola, esta es la consulta. Gracias');

  const success = page.locator('.status.alert.alert-success');
  page.once('dialog', async dialog => {
    await dialog.accept();
  });

  const submit = page.getByRole('button', { name: 'Submit' });
  await expect(submit).toBeEnabled();
  await submit.click();

  await expect(success).toHaveText('Success! Your details have been submitted successfully.');

  const homeBtn = page.locator('a.btn.btn-success[href="/"]').first();
  await expect(homeBtn).toBeVisible();
  await homeBtn.click();
  await expect(page).toHaveURL(/automationexercise\.com\/?$/);
}

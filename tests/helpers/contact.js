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
  await page.locator('input[data-qa="name"]').fill(user.nick);
  await page.locator('input[data-qa="email"]').fill(user.email);
  await page.locator('input[data-qa="subject"]').fill('Consulta');
  await page.locator('textarea[data-qa="message"]').fill('Hola, esto es una prueba.');

  await page.setInputFiles('input[name="upload_file"]', {
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('archivo de prueba'),
  });

  page.once('dialog', d => d.accept());

  await page.getByRole('button', { name: /submit/i }).click();

  await expect(page.locator('.status.alert.alert-success')).toHaveText(
      'Success! Your details have been submitted successfully.',
  );

  await page.locator('a.btn.btn-success').click();
  await expect(page.locator('body')).toBeVisible();
}



import { test, expect} from '@playwright/test';

const HOME_URL = /automationexercise\.com\/?$/;

/** Generar usuario **/
export function generateUser() {
  const salt = `${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  return {
    nick: 'Carlitos',
    email: `carlitos+${salt}@mailinator.com`, // genera un mail único cada vez que se haga un test
    password: '1234',
    dia: '10',
    mes: 'October',   // usamos label para evitar desajustes de value
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
    telefono: '123456789'
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

export async function verifyError(page) {
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
}

export async function verifyEmailError(page) {
  await expect(page.getByText('Email Address already exist!')).toBeVisible();
}

export async function contactUs(page){
  const contact = page.getByRole('link', { name: /contact us/i });
  await expect(contact).toBeVisible();
  await contact.click();
}

export async function verifyContactUs(page){
  await expect(page.getByText('Get In Touch')).toBeVisible();
}

export async function completeForm(page, user) {
  await page.getByTestId('name').fill(user.nick);
  await page.getByTestId('email').fill(user.email);
  await page.getByTestId('subject').fill('Consulta');
  await page.getByTestId('message').fill('Hola, esta es la consulta. Gracias');
  const success = page.locator('.status.alert.alert-success');
  page.once('dialog', async dialog => { await dialog.accept(); });
  const submit = page.getByRole('button', { name: 'Submit' });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(success).toHaveText('Success! Your details have been submitted successfully.');
  const homeBtn = page.locator('a.btn.btn-success[href="/"]').first();
  await expect(homeBtn).toBeVisible();
  await homeBtn.click();
  await expect(page).toHaveURL(HOME_URL);
}

export async function openTestCases(page) {
  const link = page.locator('a[href="/test_cases"]').first();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/test_cases\/?$/);
}

export async function verifyTestCases(page) {
  await expect(page).toHaveURL(/\/test_cases/);
  const title = page.locator('h2', { hasText: 'Test Cases' });
  await expect(title).toBeVisible();
}

export async function openProducts(page) {
  const link = page.locator('a[href="/products"]').first();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/products\/?$/);
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
  const first = page.locator('.nav.nav-pills.nav-justified > li > a').first();
  await expect(first).toBeVisible();
  await first.click();
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
  const input = page.locator('#search_product');
  await expect(input).toBeVisible();
  await input.fill(search);
  const submit = page.locator('#submit_search');
  await expect(submit).toBeVisible();
  await submit.click();
  await expect(page.getByRole('heading', { name: /Searched Products/i })).toBeVisible();
}

export async function verifySearchResults(page, { expectName } = {}) {
  const resultsGrid = page.locator('.features_items .product-image-wrapper');
  await expect(resultsGrid.first()).toBeVisible();
  if (expectName) {
    const name = page.locator('.features_items .productinfo p', { hasText: expectName });
    await expect(name).toBeVisible();
  }
}

export async function verifySubscription(page){
  await page.locator('footer').scrollIntoViewIfNeeded();
  const sub = page.locator('div h2').filter({ hasText: /^subscription$/i });
  await expect(sub).toBeVisible();
  const email = page.locator('#subscribe_email, #susbscribe_email');
  await expect(email).toBeVisible({ timeout: 5000 });
  await email.fill('subscription@email.com');
  const btn = page.locator('#subscribe');
  await expect(btn).toBeVisible();
  await btn.click();
  const successMsg = page.getByText(/you have been successfully subscribed!/i);
  await expect(successMsg).toBeVisible({ timeout: 5000 });
}

export async function verifySubscriptionInCart(page){
  const carrito = page.locator('a[href="/view_cart"]').first();
  await expect(carrito).toBeVisible();
  await carrito.click();
  await expect(page).toHaveURL(/\/view_cart\/?$/);
  await verifySubscription(page);
}

export async function addProductToCart(page, index, { goToCart = false } = {}) {
  const products = page.locator('a[href="/products"]').first();
  await expect(products).toBeVisible();
  await products.click();
  const grid = page.locator('.features_items');
  await grid.waitFor();
  const card = grid.locator('.product-image-wrapper').nth(index);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible();
  await card.hover();
  const addBtn = card.locator(':is(.overlay-content a, a):has-text("Add to cart")').first();
  await addBtn.waitFor({ state: 'visible' });
  await addBtn.click();
  const modal = page.locator('#cartModal');
  await modal.waitFor({ state: 'visible' });
  if (goToCart) {
    const viewCart = page.getByRole('link', { name: /view cart/i });
    await expect(viewCart).toBeVisible(); // verifica que la pagina sea visible
    await viewCart.click();
    await expect(page).toHaveURL(/\/view_cart\/?$/);
  } else {
    const continueBtn = page.getByRole('button', { name: /continue shopping/i });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();
    await modal.waitFor({ state: 'hidden' });
  }
}

// ya hay que estar en /view_cart y debe de haber por lo menos un articulo en el carrito
export async function removeFirstProduct(page) {
  await expect(page).toHaveURL(/\/view_cart\/?/); // opcional
  const rows = page.locator('#cart_info_table tbody tr');
  // cuenta las filas
  const beforeCount = await rows.count();
  expect(beforeCount).toBeGreaterThan(0);
  // primer filla
  const firstRow = rows.first();
  // cliquea en la X
  const deleteBtn = firstRow.locator('.cart_quantity_delete');
  await expect(deleteBtn).toBeVisible();
  await deleteBtn.click();
  // baja el numero de filas
  await expect
      .poll(() => rows.count())
      .toBeLessThan(beforeCount);
  if (beforeCount > 1) {
    await expect(rows).toHaveCount(beforeCount - 1);
  } else {
    // si era el último, algunos sitios muestran mensaje de carrito vacío
    const emptyMsg = page.getByText(/cart is empty/i);
    if (await emptyMsg.isVisible().catch(() => false)) {
      await expect(emptyMsg).toBeVisible();
    }
  }
}



export async function verifyProducts(page) {
  await expect(page).toHaveURL(/\/view_cart\/?$/);
  const rows   = page.locator('#cart_info_table tbody tr:has(td.cart_description)');
  await expect(rows).toHaveCount(2);
  const prices = rows.locator('td.cart_price p');
  const qtys = rows.locator('td.cart_quantity');
  const totals = rows.locator('td.cart_total p.cart_total_price');
  await expect(prices).toHaveCount(2);
  await expect(qtys).toHaveCount(2);
  await expect(totals).toHaveCount(2);
  await expect(prices).toHaveText([/Rs\.\s*\d+/, /Rs\.\s*\d+/]);
  await expect(qtys).toContainText(['1', '1']);
  await expect(totals).toHaveText([/Rs\.\s*\d+/, /Rs\.\s*\d+/]);
}

export async function viewProductDetails(page){
    const card = page.locator('.features_items .product-image-wrapper').first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    const viewProduct = card.locator('a[href^="/product_details/"]');
    await expect(viewProduct.first()).toBeVisible();
    await viewProduct.first().click();
    await expect(page).toHaveURL(/\/product_details\/\d+/);
    await expect(page.locator('.product-information')).toBeVisible();
  }

export async function addFourItems(page, qty) {
    const qtyInput = page.locator('#quantity');
    await expect(qtyInput).toBeVisible();
    await qtyInput.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await page.locator('#quantity').fill(String(qty));
    const addBtn = page.getByRole('button', { name: /add to cart/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    const modal = page.locator('#cartModal');
    await expect(modal).toBeVisible({ timeout: 5000 });
    const viewCart = modal.getByRole('link', { name: /view cart/i });
    await expect(viewCart).toBeVisible();
    await viewCart.click();
    await expect(page).toHaveURL(/\/view_cart\/?$/);
}

export async function verifyCartQuantity(page, qty) {
  const row = page.locator('#cart_info_table tbody tr:has(td.cart_description)').first();
  await expect(row).toBeVisible();
  const qtyCell = row.locator('td.cart_quantity');
  await expect(qtyCell).toContainText(new RegExp(`\\b${qty}\\b`));
}

export async function goToCart(page) {
  const carrito = page.locator('a[href="/view_cart"]').first();
  await expect(carrito).toBeVisible();
  await carrito.click();
  await expect(page).toHaveURL(/\/view_cart\/?$/);
}

export async function proceedToCheckout(page) {
  const proceed = page
      .locator(':is(a.btn.btn-default.check_out, button.check_out)')
      .filter({ hasText: /Proceed\s*To\s*Checkout/i })
      .first();  await expect(proceed).toBeVisible();
  await proceed.click();
}


export async function registerOnCheckout(page) {
  // en la pantalla dle checkout aparece el para registrarse ./loguearse
  await proceedToCheckout(page);
  const reg = page.getByRole('link', { name: /register \/ login/i });
  await expect(reg).toBeVisible();
  await reg.click();
  const user = generateUser();
  await signup(page, user);
  await completeAccountDetails(page, user);
  await verifyAccountAndContinue(page);
  const loggedIn = page.getByText(
      new RegExp(`Logged\\s+in\\s+as\\s+${user.nick}`, 'i')
  );
  await expect(loggedIn).toBeVisible();
  await goToCart(page);
  await proceedToCheckout(page);
return user;
}

export async function verifyAddressAndOrderReview(page, user) {
  await expect(page.getByRole('heading', { name: /address details/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /review your order/i })).toBeVisible();
  const delivery = page.locator('#address_delivery');
  await expect(delivery).toBeVisible();
  await expect(delivery).toContainText(user.nombre);
  await expect(delivery).toContainText(user.apellido);
  await expect(delivery).toContainText(user.empresa);
  await expect(delivery).toContainText(user.direccion);
  await expect(delivery).toContainText(user.direccion_2);
  await expect(delivery).toContainText(user.ciudad);
  await expect(delivery).toContainText(user.estado);
  await expect(delivery).toContainText(user.pais);
  await expect(delivery).toContainText(user.cod_postal);
  await expect(delivery).toContainText(user.telefono);
  await expect(page.locator('#cart_info')).toBeVisible(); // tabla/resumen
}

export async function addCommentAndPlaceOrder(page, comment) {
  const textarea = page.locator('textarea[name="message"]');
  await expect(textarea).toBeVisible();
  await textarea.fill(comment);

  const place = page.locator(':is(a,button):has-text("Place Order")').first();
  await place.scrollIntoViewIfNeeded();
  await expect(place).toBeVisible();
  await place.click();
}

export async function fillPaymentAndConfirm(page, payment) {
  await page.locator('input[name="name_on_card"]').fill(payment.name);
  await page.locator('input[name="card_number"]').fill(payment.number);
  await page.locator('input[name="cvc"]').fill(payment.cvc);
  await page.locator('input[name="expiry_month"]').fill(payment.exp_month);
  await page.locator('input[name="expiry_year"]').fill(payment.exp_year);

  const payBtn = page.getByRole('button', { name: /Pay and Confirm Order/i });
  await expect(payBtn).toBeVisible();
  await payBtn.click();
}

export async function verifyOrderSuccess(page) {
  const success = page.getByText(/Congratulations! Your order has been confirmed!/i);
  await expect(success).toBeVisible({ timeout: 10_000 });
}

// entra a las categorias dress y jeans
export async function checkCategories(page) {
  const sideBar = page.locator('.left-sidebar');
  await sideBar.scrollIntoViewIfNeeded();
  await expect(sideBar).toBeVisible();
  await expect(sideBar).toContainText('Category');
  const women = sideBar.locator('a[href="#Women"]').first();
  await expect(women).toBeVisible();
  await women.click();
  const dress = sideBar.locator('a[href="/category_products/1"]').first();
  await expect(dress).toBeVisible();
  await dress.click();
  const header = page.locator('.title.text-center');
  await expect(header).toHaveText('Women - Dress Products');

  await expect(sideBar).toContainText('Category');
  const men = sideBar.locator('a[href="#Men"]').first();
  await expect(men).toBeVisible();
  await men.click();
  const jeans = sideBar.locator('a[href="/category_products/6"]').first();
  await expect(jeans).toBeVisible();
  await jeans.click();
  const header2 = page.locator('.title.text-center');
  await expect(header2).toHaveText('Men - Jeans Products');
}

export async function checkBrands(page) {
  const sideBar = page.locator('.left-sidebar');
  await sideBar.scrollIntoViewIfNeeded();
  await expect(sideBar).toBeVisible();
  await expect(sideBar).toContainText('Brands');
  const catPOLO = sideBar.locator('a[href="/brand_products/Polo"]').first();
  await expect(catPOLO).toBeVisible();
  await catPOLO.click();
  await expect(page).toHaveURL(new RegExp(`/brand_products/Polo`, 'i'));
  const header = page.locator('.features_items h2.title.text-center');
  await expect(header).toHaveText(`Brand - Polo Products`);
  const cards = page.locator('.features_items .product-image-wrapper');
  // verifica que hayan productos
  const n = await cards.count();
  expect(n).toBeGreaterThan(0);
}

export async function scrollToRecommended(page) {
  const rec = page.locator('a:has-text("Recommended items")').first();
  await expect(rec).toBeVisible();
  await rec.scrollIntoViewIfNeeded();
}

export async function addRecommendedToCart(page) {
  scrollToRecommended(page);
  await page.locator('a:has-text("Recommended items")').click();
  const first = page.locator('div[class="productinfo text-center"] >> text=Add to cart').first();
  await expect(first).toBeVisible();
  await first.click();
  await expect(page.locator('#cartModal')).toBeVisible();
  await page.locator('button:has-text("Continue Shopping")').click();
}

export async function addProductReview(page, { name, email, review }) {
  await expect(page.getByText(/write your review/i)).toBeVisible();
  await page.locator('input[name="name"], #name').fill(name);
  await page.locator('input[name="email"], #email').fill(email);
  await page.locator('textarea[name="review"], #review').fill(review);
  await page.locator('#button-review, button#button-review').click();
}

export async function verifyReviewSubmitted(page) {
  await expect(page.getByText(/thank you for your review\.?/i)).toBeVisible();
}

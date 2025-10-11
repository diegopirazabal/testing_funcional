import { test, expect } from '@playwright/test';
import {
    apiCreateAccount,
    apiUpdateAccount,
    buildCreateForm,
    expectMethodNotSupported,
    uniqueEmail
} from '../helpers/api.js';

const BASE = 'https://automationexercise.com';


test('API 1: Get All Products List', async ({ request }) => {
    const res = await request.get(`${BASE}/api/productsList`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.products)).toBeTruthy();
});


test('API 2: POST To All Products List', async ({ request }) => {
    await expectMethodNotSupported(request, `${BASE}/api/productsList`, 'delete');
});

test('API 3: Get All Brands List', async ({ request }) => {
    const res = await request.get(`${BASE}/api/brandsList`);
    expect(res.status()).toBe(200)
    const json = await res.json();
    expect(Array.isArray(json.brands)).toBeTruthy();
});

test('API 4: PUT To All Brands List', async ({ request }) => {
    await expectMethodNotSupported(request, `${BASE}/api/brandsList`, 'put');

});

test('API 5: POST To Search Product', async ({ request }) => {
    const res = await request.post(`${BASE}/api/searchProduct`, {
        form: { search_product: 'tshirt' },    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.products)).toBeTruthy();
});

test('API 6: POST To Search Product without search_product parameter', async ({ request }) => {
    const res = await request.post(`${BASE}/api/searchProduct`, {
        form: {},
    });
    expect([200, 405]).toContain(res.status()); // devuelve el mensaje de abajo pero con un 200
    const txt = await res.text();
    expect(txt).toMatch(/search_product parameter is missing/i);
});

test('API 7: POST Verify Login (valid details)', async ({ request }) => {
    const res = await request.post(`${BASE}/api/verifyLogin`, {
        form: { email: "mbermudez+testing@gmail.com", password: "Testing123!" },
    });
    const bodyText = await res.text();

    // algunos endpoints devuelven 200 aunque el mensaje sea error; por eso validamos por mensaje
    expect(res.status(), `Body:\n${bodyText}`).toBe(200);
    expect(bodyText).toMatch(/User exists!?/i);
});

test('API 8: POST Verify Login without email parameter', async ({ request }) => {
    const res = await request.post(`${BASE}/api/verifyLogin`, {
        // sin email
        form: { password: "password" },
    });
    const body = await res.text();
    expect([200, 400]).toContain(res.status());
    expect(body).toMatch(
        /Bad request, email or password parameter is missing in POST request./i
    );
});

test('API 9: DELETE Verify Login (method not supported)', async ({ request }) => {
    await expectMethodNotSupported(request, `${BASE}/api/verifyLogin`, 'delete');
});

test('API 10: POST Verify Login with invalid details', async ({ request }) => {
    const invalidEmail = `invalid.${Date.now()}@example.com`; // genera un mail con fecha en un int
    const invalidPassword = 'invalid';

    const res = await request.post(`${BASE}/api/verifyLogin`, {
        form: { email: invalidEmail, password: invalidPassword },
    });
    const body = await res.text();
    expect([200, 404], `Body:\n${body}`).toContain(res.status());
    expect(body).toMatch(/user not found!?/i);
});

test('API 11: POST Create/Register User Account', async ({ request }) => {
    const email = uniqueEmail('testing');
    const password = 'P@ssw0rd!';
    const form = buildCreateForm({ email, password, name: 'QA Tester' });

    const body = await apiCreateAccount(request, BASE, form);
    expect(body).toMatch(/user created!?/i);
});

test('API 12: DELETE To Delete User Account', async ({ request }) => {
    const email = uniqueEmail('Tester');
    const password = 'P@ssw0rd!';
    const form = buildCreateForm({ email, password, name: 'QA Tester' });
    await apiCreateAccount(request, BASE, form);
    const delRes = await request.delete(`${BASE}/api/deleteAccount`, {
        form: { email, password },
    });
    const delBody = await delRes.text();
    expect(delRes.status(), `Delete Body:\n${delBody}`).toBe(200);
    expect(delBody).toMatch(/account deleted!?/i);
});


test('API 13: PUT Update User Account', async ({ request }) => {
    const email = uniqueEmail('Tester');
    const password = 'P@ssw0rd!';
    await apiCreateAccount(request, BASE, buildCreateForm({ email, password, name: 'QA Tester' }));
    const updateForm = buildCreateForm(
        { email, password, name: 'QA Tester' }, // cambio en campos
        {
            title: 'Mrs',
            birth_date: '24',
            birth_month: 'May',
            birth_year: '1999',
            firstname: 'QA',
            lastname: 'Tester v2',
            company: 'FING',
            address1: 'Av Siempre Viva 742',
            address2: 'Piso 2',
            country: 'Canada',
            zipcode: 'M2B2B2',
            state: 'QC',
            city: 'Montreal',
            mobile_number: '987654321',
        }
    );

    const body = await apiUpdateAccount(request, BASE, updateForm);
    expect(body).toMatch(/user updated!?/i);
});

test('API 14: GET user account detail by email', async ({ request }) => {
    const email = uniqueEmail('Tester');
    const password = 'P@ssw0rd!';
    // crear usuario
    await apiCreateAccount(request, BASE, buildCreateForm({ email, password, name: 'Tester' }));
    // consulta detalles
    const res = await request.get(`${BASE}/api/getUserDetailByEmail`, {
        params: { email },
    });
    const body = await res.text();
    expect(res.status(), `Body:\n${body}`).toBe(200);
});

import { test, expect } from '@playwright/test';

// para generar emails únicos
function uniqueEmail(prefix = 'qa') {
    const salt = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return `${prefix}+${salt}@mail.com`;
}

const BASE = 'https://automationexercise.com';

test('API 1: Get All Products List', async ({ request }) => {
    const res = await request.get(`${BASE}/api/productsList`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.products)).toBeTruthy();
});


test('API 2: POST To All Products List', async ({ request }) => {
    const res = await request.post(`${BASE}/api/productsList`);
    expect([200, 405]).toContain(res.status()); // devuelve el mensaje de abajo pero con un 200
    const txt = await res.text();
    expect(txt).toMatch(/This request method is not supported/i);
});

test('API 3: Get All Brands List', async ({ request }) => {
    const res = await request.get(`${BASE}/api/brandsList`);
    expect(res.status()).toBe(200)
    const json = await res.json();
    expect(Array.isArray(json.brands)).toBeTruthy();
});

test('API 4: PUT To All Brands List', async ({ request }) => {
    const res = await request.put(`${BASE}/api/brandsList`);
    expect([200, 405]).toContain(res.status()); // devuelve el mensaje de abajo pero con un 200
    const txt = await res.text();
    expect(txt).toMatch(/This request method is not supported/i);
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
        form: {}, // 400 si falta search_product
    });
    expect(res.status()).toBe(400);
    const txt = await res.text();
    expect(txt).toMatch(/search_product parameter is missing/i);
});
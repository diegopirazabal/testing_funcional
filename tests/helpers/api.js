import { test, expect} from '@playwright/test';

export async function expectMethodNotSupported(request, url, verb = 'get') {
    const res = await request[verb](url);
    const body = await res.text();
    expect([200, 405], `Body:\n${body}`).toContain(res.status());
    expect(body).toMatch(/this request method is not supported/i);
}

export function uniqueEmail(prefix = 'qa') {
    const salt = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return `${prefix}.${salt}@example.com`;
}

export function buildCreateForm({ email, password, name = 'QA Tester' }, overrides = {}) {
    return {
        name,
        email,
        password,
        title: 'Mr',
        birth_date: '24',
        birth_month: 'May',
        birth_year: '1999',
        firstname: 'QA',
        lastname: 'Tester',
        company: 'UTU.',
        address1: 'Calle Falsa 123',
        address2: 'Depto 4B',
        country: 'Canada',
        zipcode: 'M1A1A1',
        state: 'ON',
        city: 'Toronto',
        mobile_number: '123456789',
        ...overrides,
    };
}

export async function apiCreateAccount(request, baseUrl, form) {
    const res = await request.post(`${baseUrl}/api/createAccount`, { form });
    const body = await res.text();
    if (![200, 201].includes(res.status())) {
        throw new Error(`Create failed (${res.status()}):\n${body}`);
    }
    if (!/user created!?/i.test(body)) {
        throw new Error(`Create unexpected body:\n${body}`);
    }
    return body;
}

export async function apiUpdateAccount(request, baseUrl, form) {
    const res = await request.put(`${baseUrl}/api/updateAccount`, { form });
    const body = await res.text();
    if (res.status() !== 200) {
        throw new Error(`Update failed (${res.status()}):\n${body}`);
    }
    if (!/user updated!?/i.test(body)) {
        throw new Error(`Update unexpected body:\n${body}`);
    }
    return body;
}
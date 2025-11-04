/**
 * @jest-environment node
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';

// On crée notre espion pour "getToken"
const mockGetToken = jest.fn();

jest.unstable_mockModule('next-auth/jwt', () => ({
  getToken: mockGetToken,
}));

describe('Tests du Middleware (Sécurité des Routes)', () => {
  let middleware: (request: NextRequest) => Promise<Response>;
  const baseUrl = 'http://localhost:3000';

  beforeEach(async () => {
    mockGetToken.mockClear();

    process.env.AUTH_SECRET = 'secret-test';

    const middlewareModule = await import('@/middleware');
    middleware = middlewareModule.middleware;
  });

  test('redirection /login si visiteur accédant à /annonces/new', async () => {
    mockGetToken.mockResolvedValue(null);

    const req = new NextRequest(`${baseUrl}/annonces/new`);
    const response = await middleware(req);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(`${baseUrl}/login`);
  });

  test('redirection / si un "USER" accède à /annonces/new', async () => {
    mockGetToken.mockResolvedValue({ role: 'USER' });

    const req = new NextRequest(`${baseUrl}/annonces/new`);
    const response = await middleware(req);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(`${baseUrl}/`);
  });

  test('redirection / si un "AGENT" accède à /admin', async () => {
    mockGetToken.mockResolvedValue({ role: 'AGENT' });

    const req = new NextRequest(`${baseUrl}/admin`);
    const response = await middleware(req);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(`${baseUrl}/`);
  });

  test("Autorisation d'un AGENT à accéder à /annonces/new", async () => {
    mockGetToken.mockResolvedValue({ role: 'AGENT' });

    const req = new NextRequest(`${baseUrl}/annonces/new`);
    const response = await middleware(req);


    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBe(null);
  });

  test('Autorisation "ADMIN" à accéder à /admin', async () => {
    mockGetToken.mockResolvedValue({ role: 'ADMIN' });

    const req = new NextRequest(`${baseUrl}/admin`);
    const response = await middleware(req);

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBe(null);
  });

  test('Autorisation à tout rôle pour /annonces/[id]', async () => {
    mockGetToken.mockResolvedValue(null);

    const req = new NextRequest(`${baseUrl}/annonces/12345`);
    const response = await middleware(req);

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBe(null);
  });
});
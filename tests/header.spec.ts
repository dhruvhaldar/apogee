import { test, expect } from '@playwright/test';

test('verify security headers', async ({ page }) => {
  const response = await page.goto('/');
  expect(response).toBeTruthy();
  const headers = response!.headers();

  // Existing headers
  expect(headers['x-dns-prefetch-control']).toBe('off');
  expect(headers['strict-transport-security']).toBe('max-age=63072000; includeSubDomains; preload');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['content-security-policy']).toContain("default-src 'self'");
  expect(headers['permissions-policy']).toContain('camera=()');
  expect(headers['x-permitted-cross-domain-policies']).toBe('none');

  // Enhanced security headers
  expect(headers['cross-origin-opener-policy']).toBe('same-origin');
  expect(headers['cross-origin-resource-policy']).toBe('same-origin');
});

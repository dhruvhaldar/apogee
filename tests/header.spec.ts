import { test, expect } from '@playwright/test';

test('verify security headers', async ({ page }) => {
  const response = await page.goto('/');
  expect(response).toBeTruthy();
  const headers = response!.headers();
  expect(headers['x-dns-prefetch-control']).toBe('off');
});

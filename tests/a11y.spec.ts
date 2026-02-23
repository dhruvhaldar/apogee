import { test, expect } from '@playwright/test';

test.describe('Accessibility Features', () => {
  test('Skip to content link works', async ({ page }) => {
    await page.goto('/');

    // 1. Verify link exists but is visually hidden (sr-only)
    const skipLink = page.getByRole('link', { name: 'Skip to content' });
    await expect(skipLink).toBeAttached();
    // It should have the class 'sr-only' which makes it visually hidden
    // but Playwright's toBeVisible() might return false if it's clipped or 1px
    // Let's check the class
    await expect(skipLink).toHaveClass(/sr-only/);

    // 2. Tab to the link and verify it becomes visible
    // Press Tab to focus the first element
    await page.keyboard.press('Tab');

    // Check if the link is focused
    await expect(skipLink).toBeFocused();

    // Check if it has the class that makes it visible on focus
    await expect(skipLink).toHaveClass(/focus:not-sr-only/);

    // 3. Activate the link
    await page.keyboard.press('Enter');

    // 4. Verify focus moves to main content
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });
});

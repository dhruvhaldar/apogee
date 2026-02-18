import { test, expect } from '@playwright/test';

test.describe('Apogee Calculator App', () => {
  test('has title and main header', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Apogee/);
    await expect(page.locator('h1')).toContainText('APOGEE');
  });

  test('Rocket Calculator works', async ({ page }) => {
    await page.goto('/');
    // Check if component is visible by heading
    await expect(page.getByRole('heading', { name: 'Rocket Equation' })).toBeVisible();
    
    // Default values are pre-filled (300, 1000, 100)
    // Click Calculate Delta-V
    const button = page.getByRole('button', { name: 'Calculate Delta-V' });
    await button.click();
    
    // Expect result ~6774.19
    await expect(page.locator('text=6774.19')).toBeVisible();
  });

  test('Orbit Calculator works', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Orbital Mechanics' })).toBeVisible();
    
    // Default values are pre-filled (400)
    // Click Calculate Orbit
    const button = page.getByRole('button', { name: 'Calculate Orbit' });
    await button.click();
    
    // Expect velocity ~7.672 km/s, period ~92.4 min
    await expect(page.locator('text=7.672')).toBeVisible();
    await expect(page.locator('text=92.4')).toBeVisible();
  });

  test('Life Support Calculator works', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Life Support' })).toBeVisible();
    
    // Default (3 crew, 10 days)
    // Click Calculate Needs
    const button = page.getByRole('button', { name: 'Calculate Needs' });
    await button.click();
    
    // Expect total ~184.2 kg
    await expect(page.locator('text=184.2')).toBeVisible();
  });

  test('Solar Panel Calculator works', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Power Systems' })).toBeVisible();

    // Default (10000 Watts, 0.25 Efficiency)
    // Click Calculate Area
    const button = page.getByRole('button', { name: 'Calculate Area' });
    await button.click();

    // Expect area ~29.39 m²
    await expect(page.locator('text=29.39')).toBeVisible();
  });

  test('Mission Cost Calculator works', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Mission Cost' })).toBeVisible();

    // Default (1000 kg, 2700 $/kg)
    // Click Calculate Cost
    const button = page.getByRole('button', { name: 'Calculate Cost' });
    await button.click();

    // Expect cost to be displayed: 2,700,000
    await expect(page.locator('text=2,700,000')).toBeVisible();
  });
});

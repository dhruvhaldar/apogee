import { test, expect } from '@playwright/test';

test.describe('Apogee Calculator App', () => {
  test('has title and main header', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Apogee/);
    await expect(page.locator('h1')).toContainText('APOGEE');
  });

  test('Rocket Calculator inputs have helper text', async ({ page }) => {
    await page.goto('/');

    // Verify Initial Mass (m0)
    const m0Input = page.locator('#rocket-m0');
    await expect(m0Input).toBeVisible();
    await expect(m0Input).toHaveAttribute('aria-describedby', 'rocket-m0-hint');
    await expect(page.locator('#rocket-m0-hint')).toHaveText('e.g., Falcon 9: ~549,000kg, Saturn V: ~2,970,000kg');

    // Verify Final Mass (mf)
    const mfInput = page.locator('#rocket-mf');
    await expect(mfInput).toBeVisible();
    await expect(mfInput).toHaveAttribute('aria-describedby', 'rocket-mf-hint');
    await expect(page.locator('#rocket-mf-hint')).toHaveText('Dry mass + payload (e.g., ~25,000kg)');
  });

  test('Cost Calculator inputs have helper text', async ({ page }) => {
    await page.goto('/');

    // Verify Payload Mass (payload)
    const payloadInput = page.locator('#cost-payload');
    await expect(payloadInput).toBeVisible();
    await expect(payloadInput).toHaveAttribute('aria-describedby', 'cost-payload-hint');
    await expect(page.locator('#cost-payload-hint')).toHaveText('CubeSat: ~1kg, Starlink: ~260kg, ISS Module: ~15,000kg');
  });

  test('Rocket Calculator works', async ({ page }) => {
    await page.goto('/');
    // Check if component is visible by heading
    await expect(page.getByRole('heading', { name: 'Rocket Equation' })).toBeVisible();
    
    // Default values are pre-filled (300, 1000, 100)
    // Click Calculate Delta-V
    const button = page.getByRole('button', { name: 'Calculate Delta-V' });
    await button.click();
    
    // Expect result ~6,774.19 (after formatter)
    await expect(page.locator('text=6,774.19')).toBeVisible();
    await expect(page.locator('div[aria-live="polite"]').filter({ hasText: 'ΔV =' })).toContainText('6,774.19');
  });

  test('Rocket Calculator submits on Enter', async ({ page }) => {
    await page.goto('/');

    // Use default values (300, 1000, 100)
    // Press Enter in one of the fields
    await page.getByLabel(/Final Mass/i).press('Enter');

    // Expect result ~6774.19 (same as the button click test)
    await expect(page.locator('text=6,774.19')).toBeVisible();
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
    const resultDiv = page.locator('div[aria-live="polite"]').filter({ hasText: 'Velocity' });
    await expect(resultDiv).toBeVisible();
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
    const resultDiv = page.locator('div[aria-live="polite"]').filter({ hasText: 'Total' });
    await expect(resultDiv).toBeVisible();
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
    const resultDiv = page.locator('div[aria-live="polite"]').filter({ hasText: 'm²' });
    await expect(resultDiv).toBeVisible();
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
    const resultDiv = page.locator('div[aria-live="polite"]').filter({ hasText: '$' });
    await expect(resultDiv).toBeVisible();
  });
});

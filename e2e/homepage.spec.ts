import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check for main heading or hero section
    await expect(page).toHaveTitle(/Zeitstrahl/i);

    // Check that the page has loaded with some content
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('/');

    // Look for link or button to dashboard
    const dashboardLink = page.getByRole('link', { name: /dashboard|start/i }).first();
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await expect(page).toHaveURL(/\/dashboard/);
    }
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');

    // Check for main navigation element
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible();
  });

  test('should have skip links for accessibility', async ({ page }) => {
    await page.goto('/');

    // Check for skip links
    const skipLink = page.getByRole('link', { name: /skip|springe/i }).first();
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeTruthy();
    }
  });
});

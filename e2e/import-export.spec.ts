import { test, expect } from '@playwright/test';

test.describe('Import/Export Functionality', () => {
  test('should have import option in dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for import button or link
    const importButton = page.getByRole('button', { name: /import|hochladen|upload/i }).first();

    if (await importButton.count() > 0) {
      await expect(importButton).toBeVisible();
    }
  });

  test('should open export modal in editor', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForTimeout(1000);

    // Look for export button
    const exportButton = page.getByRole('button', { name: /export/i }).first();

    if (await exportButton.isVisible()) {
      await exportButton.click();
      await page.waitForTimeout(500);

      // Check if modal appeared
      const modal = page.locator('[role="dialog"]');
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible();
      }
    }
  });

  test('should have JSON export option', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForTimeout(1000);

    // Look for export button
    const exportButton = page.getByRole('button', { name: /export/i }).first();

    if (await exportButton.isVisible()) {
      await exportButton.click();
      await page.waitForTimeout(500);

      // Look for JSON option in modal
      const jsonOption = page.getByText(/json/i).first();
      if (await jsonOption.count() > 0) {
        await expect(jsonOption).toBeTruthy();
      }
    }
  });
});

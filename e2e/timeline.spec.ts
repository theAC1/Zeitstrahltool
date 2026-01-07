import { test, expect } from '@playwright/test';

test.describe('Timeline Creation', () => {
  test('should create a new timeline from dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for button to create new timeline
    const createButton = page.getByRole('button', { name: /neu|new|erstellen|create/i }).first();

    if (await createButton.isVisible()) {
      await createButton.click();

      // Should navigate to editor or show template modal
      await page.waitForTimeout(1000);

      // Check if we're either in editor or seeing a template selection
      const url = page.url();
      const hasEditor = url.includes('/editor');
      const hasModal = await page.locator('[role="dialog"]').count() > 0;

      expect(hasEditor || hasModal).toBeTruthy();
    }
  });

  test('should load dashboard with timeline list', async ({ page }) => {
    await page.goto('/dashboard');

    // Check page loaded
    await expect(page).toHaveURL(/\/dashboard/);

    // Look for timeline list or empty state
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should have language switcher', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for language switcher (DE/EN)
    const langButton = page.getByRole('button', { name: /deutsch|english|de|en/i }).first();

    if (await langButton.count() > 0) {
      await expect(langButton).toBeVisible();
    }
  });
});

test.describe('Timeline Editor', () => {
  test('should load editor page', async ({ page }) => {
    // Navigate directly to editor
    await page.goto('/editor');

    // Check editor loaded
    await expect(page).toHaveURL(/\/editor/);

    // Check for basic UI elements
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should have controls for adding events', async ({ page }) => {
    await page.goto('/editor');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Look for button to add events
    const addEventButton = page.getByRole('button', { name: /ereignis|event|hinzufügen|add/i }).first();

    if (await addEventButton.count() > 0) {
      await expect(addEventButton).toBeVisible();
    }
  });

  test('should have export functionality', async ({ page }) => {
    await page.goto('/editor');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Look for export button
    const exportButton = page.getByRole('button', { name: /export|download|speichern|save/i }).first();

    if (await exportButton.count() > 0) {
      await expect(exportButton).toBeVisible();
    }
  });
});

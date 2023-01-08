import { test } from '@playwright/test';

test('should login successfully if given correct account and password', async ({ page }) => {
  await page.goto('/login');
});

const { test, expect } = require('@playwright/test');

test('join waitlist success', async ({ page }) => {
  await page.goto('http://localhost:3000'); // make sure `npm run dev` is running
  await page.fill('input[type="email"]', `test${Date.now()}@mail.com`);
  await page.click('text=Join Waitlist');
  await expect(page.locator('text=Thanks! You’re on the list.')).toBeVisible();
});

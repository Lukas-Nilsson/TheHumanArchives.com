import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
});

test('joins waitlist successfully', async ({ page }) => {
  await page.fill('input[type="email"]', `user+${Date.now()}@mail.com`);
  await page.click('text=Join Waitlist');
  await expect(page.locator('text=Success!')).toBeVisible();
});

test('shows validation for invalid email', async ({ page }) => {
  await page.fill('input[type="email"]', 'not-an-email');
  await page.click('text=Join Waitlist');
  await expect(
    page.locator('text=Please enter a valid email.')
  ).toBeVisible();
});

test('handles server error gracefully', async ({ page }) => {
  await page.route('**/api/waitlist', route => route.abort());
  await page.fill('input[type="email"]', `err+${Date.now()}@mail.com`);
  await page.click('text=Join Waitlist');
  await expect(
    page.locator('text=Something went wrong. Please try again later.')
  ).toBeVisible();
});

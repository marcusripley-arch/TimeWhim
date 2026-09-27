const { test, expect } = require('@playwright/test');

test('TimeWhim browser QA harness passes all 11 tests', async ({ page }) => {
  test.setTimeout(180_000);

  // CI must never pollute production analytics.
  await page.route('**/api/capture', (route) =>
    route.fulfill({ status: 204, body: '' })
  );
  await page.route('https://eu.i.posthog.com/**', (route) =>
    route.fulfill({ status: 204, body: '' })
  );

  await page.goto('http://127.0.0.1:4173/qa/', {
    waitUntil: 'domcontentloaded',
  });

  const runButton = page.getByRole('button', { name: 'Run QA' });
  await expect(runButton).toBeEnabled();
  await runButton.click();

  await expect(page.locator('#summary')).toContainText('11/11 tests passed.', {
    timeout: 150_000,
  });
  await expect(runButton).toBeEnabled();

  const failures = await page.locator('#results .fail').allTextContents();
  expect(failures).toEqual([]);
});

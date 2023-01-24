import { test, expect } from '@playwright/test';

import { LoginPage } from './login';

const testUserEmail = 'treeholechan@gmail.com';
const testUserPassword = 'lovemeplease';

test('should login successfully if given correct account and password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isReady();

  await loginPage.login({
    email: testUserEmail,
    password: testUserPassword,
  });

  await expect(page).toHaveURL('/');
});

test('should fail if given wrong account and password', async ({ browser }) => {
  const context = await browser.newContext({
    recordHar: {
      mode: 'minimal',
      path: 'e2e/har/failed-login.har',
      urlFilter: '/p1/*',
    },
  });
  await context.routeFromHAR('e2e/har/failed-login.har', {
    url: '/p1/*',
    notFound: 'fallback',
  });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isReady();
  await loginPage.login({
    email: testUserEmail,
    password: 'wrong-password',
  });

  await expect(loginPage.error).toContainText('登录失败');
  await loginPage.isReady();
  await expect(page).toHaveScreenshot({
    // captcha 在登录失败后会重置
    mask: [loginPage.captcha],
  });
  await context.close();
});

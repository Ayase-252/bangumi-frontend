import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class LoginPage {
  page: Page;
  emailInput: Locator;
  passwordInput: Locator;
  error: Locator;
  captcha: Locator;
  constructor(page: Page) {
    this.page = page;

    this.emailInput = this.page.getByPlaceholder('你的 Email 地址');
    this.passwordInput = this.page.getByPlaceholder('你的登录密码');
    this.error = this.page.getByRole('alert');
    this.captcha = this.page.frameLocator('iframe').locator('body');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(user: { email: string; password: string }) {
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.page.getByText('登录').click();
  }

  async isReady() {
    await expect(this.captcha.locator('#success-text', { hasText: 'Success!' })).toBeVisible({
      timeout: 10000,
    });
  }
}

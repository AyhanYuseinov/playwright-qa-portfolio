import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS, PASSWORD, ERRORS } from '../../data/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard user can log in and sees the product list', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await loginPage.login(USERS.standard, PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.items).not.toHaveCount(0);
  });

  test('locked out user sees an error and stays on the login page', async ({ page }) => {
    await loginPage.login(USERS.lockedOut, PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(ERRORS.lockedOut);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  const invalidCases = [
    { name: 'wrong password', user: USERS.standard, pass: 'wrong_password', error: ERRORS.invalidCredentials },
    { name: 'unknown user', user: 'no_such_user', pass: PASSWORD, error: ERRORS.invalidCredentials },
    { name: 'empty username', user: '', pass: PASSWORD, error: ERRORS.usernameRequired },
    { name: 'empty password', user: USERS.standard, pass: '', error: ERRORS.passwordRequired },
    { name: 'both fields empty', user: '', pass: '', error: ERRORS.usernameRequired },
  ];

  for (const c of invalidCases) {
    test(`shows an error for ${c.name}`, async () => {
      await loginPage.login(c.user, c.pass);

      await expect(loginPage.errorMessage).toHaveText(c.error);
    });
  }

  test('user can log out and returns to the login page', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await loginPage.login(USERS.standard, PASSWORD);
    await inventory.logout();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('inventory page is not accessible without logging in', async ({ page }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.errorMessage).toHaveText(ERRORS.notLoggedIn);
  });
});

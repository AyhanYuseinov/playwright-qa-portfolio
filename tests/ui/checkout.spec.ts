import { test, expect } from '../fixtures';
import { PRODUCTS, CHECKOUT_INFO, CHECKOUT_ERRORS } from '../../data/products';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('user can complete an order with correct totals', async ({ page, checkoutPage }) => {
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    await checkoutPage.fillInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode,
    );
    await checkoutPage.continueButton.click();

    // Overview step: items and amounts
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    await expect(checkoutPage.items).toHaveCount(2);

    const expectedSubtotal = PRODUCTS.backpack.price + PRODUCTS.bikeLight.price;
    const subtotal = await checkoutPage.amountOf(checkoutPage.subtotalLabel);
    const tax = await checkoutPage.amountOf(checkoutPage.taxLabel);
    const total = await checkoutPage.amountOf(checkoutPage.totalLabel);

    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    // Finish
    await checkoutPage.finishButton.click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  const missingFieldCases = [
    { name: 'first name', first: '', last: CHECKOUT_INFO.lastName, zip: CHECKOUT_INFO.postalCode, error: CHECKOUT_ERRORS.firstName },
    { name: 'last name', first: CHECKOUT_INFO.firstName, last: '', zip: CHECKOUT_INFO.postalCode, error: CHECKOUT_ERRORS.lastName },
    { name: 'postal code', first: CHECKOUT_INFO.firstName, last: CHECKOUT_INFO.lastName, zip: '', error: CHECKOUT_ERRORS.postalCode },
  ];

  for (const c of missingFieldCases) {
    test(`shows an error when the ${c.name} is missing`, async ({ page, checkoutPage }) => {
      await checkoutPage.fillInformation(c.first, c.last, c.zip);
      await checkoutPage.continueButton.click();

      await expect(checkoutPage.errorMessage).toHaveText(c.error);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }

  test('cancel returns to the cart', async ({ page, checkoutPage }) => {
    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/cart\.html/);
  });
});

import { test, expect } from '../fixtures';
import { PRODUCTS } from '../../data/products';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('adding products updates the cart badge', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toBeHidden();

    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('removing a product on the inventory page updates the badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.addToCart(PRODUCTS.bikeLight.name);

    await inventoryPage.removeFromCart(PRODUCTS.backpack.name);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('cart page lists the products that were added', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.addToCart(PRODUCTS.boltTShirt.name);
    await inventoryPage.openCart();

    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.items).toHaveCount(2);
    expect(await cartPage.itemNames()).toEqual(
      expect.arrayContaining([PRODUCTS.backpack.name, PRODUCTS.boltTShirt.name]),
    );
  });

  test('removing a product on the cart page empties the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.openCart();

    await cartPage.removeItem(PRODUCTS.backpack.name);

    await expect(cartPage.items).toHaveCount(0);
    await expect(cartPage.cartBadge).toBeHidden();
  });

  test('cart contents survive a page reload', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
    await inventoryPage.openCart();

    await page.reload();

    await expect(cartPage.items).toHaveCount(1);
    expect(await cartPage.itemNames()).toEqual([PRODUCTS.bikeLight.name]);
  });

  test('continue shopping returns to the product list', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.openCart();

    await cartPage.continueShoppingButton.click();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});

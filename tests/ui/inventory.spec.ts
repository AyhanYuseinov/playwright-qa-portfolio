import { test, expect } from '../fixtures';
import { SORT_OPTIONS, SortOption } from '../../data/products';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('shows six products, each with a name and a price', async ({ inventoryPage }) => {
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);

    const names = await inventoryPage.productNames();
    const prices = await inventoryPage.productPrices();
    expect(names.every((n) => n.length > 0)).toBe(true);
    expect(prices.every((p) => p > 0)).toBe(true);
  });

  const sortChecks: Record<SortOption, (names: string[], prices: number[]) => void> = {
    az: (names) => expect(names).toEqual([...names].sort()),
    za: (names) => expect(names).toEqual([...names].sort().reverse()),
    lohi: (_n, prices) => expect(prices).toEqual([...prices].sort((a, b) => a - b)),
    hilo: (_n, prices) => expect(prices).toEqual([...prices].sort((a, b) => b - a)),
  };

  for (const option of SORT_OPTIONS) {
    test(`sorting by "${option}" orders the products correctly`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);

      sortChecks[option](await inventoryPage.productNames(), await inventoryPage.productPrices());
    });
  }
});

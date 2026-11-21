export const PRODUCTS = {
  backpack: { name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { name: 'Sauce Labs Bike Light', price: 9.99 },
  boltTShirt: { name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
} as const;

export const SORT_OPTIONS = ['az', 'za', 'lohi', 'hilo'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const CHECKOUT_INFO = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '8800',
} as const;

export const CHECKOUT_ERRORS = {
  firstName: 'Error: First Name is required',
  lastName: 'Error: Last Name is required',
  postalCode: 'Error: Postal Code is required',
} as const;

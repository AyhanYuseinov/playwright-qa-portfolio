import { test as base } from '@playwright/test';
import { BookingClient } from '../../api/BookingClient';

type ApiFixtures = { api: BookingClient };

// Every API test gets a client, and all bookings it created are deleted afterwards.
export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    const client = new BookingClient(request);
    await use(client);
    await client.cleanup();
  },
});

export { expect } from '@playwright/test';

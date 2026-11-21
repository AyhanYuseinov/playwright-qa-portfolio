export type BookingDates = {
  checkin: string;
  checkout: string;
};

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
};

// Public demo credentials from the Restful-Booker documentation. Not real accounts.
export const API_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
} as const;

/**
 * Builds a valid booking. The first name is unique per call, so a test can find
 * "its" booking in a shared environment where other people also create data.
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    firstname: `Playwright${unique}`,
    lastname: 'Tester',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

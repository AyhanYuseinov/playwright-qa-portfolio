import { test, expect } from './fixtures';
import { buildBooking } from '../../data/booking';

test.describe('Bookings: create and read', () => {
  test('creating a booking returns an id and echoes the data', async ({ api }) => {
    const payload = buildBooking();

    const { id, booking } = await api.createBooking(payload);

    expect(id).toBeGreaterThan(0);
    expect(booking).toMatchObject(payload);
  });

  test('a created booking can be read back by id', async ({ api }) => {
    const payload = buildBooking();
    const { id } = await api.createBooking(payload);

    const response = await api.getBooking(id);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(payload);
  });

  test('a created booking can be found by filtering on its first name', async ({ api }) => {
    const payload = buildBooking();
    const { id } = await api.createBooking(payload);

    const response = await api.getBookingIds({ firstname: payload.firstname });

    expect(response.status()).toBe(200);
    expect(await response.json()).toContainEqual({ bookingid: id });
  });

  test('reading an unknown booking returns 404', async ({ api }) => {
    const response = await api.getBooking(999999999);

    expect(response.status()).toBe(404);
  });

  test('creating a booking with missing fields is rejected', async ({ api }) => {
    const incomplete = { firstname: 'Only', lastname: 'Names' };

    const response = await api.createBookingRaw(incomplete);

    // Known behaviour: this API answers 500 for bad input, where 400 would be the better design.
    expect(response.ok()).toBe(false);
  });
});

test.describe('Bookings: update and delete', () => {
  test('a full update (PUT) replaces the booking data', async ({ api }) => {
    const { id } = await api.createBooking(buildBooking());
    const replacement = buildBooking({ lastname: 'Updated', totalprice: 999, depositpaid: false });

    const response = await api.updateBooking(id, replacement);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(replacement);
    expect(await (await api.getBooking(id)).json()).toMatchObject(replacement);
  });

  test('a partial update (PATCH) changes only the given fields', async ({ api }) => {
    const original = buildBooking();
    const { id } = await api.createBooking(original);

    const response = await api.partialUpdateBooking(id, { totalprice: 321 });

    expect(response.status()).toBe(200);
    const updated = await response.json();
    expect(updated.totalprice).toBe(321);
    expect(updated.firstname).toBe(original.firstname);
    expect(updated.lastname).toBe(original.lastname);
  });

  test('a deleted booking can no longer be read', async ({ api }) => {
    const { id } = await api.createBooking(buildBooking());

    const deleteResponse = await api.deleteBooking(id);
    expect(deleteResponse.status()).toBe(201); // this API answers 201 "Created" for a successful delete

    expect((await api.getBooking(id)).status()).toBe(404);
  });
});

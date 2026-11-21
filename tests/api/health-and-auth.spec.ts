import { test, expect } from './fixtures';
import { API_CREDENTIALS, buildBooking } from '../../data/booking';

test.describe('Health check and authentication', () => {
  test('ping confirms the API is up', async ({ api }) => {
    const response = await api.ping();

    expect(response.status()).toBe(201);
  });

  test('valid credentials return an auth token', async ({ api }) => {
    const response = await api.authenticate(API_CREDENTIALS.username, API_CREDENTIALS.password);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('invalid credentials do not return a token', async ({ api }) => {
    const response = await api.authenticate(API_CREDENTIALS.username, 'wrong_password');
    const body = await response.json();

    // Known quirk: this API answers 200 with a reason instead of 401.
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('updating a booking without a token is forbidden', async ({ api, request }) => {
    const { id } = await api.createBooking(buildBooking());

    const response = await request.put(`/booking/${id}`, { data: buildBooking() });

    expect(response.status()).toBe(403);
  });

  test('deleting a booking without a token is forbidden', async ({ api, request }) => {
    const { id } = await api.createBooking(buildBooking());

    const response = await request.delete(`/booking/${id}`);

    expect(response.status()).toBe(403);
    // The booking must still exist afterwards.
    expect((await api.getBooking(id)).status()).toBe(200);
  });
});

import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { Booking, API_CREDENTIALS } from '../data/booking';

/**
 * Thin client around the Restful-Booker API (the API equivalent of a page object).
 * Methods return the raw response so each test decides what to assert.
 */
export class BookingClient {
  private token?: string;
  private createdIds: number[] = [];

  constructor(private readonly request: APIRequestContext) {}

  ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  authenticate(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  /** Logs in once and caches the token for update and delete calls. */
  async getToken(): Promise<string> {
    if (!this.token) {
      const response = await this.authenticate(API_CREDENTIALS.username, API_CREDENTIALS.password);
      expect(response.ok()).toBe(true);
      const body = await response.json();
      this.token = body.token as string;
    }
    return this.token;
  }

  private async authHeaders() {
    return { Cookie: `token=${await this.getToken()}` };
  }

  getBookingIds(filters: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.get('/booking', { params: filters });
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  /** Raw create call, for negative tests. Does not register the booking for cleanup. */
  createBookingRaw(payload: unknown): Promise<APIResponse> {
    return this.request.post('/booking', { data: payload });
  }

  /** Creates a booking, checks it succeeded and registers it for cleanup after the test. */
  async createBooking(payload: Booking): Promise<{ id: number; booking: Booking }> {
    const response = await this.createBookingRaw(payload);
    expect(response.status()).toBe(200);
    const body = await response.json();
    this.createdIds.push(body.bookingid);
    return { id: body.bookingid, booking: body.booking };
  }

  async updateBooking(id: number, payload: Booking): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: payload, headers: await this.authHeaders() });
  }

  async partialUpdateBooking(id: number, payload: Partial<Booking>): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: payload, headers: await this.authHeaders() });
  }

  async deleteBooking(id: number): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: await this.authHeaders() });
  }

  /** Removes every booking this client created, so tests leave no data behind. */
  async cleanup(): Promise<void> {
    for (const id of this.createdIds) {
      await this.deleteBooking(id); // ignore the result: the test may already have deleted it
    }
    this.createdIds = [];
  }
}

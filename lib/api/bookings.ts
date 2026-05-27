// lib/api/bookings.ts
import { apiClient } from './client';
import { BookingRequest, BookingResponse } from '@/types';

export const bookingsApi = {
  createBooking: async (data: BookingRequest): Promise<BookingResponse> => {
    const response = await apiClient.post('/bookings/', data);
    return response.data;
  },

  getBookingByReference: async (reference: string): Promise<BookingResponse> => {
    const response = await apiClient.get(`/bookings/${reference}/`);
    return response.data;
  },
};
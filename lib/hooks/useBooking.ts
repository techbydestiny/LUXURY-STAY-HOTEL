// lib/hooks/useBooking.ts
import { useState } from 'react';
import { bookingsApi } from '@/lib/api/bookings';
import { roomsApi } from '@/lib/api/rooms';
import { BookingRequest, BookingResponse, AvailabilityRequest } from '@/types';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async (data: AvailabilityRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await roomsApi.checkAvailability(data);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check availability');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (data: BookingRequest): Promise<BookingResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingsApi.createBooking(data);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkAvailability, createBooking, loading, error };
};
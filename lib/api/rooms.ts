// lib/api/rooms.ts
import { apiClient } from './client';
import { Room, AvailabilityRequest, AvailabilityResponse } from '@/types';

export const roomsApi = {
  getAllRooms: async (params?: { featured?: boolean }): Promise<Room[]> => {
    try {
      const response = await apiClient.get('/rooms/', { params });
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return []; // Return empty array on error
    }
  },

  getRoomById: async (id: number): Promise<Room | null> => {
    try {
      const response = await apiClient.get(`/rooms/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      return null;
    }
  },

  checkAvailability: async (data: AvailabilityRequest): Promise<AvailabilityResponse> => {
    try {
      const response = await apiClient.post('/rooms/check-availability/', data);
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      return { available: false, message: 'Error checking availability' };
    }
  },
};
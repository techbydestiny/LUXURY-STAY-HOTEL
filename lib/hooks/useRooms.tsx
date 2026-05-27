// lib/hooks/useRooms.ts
import { useEffect, useState } from 'react';
import { Room } from '@/types';
import { mockRooms } from '@/lib/mock/data';

export const useRooms = (featuredOnly: boolean = false) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchRooms = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let data = [...mockRooms];
        if (featuredOnly) {
          data = data.filter(room => room.is_featured);
        }
        setRooms(data);
        setError(null);
      } catch (err) {
        setError('Failed to load rooms');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [featuredOnly]);

  return { rooms, loading, error };
};

export const useRoom = (id: number) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        const found = mockRooms.find(r => r.id === id);
        setRoom(found || null);
        if (!found) setError('Room not found');
      } catch (err) {
        setError('Failed to load room details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  return { room, loading, error };
};
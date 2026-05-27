'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRooms } from '@/lib/hooks/useRooms';
import { useConfig } from '@/lib/hooks/useConfig';
import { RoomCard } from '@/components/rooms/RoomCard';
import { Loader } from '@/components/ui/Loader';
import Link from 'next/link';
import { formatDate, calculateNights } from '@/lib/utils/formatters';

// Icons
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const HotelIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 21h18M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14"/>
    <path d="M9 7v4M15 7v4"/>
    <rect x="7" y="13" width="4" height="4" rx="1"/>
    <rect x="13" y="13" width="4" height="4" rx="1"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { config } = useConfig();
  const { rooms, loading } = useRooms();
  
  const checkIn = searchParams.get('check_in');
  const checkOut = searchParams.get('check_out');
  const guests = parseInt(searchParams.get('guests') || '1');
  
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);

  useEffect(() => {
    if (rooms.length > 0 && checkIn && checkOut) {
      // Filter available rooms (simplified - in production, call API)
      const available = rooms.filter(room => room.capacity_adults >= guests);
      setAvailableRooms(available);
    }
  }, [rooms, checkIn, checkOut, guests]);

  if (loading) return <Loader fullScreen />;

  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 0;
  const primaryColor = config?.primary_color || '#3B82F6';

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <HotelIcon />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Available Rooms</h1>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {checkIn && (
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span>Check-in:</span>
                <span className="font-medium text-gray-900">{formatDate(checkIn, 'long')}</span>
              </div>
            )}
            {checkOut && (
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span>Check-out:</span>
                <span className="font-medium text-gray-900">{formatDate(checkOut, 'long')}</span>
              </div>
            )}
            {nights > 0 && (
              <div className="flex items-center gap-2">
                <MoonIcon />
                <span>{nights} night{nights > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <UsersIcon />
              <span>{guests} guest{guests > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{availableRooms.length}</span> room{availableRooms.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Results */}
        {availableRooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <HotelIcon />
            </div>
            <p className="text-gray-500 mb-4">No rooms available for your selected dates.</p>
            <Link 
              href="/rooms" 
              className="inline-flex items-center gap-2 text-primary hover:underline"
              style={{ color: primaryColor }}
            >
              View all rooms <ArrowRightIcon />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableRooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
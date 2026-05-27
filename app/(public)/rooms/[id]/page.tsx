// app/(public)/rooms/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import { useRoom } from '@/lib/hooks/useRooms';
import { useConfig } from '@/lib/hooks/useConfig';
import { RoomGallery } from '@/components/rooms/RoomGallery';
import { BookingWidget } from '@/components/booking/BookingWidget';
import { Loader } from '@/components/ui/Loader';
import { formatCurrency } from '@/lib/utils/formatters';
import { Wifi, Coffee, Wind, Tv, Bath, Car, Dumbbell, Utensils } from 'lucide-react';

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'AC': Wind,
  'TV': Tv,
  'Mini Bar': Coffee,
  'Bathroom': Bath,
  'Parking': Car,
  'Gym': Dumbbell,
  'Restaurant': Utensils,
};

export default function RoomDetailPage() {
  const params = useParams();
  const { config } = useConfig();
  const { room, loading } = useRoom(parseInt(params.id as string));

  if (loading) return <Loader fullScreen />;
  if (!room) return <div className="text-center py-12">Room not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Gallery & Details */}
        <div className="lg:col-span-2">
          <RoomGallery images={room.images} roomName={room.room_type} />
          
          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-2">Room {room.room_number} - {room.room_type}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold" style={{ color: config?.primary_color }}>
                {formatCurrency(room.base_price, config?.currency_symbol)}
              </span>
              <span className="text-gray-500">per night</span>
            </div>
            
            <p className="text-gray-600 mb-6">{room.description}</p>
            
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Room Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {room.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Wifi;
                  return (
                    <div key={amenity} className="flex items-center gap-2">
                      <Icon size={18} className="text-primary" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">Room Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Room Number</p>
                  <p className="font-semibold">{room.room_number}</p>
                </div>
                <div>
                  <p className="text-gray-500">Floor</p>
                  <p className="font-semibold">{room.floor}</p>
                </div>
                <div>
                  <p className="text-gray-500">Capacity</p>
                  <p className="font-semibold">{room.capacity_adults} Adults, {room.capacity_children} Children</p>
                </div>
                <div>
                  <p className="text-gray-500">Bed Type</p>
                  <p className="font-semibold">{room.bed_type}</p>
                </div>
                {room.size_sqm && (
                  <div>
                    <p className="text-gray-500">Room Size</p>
                    <p className="font-semibold">{room.size_sqm} m²</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Booking Widget */}
        <div>
          <BookingWidget roomId={room.id} roomPrice={room.base_price} />
        </div>
      </div>
    </div>
  );
}
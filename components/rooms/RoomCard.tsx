// components/rooms/RoomCard.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Room } from '@/types';
import { useConfig } from '@/lib/hooks/useConfig';
import { formatCurrency } from '@/lib/utils/formatters';
import { Users, Maximize, Bed, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  index: number;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, index }) => {
  const { config } = useConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        {room.images[0] && (
          <Image
            src={room.images[0]}
            alt={room.room_type}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold shadow-lg">
          {room.room_type}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">Room {room.room_number}</h3>
        
        {/* Amenities Icons */}
        <div className="flex gap-4 mb-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span className="text-sm">{room.capacity_adults} Adults</span>
          </div>
          {room.size_sqm && (
            <div className="flex items-center gap-1">
              <Maximize size={16} />
              <span className="text-sm">{room.size_sqm} m²</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bed size={16} />
            <span className="text-sm">{room.bed_type}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Price and Button */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-2xl font-bold" style={{ color: config?.primary_color }}>
              {formatCurrency(room.base_price, config?.currency_symbol)}
            </span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          <Link href={`/rooms/${room.id}`}>
            <button
              className="px-4 py-2 rounded-lg text-white font-semibold transition-all hover:scale-105 flex items-center gap-2"
              style={{ backgroundColor: config?.primary_color }}
            >
              View Details <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
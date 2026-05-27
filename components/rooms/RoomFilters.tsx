// components/rooms/RoomFilters.tsx
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Filter, X } from 'lucide-react';

interface Filters {
  roomType: string;
  minPrice: number;
  maxPrice: number;
  capacity: number;
}

interface RoomFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

export const RoomFilters: React.FC<RoomFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    roomType: '',
    minPrice: 0,
    maxPrice: 500000,
    capacity: 1,
  });

  const roomTypes = ['standard', 'deluxe', 'suite', 'executive', 'presidential'];

  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      roomType: '',
      minPrice: 0,
      maxPrice: 500000,
      capacity: 1,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="mb-8">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
      >
        <Filter size={18} />
        Filter Rooms
      </button>

      {/* Desktop Filters */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">Room Type</label>
          <select
            value={filters.roomType}
            onChange={(e) => handleFilterChange('roomType', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Types</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Min Price (₦)</label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Price (₦)</label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Capacity</label>
          <select
            value={filters.capacity}
            onChange={(e) => handleFilterChange('capacity', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Filter Rooms</h3>
                <button onClick={() => setIsOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Room Type</label>
                  <select
                    value={filters.roomType}
                    onChange={(e) => handleFilterChange('roomType', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Types</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Min Price</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Price</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <Button variant="primary" fullWidth onClick={() => setIsOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
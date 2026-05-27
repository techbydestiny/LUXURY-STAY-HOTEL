// app/(public)/rooms/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRooms } from '@/lib/hooks/useRooms';
import { RoomCard } from '@/components/rooms/RoomCard';
import { Loader } from '@/components/ui/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Icons
const GridIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const ListIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const FilterIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3"/></svg>;
const CloseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevronDownIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>;

export default function RoomsPage() {
  const { rooms, loading, error } = useRooms();
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'capacity'>('price_asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    roomType: '',
    minPrice: 0,
    maxPrice: 500000,
    capacity: 1,
    amenities: [] as string[]
  });

  useEffect(() => {
    if (rooms.length > 0) {
      applyFiltersAndSort();
    }
  }, [rooms, filters, sortBy]);

  const applyFiltersAndSort = () => {
    let filtered = [...rooms];
    
    // Apply filters
    if (filters.roomType) {
      filtered = filtered.filter(room => room.room_type === filters.roomType);
    }
    
    if (filters.minPrice > 0) {
      filtered = filtered.filter(room => room.base_price >= filters.minPrice);
    }
    
    if (filters.maxPrice < 500000) {
      filtered = filtered.filter(room => room.base_price <= filters.maxPrice);
    }
    
    if (filters.capacity > 1) {
      filtered = filtered.filter(room => room.capacity_adults >= filters.capacity);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.base_price - b.base_price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.base_price - a.base_price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.room_type.localeCompare(b.room_type));
        break;
      case 'capacity':
        filtered.sort((a, b) => b.capacity_adults - a.capacity_adults);
        break;
    }
    
    setFilteredRooms(filtered);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      roomType: '',
      minPrice: 0,
      maxPrice: 500000,
      capacity: 1,
      amenities: []
    });
  };

  const roomTypes = [
    { value: '', label: 'All Room Types' },
    { value: 'standard', label: 'Standard' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'suite', label: 'Suite' },
    { value: 'executive', label: 'Executive' },
    { value: 'presidential', label: 'Presidential' },
  ];

  const capacityOptions = [1, 2, 3, 4, 5, 6];

  if (loading) return <Loader fullScreen />;
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[300px] bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600')] bg-cover bg-center opacity-20" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Rooms & Suites</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover our collection of beautifully appointed rooms designed for your comfort and luxury
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter and Sort Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
            >
              <FilterIcon /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-sm hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Room Type: A to Z</option>
                <option value="capacity">Guest Capacity</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600'}`}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600'}`}
              >
                <ListIcon />
              </button>
            </div>

            {/* Results Count */}
            <div className="text-gray-600 text-sm">
              Showing <span className="font-semibold text-gray-900">{filteredRooms.length}</span> of {rooms.length} rooms
            </div>
          </div>

          {/* Active Filters */}
          {(filters.roomType || filters.minPrice > 0 || filters.maxPrice < 500000 || filters.capacity > 1) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {filters.roomType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {roomTypes.find(t => t.value === filters.roomType)?.label}
                  <button onClick={() => handleFilterChange('roomType', '')} className="hover:opacity-70"><CloseIcon /></button>
                </span>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 500000) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  ₦{filters.minPrice.toLocaleString()} - ₦{filters.maxPrice.toLocaleString()}
                  <button onClick={() => { handleFilterChange('minPrice', 0); handleFilterChange('maxPrice', 500000); }} className="hover:opacity-70"><CloseIcon /></button>
                </span>
              )}
              {filters.capacity > 1 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {filters.capacity}+ Guests
                  <button onClick={() => handleFilterChange('capacity', 1)} className="hover:opacity-70"><CloseIcon /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-gray-500 text-sm hover:text-primary">Clear All</button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Rooms</h3>
              
              {/* Room Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select
                  value={filters.roomType}
                  onChange={(e) => handleFilterChange('roomType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {roomTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₦)</label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₦{filters.minPrice.toLocaleString()}</span>
                    <span>₦{filters.maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Capacity Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Guest Capacity</label>
                <select
                  value={filters.capacity}
                  onChange={(e) => handleFilterChange('capacity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {capacityOptions.map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Mobile Filter Modal */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end lg:hidden">
              <div className="bg-white w-full rounded-t-xl max-h-[80vh] overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
                  <h3 className="text-lg font-bold">Filter Rooms</h3>
                  <button onClick={() => setIsFilterOpen(false)}><CloseIcon /></button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Room Type</label>
                    <select
                      value={filters.roomType}
                      onChange={(e) => handleFilterChange('roomType', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {roomTypes.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Price: ₦{filters.maxPrice.toLocaleString()}</label>
                    <input type="range" min="0" max="500000" step="10000" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Capacity</label>
                    <select value={filters.capacity} onChange={(e) => handleFilterChange('capacity', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg">
                      {capacityOptions.map(num => (<option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>))}
                    </select>
                  </div>
                </div>
                <div className="p-4 border-t sticky bottom-0 bg-white">
                  <button onClick={() => { applyFiltersAndSort(); setIsFilterOpen(false); }} className="w-full px-4 py-2 bg-primary text-white rounded-lg">Apply Filters</button>
                </div>
              </div>
            </div>
          )}

          {/* Room Results */}
          <div className="flex-1">
            {filteredRooms.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 mb-4">No rooms match your filters</p>
                <button onClick={clearFilters} className="px-6 py-2 bg-primary text-white rounded-lg">Clear Filters</button>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 gap-8"
                    : "space-y-6"
                  }
                >
                  {filteredRooms.map((room, index) => (
                    viewMode === 'grid' ? (
                      <RoomCard key={room.id} room={room} index={index} />
                    ) : (
                      <RoomListItem key={room.id} room={room} index={index} />
                    )
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// List View Component for Rooms
const RoomListItem = ({ room, index }: { room: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-64 h-48 md:h-auto">
          <Image
            src={room.images[0] || '/images/room-placeholder.jpg'}
            alt={room.room_type}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 px-2 py-1 bg-primary text-white text-xs rounded">
            {room.room_type}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
            <h3 className="text-xl font-bold text-gray-900">Room {room.room_number}</h3>
            <div className="text-2xl font-bold text-primary">₦{room.base_price.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/night</span></div>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
            <span>👥 {room.capacity_adults} Adults</span>
            <span>🛏️ {room.bed_type}</span>
            {room.size_sqm && <span>📏 {room.size_sqm} m²</span>}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.slice(0, 4).map((amenity: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{amenity}</span>
            ))}
            {room.amenities.length > 4 && <span className="px-2 py-1 text-gray-500 text-xs">+{room.amenities.length - 4} more</span>}
          </div>
          <Link href={`/rooms/${room.id}`}>
            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition">
              View Details →
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
// components/booking/BookingWidget.tsx
'use client';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/lib/hooks/useBooking';
import { useConfig } from '@/lib/hooks/useConfig';
import { Button } from '@/components/ui/Button';
import { Loader } from 'lucide-react';
import { formatCurrency, calculateNights } from '@/lib/utils/formatters';
import 'react-datepicker/dist/react-datepicker.css';

interface BookingWidgetProps {
  roomId?: number;
  roomPrice?: number;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ roomId, roomPrice }) => {
  const router = useRouter();
  const { config } = useConfig();
  const { checkAvailability, loading } = useBooking();
  
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setChecking(true);
    const result = await checkAvailability({
      check_in: checkIn.toISOString().split('T')[0],
      check_out: checkOut.toISOString().split('T')[0],
      guests: guests,
      room_id: roomId,
    });
    
    setIsAvailable(result?.available || false);
    setChecking(false);
  };

  const handleBookNow = () => {
    if (!checkIn || !checkOut) return;
    
    const params = new URLSearchParams({
      check_in: checkIn.toISOString().split('T')[0],
      check_out: checkOut.toISOString().split('T')[0],
      guests: guests.toString(),
      ...(roomId && { room_id: roomId.toString() }),
    });
    
    router.push(`/booking?${params.toString()}`);
  };

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const totalPrice = roomPrice && nights ? roomPrice * nights : 0;
  const canProceed = checkIn && checkOut;

  // Get primary color from config or use default
  const primaryColor = config?.primary_color || '#3B82F6';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Book Your Stay</h3>
      
      {/* Check-in Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
        <DatePicker
          selected={checkIn}
          onChange={(date) => {
            setCheckIn(date);
            setIsAvailable(null);
          }}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          placeholderText="Select check-in date"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      {/* Check-out Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => {
            setCheckOut(date);
            setIsAvailable(null);
          }}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || new Date()}
          placeholderText="Select check-out date"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      {/* Guests */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
        <select
          value={guests}
          onChange={(e) => {
            setGuests(parseInt(e.target.value));
            setIsAvailable(null);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
          ))}
        </select>
      </div>

      {/* Price Summary */}
      {checkIn && checkOut && roomPrice && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2 text-gray-700">
            <span>{formatCurrency(roomPrice, config?.currency_symbol)} x {nights} nights</span>
            <span>{formatCurrency(totalPrice, config?.currency_symbol)}</span>
          </div>
          {config?.vat_enabled && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>VAT ({config.vat_percentage}%)</span>
              <span>{formatCurrency(totalPrice * config.vat_percentage / 100, config?.currency_symbol)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 mt-2 pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(totalPrice * (1 + (config?.vat_enabled ? config.vat_percentage / 100 : 0)), config?.currency_symbol)}</span>
          </div>
        </div>
      )}

      {/* For room detail page - Show Check Availability button */}
      {roomId && (
        <button
          onClick={handleCheckAvailability}
          disabled={!canProceed || checking}
          className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: primaryColor }}
        >
          {checking ? 'Checking Availability...' : 'Check Availability'}
        </button>
      )}

      {/* Show availability result and Continue button */}
      {isAvailable === true && (
        <button
          onClick={handleBookNow}
          className="w-full mt-3 py-3 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          Continue to Booking →
        </button>
      )}

      {isAvailable === false && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
          Sorry, this room is not available for the selected dates. Please try different dates.
        </div>
      )}

      {/* For pages without roomId - Direct booking button */}
      {!roomId && canProceed && isAvailable === null && (
        <button
          onClick={handleBookNow}
          className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          Continue to Booking →
        </button>
      )}

      {loading && <Loader />}
    </div>
  );
};
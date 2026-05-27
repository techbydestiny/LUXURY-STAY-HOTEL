// app/(public)/booking/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useBooking } from '@/lib/hooks/useBooking';
import { useConfig } from '@/lib/hooks/useConfig';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { PaymentForm } from '@/components/booking/PaymentForm';
import { formatCurrency, calculateNights, formatDate } from '@/lib/utils/formatters';
import toast from 'react-hot-toast';

interface BookingFormData {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests: string;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { config } = useConfig();
  const { createBooking, loading } = useBooking();
  
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>();
  
  const checkIn = searchParams.get('check_in');
  const checkOut = searchParams.get('check_out');
  const guests = parseInt(searchParams.get('guests') || '1');
  const roomId = searchParams.get('room_id');

  useEffect(() => {
    if (!checkIn || !checkOut) {
      router.push('/rooms');
    }
  }, [checkIn, checkOut, router]);

  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 0;

  const onSubmit = async (data: BookingFormData) => {
    const bookingData = {
      room_id: roomId ? parseInt(roomId) : selectedRoom?.id,
      guest_name: data.guest_name,
      guest_email: data.guest_email,
      guest_phone: data.guest_phone,
      check_in_date: checkIn!,
      check_out_date: checkOut!,
      number_of_adults: guests,
      number_of_children: 0,
      special_requests: data.special_requests,
    };
    
    const result = await createBooking(bookingData);
    if (result) {
      setBooking(result);
      setShowPayment(true);
      toast.success('Booking created! Please complete payment.');
    }
  };

  if (!checkIn || !checkOut) {
    return <Loader fullScreen />;
  }

  if (showPayment && booking) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-4">Complete Payment</h1>
          <p className="text-gray-600 mb-6">
            Booking Reference: <strong>{booking.booking_reference}</strong>
          </p>
          <PaymentForm
            bookingReference={booking.booking_reference}
            amount={booking.deposit_amount || booking.total_amount}
            email={watch('guest_email')}
            onSuccess={() => {
              toast.success('Payment successful!');
              router.push(`/booking-confirmation/${booking.booking_reference}`);
            }}
            onClose={() => setShowPayment(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Booking</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Guest Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    {...register('guest_name', { required: 'Name is required' })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.guest_name && <p className="text-red-500 text-sm mt-1">{errors.guest_name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    {...register('guest_email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {errors.guest_email && <p className="text-red-500 text-sm mt-1">{errors.guest_email.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <input
                    {...register('guest_phone', { required: 'Phone number is required' })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {errors.guest_phone && <p className="text-red-500 text-sm mt-1">{errors.guest_phone.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Special Requests (Optional)</label>
                  <textarea
                    {...register('special_requests')}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Any special requirements or requests?"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                className="mt-6"
              >
                Proceed to Payment
              </Button>
            </form>
          </div>
          
          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in</span>
                <span className="font-semibold">{formatDate(checkIn, 'long')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out</span>
                <span className="font-semibold">{formatDate(checkOut, 'long')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nights</span>
                <span className="font-semibold">{nights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests</span>
                <span className="font-semibold">{guests}</span>
              </div>
            </div>
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span style={{ color: config?.primary_color }}>
                  {formatCurrency(10000 * nights, config?.currency_symbol)}
                </span>
              </div>
              {config?.deposit_percentage && (
                <p className="text-sm text-gray-500 mt-2">
                  Deposit: {config.deposit_percentage}% required to confirm booking
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
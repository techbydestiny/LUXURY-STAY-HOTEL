// app/(public)/booking/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useBooking } from '@/lib/hooks/useBooking';
import { useConfig } from '@/lib/hooks/useConfig';
import { useRooms } from '@/lib/hooks/useRooms';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { formatCurrency, calculateNights, formatDate } from '@/lib/utils/formatters';
import Link from 'next/link';
import Head from 'next/head';

// Icons
const CalendarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const CreditCardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const ArrowLeftIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;

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
  const { rooms } = useRooms();
  const { createBooking, loading } = useBooking();
  
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>();
  
  // Get params from URL
  const roomId = searchParams.get('room_id');
  const checkIn = searchParams.get('check_in');
  const checkOut = searchParams.get('check_out');
  const guests = parseInt(searchParams.get('guests') || '1');

  useEffect(() => {
    // Validate required params
    if (!checkIn || !checkOut) {
      router.push('/rooms');
      return;
    }

    // Find selected room
    if (roomId && rooms.length > 0) {
      const room = rooms.find(r => r.id === parseInt(roomId));
      setSelectedRoom(room);
    }
  }, [roomId, rooms, checkIn, checkOut, router]);

  const nights = checkIn && checkOut ? calculateNights(new Date(checkIn), new Date(checkOut)) : 0;
  const subtotal = selectedRoom ? selectedRoom.base_price * nights : 0;
  const vatAmount = config?.vat_enabled ? subtotal * (config.vat_percentage / 100) : 0;
  const serviceCharge = config?.service_charge_enabled ? subtotal * (config.service_charge_percentage / 100) : 0;
  const totalAmount = subtotal + vatAmount + serviceCharge;
  const depositAmount = config?.deposit_percentage ? totalAmount * (config.deposit_percentage / 100) : totalAmount;

  const onSubmit = async (data: BookingFormData) => {
    const bookingRequest = {
      room_id: parseInt(roomId!),
      guest_name: data.guest_name,
      guest_email: data.guest_email,
      guest_phone: data.guest_phone,
      check_in_date: checkIn!,
      check_out_date: checkOut!,
      number_of_adults: guests,
      number_of_children: 0,
      special_requests: data.special_requests,
    };
    
    const result = await createBooking(bookingRequest);
    if (result) {
      setBookingData(result);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePaystackPayment = () => {
    // This will integrate with Paystack
    // For now, just show success
    router.push(`/booking-confirmation/${bookingData?.booking_reference}?payment=success`);
  };

  if (!checkIn || !checkOut) {
    return <Loader fullScreen />;
  }

  const primaryColor = config?.primary_color || '#3B82F6';

  return (
    <>
      <Head>
        <title>Complete Your Booking | {config?.hotel_name}</title>
        <meta name="description" content="Complete your hotel booking with guest information and secure payment." />
      </Head>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
                <span className="font-medium">Guest Details</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-200" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                {step === 1 ? (
                  <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Guest Information</h1>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <UserIcon />
                          </div>
                          <input
                            {...register('guest_name', { required: 'Full name is required' })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.guest_name && <p className="text-red-500 text-sm mt-1">{errors.guest_name.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MailIcon />
                          </div>
                          <input
                            type="email"
                            {...register('guest_email', { 
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="john@example.com"
                          />
                        </div>
                        {errors.guest_email && <p className="text-red-500 text-sm mt-1">{errors.guest_email.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <PhoneIcon />
                          </div>
                          <input
                            {...register('guest_phone', { required: 'Phone number is required' })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="+234 123 456 7890"
                          />
                        </div>
                        {errors.guest_phone && <p className="text-red-500 text-sm mt-1">{errors.guest_phone.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                        <textarea
                          {...register('special_requests')}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                          placeholder="Any special requirements or requests? (e.g., extra bed, dietary restrictions, etc.)"
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Link href="/rooms">
                          <button type="button" className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center gap-2">
                            <ArrowLeftIcon /> Back
                          </button>
                        </Link>
                        <Button type="submit" variant="primary" loading={loading}>
                          Proceed to Payment
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Complete Payment</h1>
                    
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm">
                          Booking Reference: <strong>{bookingData?.booking_reference}</strong>
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                            <input type="radio" name="payment_method" defaultChecked className="text-primary" />
                            <CreditCardIcon />
                            <div>
                              <p className="font-medium text-gray-900">Pay with Card</p>
                              <p className="text-sm text-gray-500">Secure payment via Paystack</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                            <input type="radio" name="payment_method" className="text-primary" />
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                            <div>
                              <p className="font-medium text-gray-900">Bank Transfer</p>
                              <p className="text-sm text-gray-500">Pay at the hotel or via transfer</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <Button variant="primary" fullWidth onClick={handlePaystackPayment}>
                        Pay {formatCurrency(depositAmount, config?.currency_symbol)} Now
                      </Button>

                      <p className="text-center text-sm text-gray-500">
                        Your payment is secure and encrypted
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
                  
                  {selectedRoom && (
                    <div className="space-y-4">
                      <div className="pb-4 border-b">
                        <p className="font-semibold text-gray-900">{selectedRoom.room_type} - Room {selectedRoom.room_number}</p>
                        <p className="text-sm text-gray-500">Sleeps {guests} guest{guests > 1 ? 's' : ''}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-in</span>
                          <span className="font-medium text-gray-900">{formatDate(checkIn, 'long')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-out</span>
                          <span className="font-medium text-gray-900">{formatDate(checkOut, 'long')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nights</span>
                          <span className="font-medium text-gray-900">{nights}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Room Rate</span>
                          <span>{formatCurrency(subtotal, config?.currency_symbol)}</span>
                        </div>
                        {config?.vat_enabled && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">VAT ({config.vat_percentage}%)</span>
                            <span>{formatCurrency(vatAmount, config?.currency_symbol)}</span>
                          </div>
                        )}
                        {config?.service_charge_enabled && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Service Charge ({config.service_charge_percentage}%)</span>
                            <span>{formatCurrency(serviceCharge, config?.currency_symbol)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold pt-2 border-t">
                          <span className="text-gray-900">Total</span>
                          <span className="text-primary font-bold">{formatCurrency(totalAmount, config?.currency_symbol)}</span>
                        </div>
                        {config?.deposit_percentage && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Deposit Required ({config.deposit_percentage}%)</span>
                            <span className="text-green-600">{formatCurrency(depositAmount, config?.currency_symbol)}</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 text-center text-xs text-gray-500">
                        <CalendarIcon className="inline mr-1" size={12} />
                        Free cancellation up to {config?.cancellation_hours || 24} hours before check-in
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
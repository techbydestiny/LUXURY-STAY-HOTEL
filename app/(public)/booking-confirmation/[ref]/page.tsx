// app/(public)/booking-confirmation/[ref]/page.tsx
'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { bookingsApi } from '@/lib/api/bookings';
import { useConfig } from '@/lib/hooks/useConfig';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { CheckCircle, Download, Mail, WhatsApp } from 'lucide-react';
import Link from 'next/link';

export default function BookingConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { config } = useConfig();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingsApi.getBookingByReference(params.ref as string);
        setBooking(data);
      } catch (error) {
        console.error('Failed to fetch booking', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [params.ref]);

  const handleDownloadReceipt = () => {
    // This would call API to generate PDF
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/receipts/${booking?.booking_reference}/pdf`, '_blank');
  };

  const handleWhatsApp = () => {
    const message = `Hello, I have a booking with reference ${booking?.booking_reference}. Please confirm.`;
    window.open(`https://wa.me/${config?.contact_whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <Loader fullScreen />;
  if (!booking) return <div className="text-center py-12">Booking not found</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        {paymentStatus === 'success' ? (
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        ) : (
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">!</span>
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-2">
          {paymentStatus === 'success' ? 'Booking Confirmed!' : 'Booking Received'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your booking reference: <strong className="text-lg">{booking.booking_reference}</strong>
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h2 className="font-semibold mb-3">Booking Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Guest Name:</span>
              <span className="font-medium">{booking.guest_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Room:</span>
              <span className="font-medium">Room {booking.room?.room_number} - {booking.room?.room_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium">{formatDate(booking.check_in_date, 'long')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">{formatDate(booking.check_out_date, 'long')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nights:</span>
              <span className="font-medium">{booking.number_of_nights}</span>
            </div>
            <div className="flex justify-between pt-2 border-t mt-2">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold" style={{ color: config?.primary_color }}>
                {formatCurrency(booking.total_amount, config?.currency_symbol)}
              </span>
            </div>
            {booking.deposit_amount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Paid:</span>
                <span className="text-green-600 font-medium">{formatCurrency(booking.deposit_amount, config?.currency_symbol)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" onClick={handleDownloadReceipt}>
            <Download size={18} className="mr-2" />
            Download Receipt
          </Button>
          
          {config?.contact_whatsapp && (
            <Button variant="outline" onClick={handleWhatsApp}>
              <WhatsApp size={18} className="mr-2" />
              Contact on WhatsApp
            </Button>
          )}
          
          <Link href="/">
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <Mail size={14} className="inline mr-1" />
          A confirmation email has been sent to {booking.guest_email}
        </div>
      </div>
    </div>
  );
}
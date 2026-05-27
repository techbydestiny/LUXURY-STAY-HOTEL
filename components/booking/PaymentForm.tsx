// components/booking/PaymentForm.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePaystackPayment } from '@paystack/inline-js';
import { Button } from '@/components/ui/Button';
import { useConfig } from '@/lib/hooks/useConfig';
import { formatCurrency } from '@/lib/utils/formatters';

interface PaymentFormProps {
  bookingReference: string;
  amount: number;
  email: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingReference,
  amount,
  email,
  onSuccess,
  onClose,
}) => {
  const { config } = useConfig();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'transfer'>('online');

  const initializePayment = usePaystackPayment({
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    email: email,
    amount: amount * 100, // Paystack uses kobo
    reference: `BOOK-${bookingReference}-${Date.now()}`,
    metadata: {
      booking_reference: bookingReference,
      hotel: config?.hotel_name,
    },
    onSuccess: () => {
      onSuccess();
      router.push(`/booking-confirmation/${bookingReference}?payment=success`);
    },
    onClose: () => {
      onClose();
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="online"
            checked={paymentMethod === 'online'}
            onChange={(e) => setPaymentMethod(e.target.value as 'online')}
          />
          <span>Pay Online (Card/Transfer)</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="transfer"
            checked={paymentMethod === 'transfer'}
            onChange={(e) => setPaymentMethod(e.target.value as 'transfer')}
          />
          <span>Bank Transfer (Pay at Hotel)</span>
        </label>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between mb-2">
          <span>Total Amount:</span>
          <span className="font-bold text-xl">{formatCurrency(amount, config?.currency_symbol)}</span>
        </div>
        {config?.deposit_percentage && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Deposit Required ({config.deposit_percentage}%):</span>
            <span>{formatCurrency(amount * config.deposit_percentage / 100, config?.currency_symbol)}</span>
          </div>
        )}
      </div>

      {paymentMethod === 'online' && (
        <Button variant="primary" fullWidth onClick={initializePayment}>
          Pay Now
        </Button>
      )}

      {paymentMethod === 'transfer' && (
        <div className="space-y-3">
          <div className="p-4 border rounded-lg bg-yellow-50">
            <p className="font-semibold mb-2">Bank Transfer Details:</p>
            <p>Bank: Example Bank</p>
            <p>Account Name: {config?.hotel_name}</p>
            <p>Account Number: 1234567890</p>
            <p className="text-sm text-gray-600 mt-2">Use your booking reference as payment description</p>
          </div>
          <Button variant="primary" fullWidth onClick={onSuccess}>
            I've Made the Transfer
          </Button>
        </div>
      )}
    </div>
  );
};
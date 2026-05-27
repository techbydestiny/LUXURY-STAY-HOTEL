// lib/utils/formatters.ts
export const formatCurrency = (amount: number, symbol: string = '₦'): string => {
  return `${symbol}${amount.toLocaleString()}`;
};

export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return d.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
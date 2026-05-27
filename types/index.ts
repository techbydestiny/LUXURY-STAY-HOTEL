// types/index.ts

export interface HotelConfig {
  id: number;
  hotel_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo: string | null;
  favicon: string | null;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string | null;
  about_text: string;
  amenities: string[];
  social_media: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  contact_phone: string;
  contact_phone_alt: string;
  contact_email: string;
  contact_whatsapp: string;
  contact_address: string;
  google_maps_embed: string;
  vat_enabled: boolean;
  vat_percentage: number;
  service_charge_enabled: boolean;
  service_charge_percentage: number;
  realtime_check_enabled: boolean;
  allow_online_payments: boolean;
  deposit_percentage: number;
  cancellation_hours: number;
  currency_symbol: string;
  currency_code: string;
  receipt_footer_text: string;
}

export interface Room {
  id: number;
  room_number: string;
  room_type: string;
  floor: number;
  base_price: number;
  weekend_price: number | null;
  capacity_adults: number;
  capacity_children: number;
  bed_type: string;
  size_sqm: number | null;
  description: string;
  amenities: string[];
  images: string[];
  status: string;
  is_featured: boolean;
}

export interface BookingRequest {
  room_id: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_adults: number;
  number_of_children: number;
  special_requests?: string;
}

export interface BookingResponse {
  id: number;
  booking_reference: string;
  guest_name: string;
  room: Room;
  check_in_date: string;
  check_out_date: string;
  number_of_nights: number;
  subtotal: number;
  vat_amount: number;
  service_charge_amount: number;
  total_amount: number;
  deposit_amount: number;
  balance_amount: number;
  status: string;
  payment_url?: string;
}

export interface AvailabilityRequest {
  check_in: string;
  check_out: string;
  guests?: number;
  room_id?: number;
}

export interface AvailabilityResponse {
  available: boolean;
  available_rooms?: Room[];
  message?: string;
}
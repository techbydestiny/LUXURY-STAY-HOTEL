// app/(public)/page.tsx
'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useRooms } from '@/lib/hooks/useRooms';
import { useConfig } from '@/lib/hooks/useConfig';
import { RoomCard } from '@/components/rooms/RoomCard';
import { Button } from '@/components/ui/Button';
import { ImageSlider } from '@/components/ui/ImageSlider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Icons
const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Search Widget Component - Properly positioned
const SearchWidget = () => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates');
      return;
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate) {
      setError('Check-out date must be after check-in date');
      return;
    }
    
    setError('');
    router.push(`/search?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="relative z-20 px-4" style={{ marginTop: '-60px' }}>
      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Check In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Check Out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || today}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-700"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 rounded-lg text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                style={{ backgroundColor: '#3B82F6' }}
              >
                <SearchIcon />
                Check Availability
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { config } = useConfig();
  const { rooms } = useRooms(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fallback values
  const hotelName = config?.hotel_name || 'Luxury Stay Hotel';
  const primaryColor = config?.primary_color || '#3B82F6';
  const contactPhone = config?.contact_phone || '+234 123 456 7890';
  const contactAddress = config?.contact_address || '123 Victoria Island, Lagos, Nigeria';
  const contactEmail = config?.contact_email || 'info@luxurystay.com';

  const featuredRooms = rooms?.slice(0, 3) || [];

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600',
      title: 'Welcome to Luxury Stay',
      subtitle: 'Experience unparalleled comfort and elegance',
      description: 'Discover a world of luxury where every detail is crafted for your perfect stay',
    },
    {
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600',
      title: 'Luxury Redefined',
      subtitle: 'Indulge in world-class amenities',
      description: 'From fine dining to relaxing spa treatments, we have everything you need',
    },
    {
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600',
      title: 'Perfect Getaway',
      subtitle: 'Create unforgettable memories',
      description: 'Whether for business or pleasure, make your stay truly memorable',
    },
  ];

  const reviews = [
    { name: 'John Doe', rating: 5, text: 'Excellent service and beautiful rooms. Will definitely come back!', date: '2024-03-15' },
    { name: 'Sarah Johnson', rating: 5, text: 'One of the best hotels I have ever stayed at. Highly recommended.', date: '2024-03-10' },
    { name: 'Michael Okonkwo', rating: 4, text: 'Great location, friendly staff, and amazing facilities.', date: '2024-03-05' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Head>
        <title>{hotelName} | Luxury Hotel | Book Your Stay</title>
        <meta name="description" content={`Experience luxury at ${hotelName}. Premium rooms, fine dining, and exceptional service.`} />
      </Head>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          effect="fade"
          className="h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="relative h-full flex items-center px-4 md:px-20 lg:px-32">
                  <div className="max-w-4xl">
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">{slide.title}</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-xl md:text-2xl text-gray-200 mb-4">{slide.subtitle}</motion.p>
                    <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-gray-300 mb-8 max-w-2xl text-lg">{slide.description}</motion.p>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
                      <Link href="/rooms">
                        <button className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 shadow-lg flex items-center gap-2" style={{ backgroundColor: primaryColor }}>
                          Explore Rooms <ArrowRightIcon />
                        </button>
                      </Link>
                      <a href={`tel:${contactPhone}`}>
                        <button className="px-8 py-3 rounded-lg font-semibold bg-white/10 backdrop-blur-md border border-white/30 text-white transition-all hover:bg-white/20 flex items-center gap-2">
                          <PhoneIcon /> Call Now
                        </button>
                      </a>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Search Widget - Placed outside hero, below it */}
      <SearchWidget />

      {/* Stats Section */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><div className="text-white text-3xl md:text-4xl font-bold">500+</div><div className="text-white/80 text-sm">Happy Guests</div></div>
            <div><div className="text-white text-3xl md:text-4xl font-bold">50+</div><div className="text-white/80 text-sm">Luxury Rooms</div></div>
            <div><div className="text-white text-3xl md:text-4xl font-bold">4.8</div><div className="text-white/80 text-sm">Google Rating</div></div>
            <div><div className="text-white text-3xl md:text-4xl font-bold">24/7</div><div className="text-white/80 text-sm">Guest Support</div></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Our Hotel</h2>
              <div className="space-y-4 text-gray-600">
                <p>Welcome to {hotelName}, where luxury meets comfort. Located in the heart of the city, our hotel offers a perfect blend of modern elegance and warm hospitality.</p>
                <p>We are dedicated to providing exceptional service and creating memorable experiences for our guests. Each room is thoughtfully designed with premium amenities and stunning views.</p>
                <p>Whether traveling for business or pleasure, our team is committed to making your stay unforgettable.</p>
              </div>
              <Link href="/about">
                <button className="mt-6 px-6 py-2 rounded-lg text-white font-semibold transition-all hover:scale-105 flex items-center gap-2" style={{ backgroundColor: primaryColor }}>
                  Learn More <ArrowRightIcon />
                </button>
              </Link>
            </div>
            <ImageSlider images={[]} height="500px" />
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Rooms */}
      {featuredRooms.length > 0 && (
        <AnimatedSection className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Rooms</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Choose from our selection of beautifully appointed rooms and suites</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.map((room, index) => (
                <RoomCard key={room.id} room={room} index={index} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/rooms">
                <Button variant="primary" size="lg">View All Rooms <ArrowRightIcon /></Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Guest Reviews Section */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (<StarIcon key={i} className="text-yellow-400" />))}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Guest Reviews</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">What our guests are saying about their experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl shadow-md"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (<StarIcon key={i} className="text-yellow-400 w-4 h-4" />))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{review.text}"</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{review.name}</span>
                  <span className="text-gray-400 text-sm">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg">
              <span className="text-gray-600">Powered by</span>
              <span className="font-semibold text-gray-900">Google Reviews</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond promptly.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="text-primary"><MapPinIcon /></div>
                <div><h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3><p className="text-gray-600 text-sm">{contactAddress}</p></div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="text-primary"><PhoneIcon /></div>
                <div><h3 className="font-semibold text-gray-900 mb-1">Call Us</h3><p className="text-gray-600 text-sm">{contactPhone}</p></div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="text-primary"><MailIcon /></div>
                <div><h3 className="font-semibold text-gray-900 mb-1">Email Us</h3><p className="text-gray-600 text-sm">{contactEmail}</p></div>
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-xl">
                <p className="text-gray-700 text-sm">Check-in: 2:00 PM | Check-out: 11:00 AM</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Send a Message</h3>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">Thank you! We'll get back to you shortly.</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows={4} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" />
                  <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting ? 'Sending...' : 'Send Message'} <SendIcon />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600')] bg-cover bg-center opacity-10" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Experience Luxury Firsthand</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Discover why guests choose us for their most memorable stays.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rooms">
                <button className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 shadow-lg flex items-center gap-2" style={{ backgroundColor: primaryColor }}>
                  View Our Rooms <ArrowRightIcon />
                </button>
              </Link>
              <a href={`tel:${contactPhone}`}>
                <button className="px-8 py-3 rounded-lg font-semibold border-2 border-white text-white transition-all hover:bg-white hover:text-gray-900 flex items-center gap-2">
                  <PhoneIcon /> Speak with Concierge
                </button>
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-6">Best Rate Guaranteed | Flexible Cancellation | Secure Booking</p>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
}
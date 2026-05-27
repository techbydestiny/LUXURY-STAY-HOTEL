// app/(public)/about/page.tsx
'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useConfig } from '@/lib/hooks/useConfig';
import { Loader } from '@/components/ui/Loader';
import { ImageSlider } from '@/components/ui/ImageSlider';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

// Icons
const AwardIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="6"/><path d="M12 14v8M8 18h8"/></svg>;
const HeartIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const UsersIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ClockIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const StarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;

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

export default function AboutPage() {
  const { config, loading } = useConfig();

  if (loading) return <Loader fullScreen />;

  const values = [
    { icon: AwardIcon, title: 'Excellence', description: 'We strive for excellence in every aspect of our service, from check-in to check-out.' },
    { icon: HeartIcon, title: 'Hospitality', description: 'Warm Nigerian hospitality combined with international standards of service.' },
    { icon: UsersIcon, title: 'Guest First', description: 'Our guests are at the heart of everything we do. Your comfort is our priority.' },
    { icon: ClockIcon, title: 'Timeless Service', description: 'Dedicated to creating memorable experiences that last a lifetime.' },
  ];

  const milestones = [
    { year: '2018', title: 'Grand Opening', description: 'Luxury Stay Hotel opened its doors to welcome the first guests.' },
    { year: '2019', title: 'Award Winner', description: 'Received the Luxury Hotel of the Year award.' },
    { year: '2021', title: 'Expansion', description: 'Added 20 new luxury suites and a world-class spa.' },
    { year: '2023', title: 'Green Hotel', description: 'Achieved eco-friendly certification for sustainable practices.' },
  ];

  const team = [
    { name: 'James Okonkwo', role: 'General Manager', image: 'https://randomuser.me/api/portraits/men/1.jpg', experience: '15 years of luxury hospitality experience' },
    { name: 'Sarah Adeyemi', role: 'Head of Guest Relations', image: 'https://randomuser.me/api/portraits/women/1.jpg', experience: '10 years in premium guest services' },
    { name: 'Michael Eze', role: 'Executive Chef', image: 'https://randomuser.me/api/portraits/men/2.jpg', experience: 'Award-winning culinary expert' },
  ];

  return (
    <>
      <Head>
        <title>About Us | {config?.hotel_name} - Luxury Hotel</title>
        <meta name="description" content={`Learn about ${config?.hotel_name}'s story, our commitment to excellence, and the team dedicated to making your stay unforgettable.`} />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600')] bg-cover bg-center opacity-20" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About {config?.hotel_name}</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover our story, our values, and the team dedicated to making your stay exceptional
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2018, {config?.hotel_name} was born from a vision to create a sanctuary of luxury and comfort in the heart of the city. What began as a dream has grown into one of the most celebrated hotels in the region.
                </p>
                <p>
                  Our name has become synonymous with exceptional service, elegant design, and unforgettable experiences. Every detail, from our architecture to our amenities, has been carefully curated to provide our guests with the perfect blend of modern luxury and warm hospitality.
                </p>
                <p>
                  Today, we continue to evolve and innovate while staying true to our founding principles: putting our guests first, maintaining the highest standards of excellence, and creating lasting memories for everyone who walks through our doors.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
                alt="Hotel lobby"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Our Values Section */}
      <AnimatedSection className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <value.icon />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Our Journey Timeline */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Celebrating milestones along our path to excellence
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-200 h-full hidden lg:block" />
            <div className="space-y-8 lg:space-y-0">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:ml-auto lg:pl-12'}`}
                >
                  <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <div className="text-primary font-bold text-2xl mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Why Choose Us Section */}
      <AnimatedSection className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Us</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              What sets us apart from the rest
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Prime Location', desc: 'Conveniently located in the heart of the city with easy access to attractions' },
              { title: 'Luxury Amenities', desc: 'World-class facilities including spa, fitness center, and fine dining' },
              { title: 'Exceptional Service', desc: 'Dedicated staff committed to making your stay unforgettable' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
              >
                <CheckIcon />
                <h3 className="text-xl font-semibold text-white mb-2 mt-4">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Our Team Section */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The dedicated professionals behind your exceptional experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.experience}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Call to Action */}
      <AnimatedSection className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Experience Luxury With Us</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Book your stay and discover why guests return to us again and again
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <button className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 shadow-lg" style={{ backgroundColor: config?.primary_color || '#3B82F6' }}>
                Book Your Stay
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-8 py-3 rounded-lg font-semibold border-2 border-white text-white transition-all hover:bg-white hover:text-gray-900">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
// components/layout/Hero.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useConfig } from '@/lib/hooks/useConfig';
import { Button } from '@/components/ui/Button';

export const Hero: React.FC = () => {
  const { config } = useConfig();

  if (!config) return null;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${config.hero_image || '/images/default-hero.jpg'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          {config.hero_title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl mb-8"
        >
          {config.hero_subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          <Link href="/rooms">
            <Button variant="primary" size="lg">
              View Rooms
            </Button>
          </Link>
          <Link href="/booking">
            <Button variant="outline" size="lg">
              Book Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
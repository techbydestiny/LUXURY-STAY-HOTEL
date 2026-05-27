// app/(public)/gallery/page.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';

// Icons
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// Gallery categories - FIXED: Proper spacing and formatting
const categories = [
  { id: 'all', name: 'All Photos' },
  { id: 'rooms', name: 'Rooms & Suites' },
  { id: 'dining', name: 'Dining' },
  { id: 'amenities', name: 'Amenities' },
  { id: 'events', name: 'Events' },
  { id: 'exterior', name: 'Exterior' },
];

// Gallery images data
const galleryImages = [
  // Rooms & Suites
  { id: 1, src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', title: 'Deluxe King Room', category: 'rooms', description: 'Spacious room with king-size bed and city view' },
  { id: 2, src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', title: 'Executive Suite', category: 'rooms', description: 'Luxury suite with separate living area' },
  { id: 3, src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', title: 'Presidential Suite', category: 'rooms', description: 'Our most luxurious accommodation' },
  { id: 4, src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', title: 'Junior Suite', category: 'rooms', description: 'Elegant suite with premium amenities' },
  { id: 5, src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', title: 'Standard Room', category: 'rooms', description: 'Comfortable room with modern design' },
  
  // Dining
  { id: 6, src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', title: 'Fine Dining Restaurant', category: 'dining', description: 'Exquisite dining experience' },
  { id: 7, src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', title: 'Breakfast Buffet', category: 'dining', description: 'Start your day with our delicious buffet' },
  { id: 8, src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', title: 'Restaurant Ambiance', category: 'dining', description: 'Elegant dining atmosphere' },
  { id: 9, src: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800', title: 'Bar & Lounge', category: 'dining', description: 'Relax with signature cocktails' },
  
  // Amenities
  { id: 10, src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800', title: 'Swimming Pool', category: 'amenities', description: 'Infinity pool with city views' },
  { id: 11, src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800', title: 'Fitness Center', category: 'amenities', description: 'State-of-the-art gym equipment' },
  { id: 12, src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', title: 'Luxury Spa', category: 'amenities', description: 'Relax and rejuvenate' },
  { id: 13, src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', title: 'Spa Treatment Room', category: 'amenities', description: 'Professional spa services' },
  
  // Events
  { id: 14, src: 'https://images.unsplash.com/photo-1464366400600-7168b3ae0f73?w=800', title: 'Conference Hall', category: 'events', description: 'Perfect for business meetings' },
  { id: 15, src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', title: 'Wedding Venue', category: 'events', description: 'Dream wedding destination' },
  { id: 16, src: 'https://images.unsplash.com/photo-1511795409674-a4252a912aa5?w=800', title: 'Event Space', category: 'events', description: 'Versatile event facilities' },
  
  // Exterior
  { id: 17, src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', title: 'Hotel Exterior', category: 'exterior', description: 'Stunning architectural design' },
  { id: 18, src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800', title: 'Hotel Entrance', category: 'exterior', description: 'Grand entrance' },
  { id: 19, src: 'https://images.unsplash.com/photo-1583391733956-6c2f6c6e65cd?w=800', title: 'Garden View', category: 'exterior', description: 'Beautiful landscaped gardens' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image: typeof galleryImages[0], index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredImages.length
      : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <>
      <Head>
        <title>Gallery | Luxury Stay Hotel</title>
        <meta name="description" content="Explore our photo gallery featuring luxurious rooms, fine dining, swimming pool, spa, and event spaces at Luxury Stay Hotel." />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[300px] bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600')] bg-cover bg-center opacity-20" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Photo Gallery</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Explore our hotel through images - from luxurious rooms to exquisite dining and relaxing amenities
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter - FIXED: Better spacing and styling */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No images found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(image, index)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow">
                  <div className="relative h-72">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg">{image.title}</h3>
                      <p className="text-sm text-gray-200">{image.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              >
                <CloseIcon />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronRightIcon />
              </button>

              <div
                className="relative max-w-5xl max-h-[85vh] w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-[70vh] md:h-[80vh]">
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="text-center mt-4 text-white">
                  <h3 className="text-xl font-semibold mb-1">{selectedImage.title}</h3>
                  <p className="text-gray-300">{selectedImage.description}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {currentIndex + 1} / {filteredImages.length}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instagram Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Follow Us on Instagram</h2>
          <p className="text-gray-600 mb-6">Stay updated with our latest photos and offers</p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            @luxurystayhotel
          </a>
        </div>
      </div>
    </>
  );
}
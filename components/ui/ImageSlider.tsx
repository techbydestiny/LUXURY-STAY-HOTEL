// components/ui/ImageSlider.tsx
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageSliderProps {
  images?: string[];
  height?: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images = [], 
  height = '500px' 
}) => {
  const defaultImages = [
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
  ];

  const slideImages = images.length > 0 ? images : defaultImages;

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ height }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="h-full w-full"
      >
        {slideImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`Hotel image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
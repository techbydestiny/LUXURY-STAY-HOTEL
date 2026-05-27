// components/rooms/RoomGallery.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export const RoomGallery: React.FC<RoomGalleryProps> = ({ images, roomName }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  if (!images.length) return null;

  return (
    <div className="space-y-4">
      {/* Main Swiper */}
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper }}
        className="rounded-xl overflow-hidden"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src={image}
                alt={`${roomName} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          spaceBetween={10}
          slidesPerView={4}
          className="h-24 rounded-lg"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-20 cursor-pointer rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};
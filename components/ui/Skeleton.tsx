// components/ui/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const baseStyles = 'animate-pulse bg-gray-200 rounded';
  
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };
  
  const styles = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined),
  };
  
  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={styles}
    />
  );
};

// Skeleton Card for rooms
export const RoomCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <Skeleton height={256} />
      <div className="p-6">
        <Skeleton width="60%" height={24} className="mb-2" />
        <div className="flex gap-4 mb-4">
          <Skeleton width={80} height={16} />
          <Skeleton width={80} height={16} />
        </div>
        <Skeleton height={40} className="mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton width={100} height={24} />
          <Skeleton width={100} height={36} />
        </div>
      </div>
    </div>
  );
};
// components/ui/Loader.tsx
import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };
  
  const loaderContent = (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} border-gray-200 border-t-primary rounded-full animate-spin`}
        style={{ borderTopColor: 'var(--primary-color)' }}
      />
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }
  
  return loaderContent;
};
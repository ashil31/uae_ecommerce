
import React from 'react';

const SkeletonLoader = ({ type = 'product', count = 1, className = '' }) => {
  const renderProductSkeleton = () => (
    <div className="animate-pulse bg-[#f7f5f1] rounded-lg overflow-hidden">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded"></div>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="flex space-x-4">
            <div className="h-12 bg-gray-200 rounded w-32"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const skeletonMap = {
    product: renderProductSkeleton,
    list: renderListSkeleton,
    detail: renderDetailSkeleton,
  };

  const SkeletonComponent = skeletonMap[type] || renderProductSkeleton;

  if (type === 'product') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            <SkeletonComponent />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <SkeletonComponent />
    </div>
  );
};

export default SkeletonLoader;

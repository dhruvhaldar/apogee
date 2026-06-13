import React from 'react';

const FormSkeleton = () => {
  return (
    <div>
      <span className="sr-only" role="status">Loading calculator form...</span>
      <div className="space-y-3 animate-pulse" aria-hidden="true">
        <div>
          <div className="h-4 bg-white/20 rounded w-1/3 mb-1"></div>
          <div className="h-10 bg-white/10 rounded w-full"></div>
        </div>
        <div>
          <div className="h-4 bg-white/20 rounded w-1/3 mb-1"></div>
          <div className="h-10 bg-white/10 rounded w-full"></div>
        </div>
        <div className="h-10 bg-white/20 rounded w-full mt-4"></div>
      </div>
    </div>
  );
};

export default FormSkeleton;

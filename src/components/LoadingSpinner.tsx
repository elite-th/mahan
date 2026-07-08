import React from 'react';

const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex justify-center items-center py-8 ${className}`} aria-live="polite">
    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-sky-400" role="status">
        <span className="sr-only">در حال بارگذاری...</span>
    </div>
  </div>
);

export default LoadingSpinner;
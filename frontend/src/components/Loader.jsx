import { Loader2 } from 'lucide-react';

// Full page loader - modern pulsing design
export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 animate-pulse"></div>
        {/* Spinning ring */}
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-violet-500 animate-spin"></div>
        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Button loader (small) - modern style
export const ButtonLoader = ({ className = '' }) => {
  return (
    <div className={`relative w-5 h-5 ${className}`}>
      <div className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
    </div>
  );
};

// Inline loader
export const InlineLoader = ({ size = 'md', color = 'violet' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorMap = {
    violet: 'border-t-violet-500',
    blue: 'border-t-blue-500',
    green: 'border-t-green-500',
    purple: 'border-t-purple-500',
    indigo: 'border-t-indigo-500',
    red: 'border-t-red-500'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full border-2 border-white/20 ${colorMap[color]} animate-spin`}></div>
  );
};

export default PageLoader;

import React from 'react';
import { Loader2 } from 'lucide-react';

export const TypingIndicator = () => (
  <div className="typing-dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

export const SkeletonLoader = ({ className = '', style = {} }) => (
  <div className={`skeleton ${className}`} style={style}></div>
);

export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center w-full h-screen bg-primary">
    <Loader2 className="animate-spin text-accent-primary mb-4" size={48} />
    <div className="text-secondary font-medium">Loading application...</div>
  </div>
);

export const StatusMessage = ({ message, isLoading = false }) => (
  <div className="flex items-center gap-2 text-sm text-secondary">
    {isLoading && <Loader2 size={16} className="animate-spin" />}
    <span>{message}</span>
  </div>
);

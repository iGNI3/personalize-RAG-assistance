import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export const GlowButton = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses = {
    primary: 'btn-primary-clay',
    secondary: 'btn-secondary-clay',
    danger: 'btn-danger-clay',
    ghost: 'flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-button font-medium transition-colors duration-200'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={clsx(
        baseClasses[variant] || baseClasses.primary,
        disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-white flex-shrink-0" />
      ) : Icon ? (
        <Icon className="w-5 h-5 flex-shrink-0" />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const ClayCard = ({
  children,
  className = '',
  hover = true,
  onClick,
  glass = false,
  padding = 'p-6',
  ...props
}) => {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      onClick={onClick}
      whileHover={hover ? { y: -4, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      className={clsx(
        'rounded-clay text-left w-full transition-all duration-200 relative overflow-hidden',
        padding,
        glass ? 'glass-surface' : 'clay-surface',
        className
      )}
      {...props}
    >
      {/* Subtle top inner border highlight simulation */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      {children}
    </Component>
  );
};

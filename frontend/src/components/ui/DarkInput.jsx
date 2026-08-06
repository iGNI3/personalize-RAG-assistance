import React, { forwardRef } from 'react';
import clsx from 'clsx';

export const DarkInput = forwardRef(({
  icon: Icon,
  suffix,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={clsx('relative flex items-center w-full', containerClassName)}>
      {Icon && (
        <div className="absolute left-4 text-text-muted pointer-events-none flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        ref={ref}
        className={clsx(
          'input-dark w-full transition-all duration-200 font-sans',
          Icon ? 'pl-12' : 'pl-4',
          suffix ? 'pr-12' : 'pr-4',
          className
        )}
        {...props}
      />
      {suffix && (
        <div className="absolute right-3.5 text-text-muted flex items-center">
          {suffix}
        </div>
      )}
    </div>
  );
});

DarkInput.displayName = 'DarkInput';

import React from 'react';
import clsx from 'clsx';

export const PillBadge = ({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'running' | 'thinking' | 'paused'
  dot = false,
  pulse = false,
  className = '',
}) => {
  // Map semantic AI statuses to color palettes
  const mappedVariant = {
    Running: 'success',
    Thinking: 'accent',
    Connected: 'success',
    Active: 'success',
    Idle: 'default',
    Paused: 'warning',
    Warning: 'warning',
    Failed: 'danger',
    Disconnected: 'danger',
    Offline: 'danger',
  }[children] || variant;

  const dotColors = {
    default: 'bg-text-muted',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    danger: 'bg-status-danger',
    accent: 'bg-accent-hover',
  };

  const badgeVariants = {
    default: 'badge-pill text-text-secondary',
    success: 'badge-pill badge-success',
    warning: 'badge-pill badge-warning',
    danger: 'badge-pill badge-danger',
    accent: 'badge-pill badge-accent',
  };

  return (
    <span className={clsx(badgeVariants[mappedVariant] || badgeVariants.default, className)}>
      {(dot || ['Running', 'Thinking', 'Connected', 'Active'].includes(children)) && (
        <span className="relative flex h-2 w-2">
          {(pulse || ['Running', 'Thinking', 'Connected'].includes(children)) && (
            <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', dotColors[mappedVariant] || dotColors.default)} />
          )}
          <span className={clsx('relative inline-flex rounded-full h-2 w-2', dotColors[mappedVariant] || dotColors.default)} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, ArrowRight } from 'lucide-react';
import { GlowButton } from './GlowButton';
import { ClayCard } from './ClayCard';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title,
  description,
  primaryAction,
  primaryLabel = 'Create New',
  secondaryAction,
  secondaryLabel = 'Learn More',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto my-12"
    >
      <ClayCard hover={false} className="p-12 text-center flex flex-col items-center border-dashed border-white/10 bg-bg-card/40">
        {/* Handcrafted Animated Illustration Sphere */}
        <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-status-success/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-clay bg-gradient-to-br from-bg-floating to-bg-secondary border border-white/10 shadow-clay-card flex items-center justify-center">
            <Icon className="w-10 h-10 text-accent-hover" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-glow-accent animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-text-primary mb-3 font-sans tracking-tight">
          {title || "No items found in this workspace"}
        </h3>

        <p className="text-text-secondary text-base max-w-md mb-8 leading-relaxed">
          {description || "Get started by launching a new autonomous agent or connecting a Model Context Protocol server."}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {primaryAction && (
            <GlowButton variant="primary" onClick={primaryAction} icon={Plus}>
              {primaryLabel}
            </GlowButton>
          )}
          {secondaryAction && (
            <GlowButton variant="secondary" onClick={secondaryAction}>
              {secondaryLabel}
            </GlowButton>
          )}
        </div>
      </ClayCard>
    </motion.div>
  );
};

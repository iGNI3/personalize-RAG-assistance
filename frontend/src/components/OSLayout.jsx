import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FloatingSidebar } from './FloatingSidebar';
import { TopNavbar } from './TopNavbar';
import { CommandPalette } from './CommandPalette';

export const OSLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex relative overflow-hidden">
      {/* Soft Ambient Light Glow Sphere in Upper-Left & Bottom-Right */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px] pointer-events-none z-0" />
      <div className="fixed -bottom-60 -right-60 w-[800px] h-[800px] rounded-full bg-purple-600/10 blur-[160px] pointer-events-none z-0" />

      {/* Persistent Floating Navigation Shell */}
      <FloatingSidebar />
      <TopNavbar />
      <CommandPalette />

      {/* Main Operating System Workspace Area (Offset for 90px floating sidebar and 80px navbar) */}
      <main className="flex-1 pl-[138px] pr-10 pt-24 pb-12 z-10 overflow-y-auto min-h-screen transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full h-full max-w-[1600px] mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Module scope: no temporal-dead-zone risk, and an unknown `size` can never throw.
const SIZES = {
  xs: { width: 22, height: 22, radius: 7,  eyeSize: 3,  eyeGap: 4,  visorHeight: 9,  visorWidth: 15 },
  sm: { width: 36, height: 36, radius: 10, eyeSize: 5,  eyeGap: 6,  visorHeight: 14, visorWidth: 24 },
  md: { width: 44, height: 44, radius: 14, eyeSize: 6,  eyeGap: 8,  visorHeight: 18, visorWidth: 30 },
  lg: { width: 64, height: 64, radius: 20, eyeSize: 9,  eyeGap: 12, visorHeight: 26, visorWidth: 44 },
  xl: { width: 96, height: 96, radius: 30, eyeSize: 14, eyeGap: 18, visorHeight: 38, visorWidth: 68 },
};

const AIMascot = ({ size = "md", state = "idle", className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Automatic random blinking animation
  useEffect(() => {
    let blinkTimer;
    const interval = setInterval(() => {
      if (state === "idle" && !isHovered) {
        setIsBlinking(true);
        blinkTimer = setTimeout(() => setIsBlinking(false), 200);
      }
    }, 4500);
    return () => {
      clearInterval(interval);
      clearTimeout(blinkTimer);
    };
  }, [state, isHovered]);

  const dimensions = SIZES[size] || SIZES.md;

  // Eye shape generation based on mood
  const getEyeVariant = () => {
    if (isBlinking) return { scaleY: 0.1, scaleX: 1.2, transition: { duration: 0.1 } };
    if (state === "thinking") return { scaleY: 0.6, y: [0, -2, 0], opacity: [0.7, 1, 0.7], transition: { duration: 0.8, repeat: Infinity } };
    if (isHovered || state === "happy") return { scaleY: 0.5, scaleX: 1.3, rotate: -5, y: -2 };
    return { scaleY: 1, scaleX: 1, y: 0 };
  };

  return (
    <div className={`inline-flex items-center justify-center relative select-none ${className}`}>
      {/* Ambient glowing aura beneath the clay head */}
      <motion.div
        className="absolute rounded-full filter blur-xl pointer-events-none"
        style={{
          width: dimensions.width * 0.9,
          height: dimensions.height * 0.7,
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.6) 0%, rgba(139, 92, 246, 0.4) 60%, transparent 100%)",
          bottom: -4,
          zIndex: 0
        }}
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Claymorphic 3D Head */}
      <motion.div
        className="relative z-10 flex items-center justify-center cursor-pointer overflow-hidden"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: dimensions.radius,
          background: "linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #ec4899 100%)",
          boxShadow: `
            0 12px 24px -6px rgba(99, 102, 241, 0.5),
            inset -4px -4px 10px rgba(0, 0, 0, 0.45),
            inset 4px 4px 10px rgba(255, 255, 255, 0.6)
          `,
          border: "1px solid rgba(255, 255, 255, 0.25)"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          y: [-2, 2, -2],
          rotate: [-1, 1, -1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08, y: -4, transition: { duration: 0.2, type: "spring", stiffness: 300 } }}
        whileTap={{ scale: 0.94 }}
      >
        {/* Iridescent Specular Highlight on Top-Left Corner */}
        <div 
          className="absolute pointer-events-none" 
          style={{
            top: 4,
            left: 6,
            width: dimensions.width * 0.45,
            height: dimensions.height * 0.25,
            background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 80%)",
            borderRadius: "999px",
            transform: "rotate(-15deg)"
          }}
        />

        {/* Liquid Glass Visor Screen */}
        <div
          className="relative flex items-center justify-center overflow-hidden transition-all duration-300"
          style={{
            width: dimensions.visorWidth,
            height: dimensions.visorHeight,
            borderRadius: dimensions.radius * 0.6,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.15)"
          }}
        >
          {/* Cyberpunk LED Eyes Container */}
          <div className="flex items-center justify-center" style={{ gap: dimensions.eyeGap }}>
            {/* Left Eye */}
            <motion.div
              className="rounded-full bg-cyan-400"
              style={{
                width: dimensions.eyeSize,
                height: dimensions.eyeSize,
                boxShadow: "0 0 10px #22d3ee, 0 0 18px #38bdf8"
              }}
              animate={getEyeVariant()}
            />

            {/* Right Eye */}
            <motion.div
              className="rounded-full bg-cyan-400"
              style={{
                width: dimensions.eyeSize,
                height: dimensions.eyeSize,
                boxShadow: "0 0 10px #22d3ee, 0 0 18px #38bdf8"
              }}
              animate={getEyeVariant()}
            />
          </div>

          {/* Visor internal reflection */}
          <div 
            className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"
          />
        </div>

        {/* Cute reactive blush cheeks when hovered */}
        {isHovered && (
          <>
            <motion.div 
              initial={{ opacity: 0, scale: 0 }} 
              animate={{ opacity: 0.8, scale: 1 }}
              className="absolute bg-rose-400 rounded-full blur-xs pointer-events-none"
              style={{ width: size === 'xl' ? 12 : 6, height: size === 'xl' ? 6 : 4, bottom: size === 'xl' ? 22 : 10, left: size === 'xl' ? 14 : 6 }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0 }} 
              animate={{ opacity: 0.8, scale: 1 }}
              className="absolute bg-rose-400 rounded-full blur-xs pointer-events-none"
              style={{ width: size === 'xl' ? 12 : 6, height: size === 'xl' ? 6 : 4, bottom: size === 'xl' ? 22 : 10, right: size === 'xl' ? 14 : 6 }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AIMascot;

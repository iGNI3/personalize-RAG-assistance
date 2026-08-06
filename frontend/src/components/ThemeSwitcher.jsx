import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSwitcher = () => {
  const { theme, setTheme, currentTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-1.5 rounded-full flex items-center gap-2.5 bg-card-glass hover:bg-card-glass-hover border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 backdrop-blur-xl group"
        title="Switch OS Theme & Color Scheme"
      >
        <div className="flex -space-x-1 overflow-hidden p-0.5">
          {currentTheme.preview.map((color, i) => (
            <span
              key={i}
              className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-white/50 shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-slate-100 hidden sm:inline tracking-tight group-hover:text-cyan-300 transition-colors">
          {currentTheme.name}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, type: 'spring', stiffness: 350 }}
            className="absolute right-0 mt-3 w-72 p-2.5 rounded-[24px] z-50 bg-slate-900/95 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-3xl"
          >
            <div className="px-3 py-2 border-b border-white/10 mb-1.5 flex items-center justify-between">
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={14} className="text-cyan-400" /> OS Color Scheme
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                Designs
              </span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto pr-0.5">
              {themes.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <motion.button
                    key={t.id}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-start justify-between text-left transition-all duration-200 border ${isSelected
                      ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-pink-500/20 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                  >
                    <div className="flex flex-col gap-1 pr-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1 overflow-hidden">
                          {t.preview.map((color, i) => (
                            <span
                              key={i}
                              className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-white/40 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-extrabold text-slate-100 tracking-tight">
                          {t.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 leading-tight">
                        {t.description}
                      </span>
                    </div>

                    <div className="mt-0.5 flex-shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shadow-[0_0_10px_#22d3ee]">
                          <Check size={12} strokeWidth={3.5} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/20" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-white/10 text-center text-[10px] font-semibold text-slate-500">
              Inspired by Meng To & DesignCode architecture
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;

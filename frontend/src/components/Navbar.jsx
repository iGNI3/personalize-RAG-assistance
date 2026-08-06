import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, FileText, BarChart2, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AIMascot from './AIMascot';
import ThemeSwitcher from './ThemeSwitcher';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isGuest } = useAuth();

  return (
    <header className="navbar backdrop-blur-2xl bg-bg-primary/70 border-b border-white/10 shadow-lg transition-all">
      <div className="flex items-center gap-3">
        <AIMascot size="md" state="idle" />
        <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 tracking-wide hidden sm:block drop-shadow-sm">
          RAG Assistant
        </span>
      </div>

      <nav className="nav-links bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner flex gap-1">
        <NavLink to="/" className={({isActive}) => `nav-link px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-pink-500/20 text-cyan-300 font-bold border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'hover:bg-white/10 text-slate-300'}`}>
          <MessageSquare size={18} />
          <span className="hidden md:inline">Chat</span>
        </NavLink>
        <NavLink to="/documents" className={({isActive}) => `nav-link px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-pink-500/20 text-cyan-300 font-bold border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'hover:bg-white/10 text-slate-300'}`}>
          <FileText size={18} />
          <span className="hidden md:inline">Documents</span>
        </NavLink>
        <NavLink to="/metrics" className={({isActive}) => `nav-link px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-pink-500/20 text-cyan-300 font-bold border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'hover:bg-white/10 text-slate-300'}`}>
          <BarChart2 size={18} />
          <span className="hidden md:inline">Metrics</span>
        </NavLink>
      </nav>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <ThemeSwitcher />

            {/* Unified User Profile Glass Capsule */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.01 }}
              className="bg-slate-900/70 hover:bg-slate-900/90 border border-white/15 hover:border-cyan-400/40 py-1.5 pl-3 pr-1.5 rounded-full backdrop-blur-2xl shadow-[0_4px_25px_rgba(0,0,0,0.35)] flex items-center gap-3 transition-all duration-300 group cursor-pointer"
            >
              {/* Online pulse indicator + Username */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" title="Online & Connected" />
                <span className="text-sm font-bold text-slate-100 tracking-tight">{user.full_name || user.username}</span>
              </div>

              {/* Minimalist Tech Role Tag or Guest Badge */}
              {isGuest ? (
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  GUEST SANDBOX • NO HISTORY
                </span>
              ) : (
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                  {user.role}
                </span>
              )}

              {/* Inline Sleek Avatar Circle */}
              <motion.div 
                whileHover={{ scale: 1.08, rotate: 6 }}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 p-0.5 shadow-md flex items-center justify-center text-white font-black text-xs shadow-indigo-500/30 border border-white/40"
              >
                <div className="w-full h-full bg-slate-950/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </motion.div>
            </motion.div>

            {/* Circular Glass Logout Control */}
            <motion.button 
              whileHover={{ scale: 1.08, rotate: -8 }}
              whileTap={{ scale: 0.92 }}
              onClick={logout} 
              className="w-10 h-10 rounded-full bg-slate-900/70 hover:bg-rose-500/20 border border-white/15 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-center backdrop-blur-2xl transition-all duration-300" 
              title="Logout"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

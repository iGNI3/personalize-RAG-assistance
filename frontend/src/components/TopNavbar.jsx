import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  Search,
  Command,
  Bell,
  ChevronDown,
  Sparkles,
  Cpu,
  Layers,
  LogOut,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useAuth } from '../contexts/AuthContext';
import { PillBadge } from './ui/PillBadge';

export const TopNavbar = () => {
  const location = useLocation();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const currentWorkspace = useOSStore(state => state.currentWorkspace);
  const workspaces = useOSStore(state => state.workspaces);
  const switchWorkspace = useOSStore(state => state.switchWorkspace);
  const setCommandPaletteOpen = useOSStore(state => state.setCommandPaletteOpen);
  const agents = useOSStore(state => state.agents);
  const analytics = useOSStore(state => state.analytics);
  
  const { user, logout, isGuest } = useAuth();

  // Generate breadcrumb from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPageTitle = pathParts[0] ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : 'OS Desktop';
  
  const activeAgentsCount = agents.filter(a => a.status === 'Running' || a.status === 'Thinking').length;

  return (
    <header className="fixed top-0 right-0 left-0 h-20 px-10 pl-[138px] z-30 flex items-center justify-between bg-gradient-to-b from-bg-primary/90 via-bg-primary/70 to-transparent backdrop-blur-md pointer-events-auto">
      {/* Left Area: Breadcrumbs & Current Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <span className="text-text-muted font-semibold hover:text-white transition-colors cursor-pointer">AntiGravity</span>
          <span className="text-text-muted">/</span>
          <span className="text-text-primary font-bold tracking-wide">{currentPageTitle}</span>
        </div>

        {/* Realtime Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-3 ml-6 pl-6 border-l border-white/10">
          <PillBadge variant="success" dot pulse>
            {activeAgentsCount} Agents Active
          </PillBadge>
          <span className="text-xs font-semibold text-text-muted flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/8">
            <Cpu className="w-3.5 h-3.5 text-accent-hover" />
            {analytics.liveTokenRate}
          </span>
        </div>
      </div>

      {/* Right Area: Command Palette Trigger, Workspace Switcher, & Notifications */}
      <div className="flex items-center gap-4">
        {/* Global Command Palette Trigger Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center justify-between w-64 h-11 px-4 bg-bg-floating/80 hover:bg-bg-card text-text-secondary hover:text-white border border-white/10 rounded-2xl shadow-sm transition-all duration-200 group"
        >
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <Search className="w-4 h-4 text-text-muted group-hover:text-accent-hover transition-colors" />
            <span>Search OS or Agent...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-semibold text-text-muted bg-bg-secondary rounded border border-white/10">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>

        {/* Workspace Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-2.5 h-11 px-4 bg-bg-floating/80 hover:bg-bg-card border border-white/10 rounded-2xl transition-all duration-200 text-sm font-semibold text-text-primary"
          >
            <div className="w-2 h-2 rounded-full bg-accent-hover shadow-glow-accent animate-pulse" />
            <span className="max-w-[140px] truncate">{currentWorkspace.name}</span>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </button>

          {workspaceMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-14 w-72 p-3 glass-modal rounded-2xl shadow-2xl z-50 space-y-2 border border-white/15"
            >
              <div className="text-xs font-bold text-text-muted px-2 py-1 uppercase tracking-wider">
                Select Workspace
              </div>
              {workspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => { switchWorkspace(ws.id); setWorkspaceMenuOpen(false); }}
                  className={clsx(
                    'w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-150',
                    currentWorkspace.id === ws.id ? 'bg-accent/20 border border-accent/40 text-white' : 'hover:bg-white/5 text-text-secondary hover:text-white'
                  )}
                >
                  <div>
                    <div className="font-bold text-sm">{ws.name}</div>
                    <div className="text-xs text-text-muted mt-0.5">{ws.agents} Deployed Agents • {ws.tokens} Tokens</div>
                  </div>
                  {currentWorkspace.id === ws.id && <CheckCircle2 className="w-4 h-4 text-status-success" />}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Notification Icon */}
        <button className="relative w-11 h-11 flex items-center justify-center bg-bg-floating/80 hover:bg-bg-card border border-white/10 rounded-2xl text-text-secondary hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-status-warning rounded-full ring-2 ring-bg-primary animate-ping" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-status-warning rounded-full" />
        </button>

        {/* User Profile Trigger */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-accent/30 to-purple-600/30 border border-white/15 flex items-center justify-center text-white font-bold hover:border-accent-hover transition-all duration-200 shadow-sm"
          >
            {user?.username ? user.username.charAt(0).toUpperCase() : 'AG'}
          </button>

          {userMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-14 w-60 p-2 glass-modal rounded-2xl shadow-2xl z-50 border border-white/15"
            >
              <div className="p-3 border-b border-white/10 mb-1">
                <div className="font-bold text-sm text-text-primary flex items-center justify-between">
                  <span>{user?.full_name || user?.username || 'Architect Operator'}</span>
                  {isGuest && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">GUEST</span>}
                </div>
                <div className="text-xs text-text-muted mt-0.5">
                  {isGuest ? 'Private Sandbox (Zero Saving)' : 'Chief AI Orchestration Engineer'}
                </div>
              </div>
              <button
                onClick={() => { logout(); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-2.5 text-status-danger hover:bg-status-danger/10 rounded-xl font-medium text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out of OS</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  FolderKanban,
  Cpu,
  Database,
  BrainCircuit,
  Server,
  Sparkles,
  Store,
  BarChart3,
  Activity,
  Settings,
  Bell,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Layers
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useAuth } from '../contexts/AuthContext';

export const FloatingSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const currentWorkspace = useOSStore(state => state.currentWorkspace);
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', icon: Terminal, path: '/' },
    { label: 'Projects', icon: FolderKanban, path: '/projects' },
    { label: 'AI Agents', icon: Cpu, path: '/agents' },
    { label: 'Knowledge', icon: Database, path: '/knowledge' },
    { label: 'Memory Banks', icon: BrainCircuit, path: '/memory' },
    { label: 'MCP Servers', icon: Server, path: '/mcp' },
    { label: 'Model Catalog', icon: Sparkles, path: '/models' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Observability', icon: Activity, path: '/observability' },
  ];

  return (
    <motion.aside
      animate={{ width: expanded ? 300 : 90 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={clsx(
        'h-[calc(100vh-64px)] my-8 ml-8 fixed left-0 top-0 z-40 flex flex-col justify-between rounded-clay glass-surface border border-white/10 shadow-clay-card overflow-hidden transition-all duration-300'
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Top Header & Logo */}
      <div className="p-5 border-b border-white/8 flex items-center justify-between min-w-[300px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-accent-hover flex items-center justify-center shadow-glow-accent flex-shrink-0">
            <Layers className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className={clsx('transition-opacity duration-200', expanded ? 'opacity-100' : 'opacity-0')}>
            <div className="font-bold text-lg text-text-primary tracking-tight font-sans leading-none">
              AntiGravity
            </div>
            <div className="text-xs text-accent-hover font-medium uppercase tracking-wider mt-1">
              OS Agents v2
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: active }) =>
                clsx(
                  'flex items-center gap-4 h-12 px-3.5 rounded-2xl transition-all duration-200 group relative',
                  active
                    ? 'bg-accent/15 text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] border border-accent/30'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                )
              }
            >
              <Icon className={clsx('w-6 h-6 flex-shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-accent-hover' : 'text-text-secondary group-hover:text-white')} />
              <span className={clsx('whitespace-nowrap font-medium text-sm tracking-wide transition-opacity duration-200', expanded ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute left-1 top-3 bottom-3 w-1.5 bg-gradient-to-b from-accent to-accent-hover rounded-full shadow-glow-accent" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User & Workspace Telemetry Dock */}
      <div className="p-4 border-t border-white/8 min-w-[300px] bg-bg-primary/40">
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md border border-white/20">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'AG'}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-status-success border-2 border-bg-primary rounded-full animate-pulse" />
          </div>
          <div className={clsx('flex flex-col flex-1 overflow-hidden transition-opacity duration-200', expanded ? 'opacity-100' : 'opacity-0')}>
            <span className="text-sm font-semibold text-text-primary truncate">
              {user?.username || 'Head of AI Architecture'}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 bg-accent-hover rounded-full inline-block" />
              {currentWorkspace.name}
            </span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

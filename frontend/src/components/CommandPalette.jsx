import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Cpu, Server, Database, Sparkles, Folder, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useOSStore } from '../store/osStore';

export const CommandPalette = () => {
  const isOpen = useOSStore(state => state.commandPaletteOpen);
  const setIsOpen = useOSStore(state => state.setCommandPaletteOpen);
  const agents = useOSStore(state => state.agents);
  const projects = useOSStore(state => state.projects);
  const mcpServers = useOSStore(state => state.mcpServers);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Handle Cmd+K / Ctrl+K toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const handleSelect = (path) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.role.toLowerCase().includes(query.toLowerCase()));
  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-28 px-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-2xl glass-modal rounded-clay p-6 border border-white/15 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Box Header */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
            <Search className="w-6 h-6 text-accent-hover flex-shrink-0 animate-pulse" />
            <input
              autoFocus
              type="text"
              placeholder="Type a command, jump to an autonomous agent, or search knowledge..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-text-primary text-lg font-medium placeholder-text-muted focus:outline-none font-sans"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 text-xs font-semibold text-text-muted bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
            >
              ESC
            </button>
          </div>

          {/* Search Results List */}
          <div className="max-h-[420px] overflow-y-auto space-y-4 pr-2">
            {/* Navigation Shortcuts */}
            <div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-2">Quick Destinations</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'OS Desktop Overview', path: '/', icon: Sparkles },
                  { label: 'Autonomous IDE & Chat', path: '/workspace', icon: Cpu },
                  { label: 'Agent Control Matrix', path: '/agents', icon: Cpu },
                  { label: 'MCP Server Hub', path: '/mcp', icon: Server },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-bg-floating/60 hover:bg-bg-card border border-white/8 hover:border-accent/40 text-left transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-accent-hover" />
                        <span className="text-sm font-semibold text-text-primary">{item.label}</span>
                      </div>
                      <CornerDownLeft className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Agents Match */}
            {filteredAgents.length > 0 && (
              <div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-2">Deployed Agents ({filteredAgents.length})</div>
                <div className="space-y-1.5">
                  {filteredAgents.map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => handleSelect('/agents')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-accent/15 border border-transparent hover:border-accent/30 text-left transition-all duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <img src={agent.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                        <div>
                          <div className="font-bold text-sm text-text-primary flex items-center gap-2">
                            {agent.name}
                            <span className="text-xs font-normal text-status-success bg-status-success/10 px-2 py-0.5 rounded-full border border-status-success/20">
                              {agent.status}
                            </span>
                          </div>
                          <div className="text-xs text-text-muted truncate max-w-sm">{agent.currentTask}</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-text-secondary flex items-center gap-1">
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Projects Match */}
            {filteredProjects.length > 0 && (
              <div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-2">Projects & Architecture</div>
                <div className="space-y-1.5">
                  {filteredProjects.map(proj => (
                    <button
                      key={proj.id}
                      onClick={() => handleSelect('/projects')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/6 text-left transition-all duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <Folder className="w-5 h-5 text-accent-hover" />
                        <div>
                          <div className="font-bold text-sm text-text-primary">{proj.name}</div>
                          <div className="text-xs text-text-muted">{proj.repo} • {proj.agentsCount} Agents Active</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-accent-hover">Open Center</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-text-muted">
            <span>Pro tip: Press <kbd className="font-bold text-white">↑</kbd> <kbd className="font-bold text-white">↓</kbd> to navigate, <kbd className="font-bold text-white">ENTER</kbd> to execute</span>
            <span>AntiGravity AI OS v2.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

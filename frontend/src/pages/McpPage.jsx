import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Power,
  PowerOff,
  Terminal,
  Settings,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useToast } from '../contexts/ToastContext';
import { ClayCard } from '../components/ui/ClayCard';
import { GlowButton } from '../components/ui/GlowButton';
import { PillBadge } from '../components/ui/PillBadge';
import { DarkInput } from '../components/ui/DarkInput';

const McpPage = () => {
  const mcpServers = useOSStore(state => state.mcpServers);
  const reconnectMcp = useOSStore(state => state.reconnectMcp);
  const disconnectMcp = useOSStore(state => state.disconnectMcp);
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredServers = mcpServers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleToggleConnection = (id, name, status) => {
    if (status === 'Connected') {
      disconnectMcp(id);
      addToast(`Protocol adapter shutdown: ${name} disconnected`, 'warning');
    } else {
      reconnectMcp(id);
      addToast(`Reconnecting mTLS socket to ${name}... Connection re-established!`, 'success');
    }
  };

  const handleAddServer = () => {
    addToast('Opening MCP server connector dialog: Input SSE or Stdio socket path...', 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Server className="w-4 h-4 animate-pulse text-purple-400" />
            <span>MODEL CONTEXT PROTOCOL (MCP) ADAPTER HUB</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-sans">
            Connected MCP Server Registry
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Provide autonomous agents with direct, authenticated tool execution access to databases, browsers, containers, and repositories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DarkInput
            placeholder="Filter MCP servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 !h-11 text-sm"
          />
          <GlowButton variant="primary" icon={Plus} onClick={handleAddServer} className="!h-11 text-sm shadow-glow-accent">
            Add MCP Server
          </GlowButton>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ClayCard className="p-5 flex items-center justify-between border border-white/10" hover={false}>
          <div>
            <div className="text-xs font-bold uppercase text-text-muted">Connected Protocols</div>
            <div className="text-3xl font-black text-white mt-1">
              {mcpServers.filter(s => s.status === 'Connected').length} / {mcpServers.length} <span className="text-sm font-normal text-text-muted">Active</span>
            </div>
          </div>
          <Server className="w-10 h-10 text-status-success opacity-80" />
        </ClayCard>

        <ClayCard className="p-5 flex items-center justify-between border border-white/10" hover={false}>
          <div>
            <div className="text-xs font-bold uppercase text-text-muted">Total Exposed Tools</div>
            <div className="text-3xl font-black text-accent-hover mt-1">
              {mcpServers.reduce((acc, curr) => acc + curr.toolsCount, 0)} <span className="text-sm font-normal text-text-muted">Functions</span>
            </div>
          </div>
          <Code2 className="w-10 h-10 text-accent-hover opacity-80" />
        </ClayCard>

        <ClayCard className="p-5 flex items-center justify-between border border-white/10" hover={false}>
          <div>
            <div className="text-xs font-bold uppercase text-text-muted">Average Round-Trip Latency</div>
            <div className="text-3xl font-black text-status-success mt-1">
              19.4 <span className="text-sm font-normal text-text-muted">ms</span>
            </div>
          </div>
          <Activity className="w-10 h-10 text-status-success animate-pulse" />
        </ClayCard>
      </div>

      {/* MCP Servers List Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-sans tracking-tight">Configured Server Connections</h2>

        <div className="grid grid-cols-1 gap-5">
          {filteredServers.map((server) => (
            <ClayCard key={server.id} className="p-6 border border-white/10 hover:border-white/20" hover>
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                {/* Left: Info & Health */}
                <div className="flex items-start gap-5 flex-1 min-w-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0 ${
                    server.status === 'Connected' ? 'bg-gradient-to-tr from-purple-500 to-indigo-600' : 'bg-bg-secondary border border-white/15 text-text-muted'
                  }`}>
                    <Server className="w-7 h-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-extrabold text-lg text-white font-mono tracking-tight hover:text-accent-hover transition-colors">
                        {server.name}
                      </span>
                      <PillBadge variant={server.status} dot pulse={server.status === 'Connected'}>
                        {server.status}
                      </PillBadge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-secondary mb-3">
                      <span>Tools Inventory: <strong className="text-accent-hover">{server.toolsCount} functional capabilities</strong></span>
                      <span>•</span>
                      <span>Latency: <strong className={server.status === 'Connected' ? 'text-status-success' : 'text-text-muted'}>{server.latency}</strong></span>
                      <span>•</span>
                      <span>Health: <strong className="text-white">{server.health}</strong></span>
                    </div>

                    <div className="p-3 rounded-2xl bg-bg-primary/80 border border-white/8 font-mono text-xs text-text-secondary truncate">
                      <span className="text-status-success font-bold">● Telemetry Log:</span> {server.logs}
                    </div>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3 flex-shrink-0 pt-4 xl:pt-0 border-t xl:border-0 border-white/10">
                  <GlowButton
                    variant={server.status === 'Connected' ? 'secondary' : 'primary'}
                    size="sm"
                    className="!h-10 text-xs"
                    onClick={() => handleToggleConnection(server.id, server.name, server.status)}
                    icon={server.status === 'Connected' ? PowerOff : Power}
                  >
                    {server.status === 'Connected' ? 'Disconnect Socket' : 'Hot-Reload & Connect'}
                  </GlowButton>

                  <button
                    onClick={() => addToast(`Listing raw JSON-RPC tool schema for ${server.name}`, 'info')}
                    className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs text-text-primary transition-colors flex items-center gap-2"
                  >
                    <Terminal className="w-4 h-4 text-accent-hover" /> Inspect Tools
                  </button>

                  <button
                    onClick={() => addToast(`Opening config environment parameters for ${server.name}`, 'info')}
                    className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white transition-colors flex items-center justify-center"
                    title="Configure Parameters"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ClayCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default McpPage;

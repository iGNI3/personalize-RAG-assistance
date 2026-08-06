import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Terminal,
  Filter,
  Trash2,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useToast } from '../contexts/ToastContext';
import { ClayCard } from '../components/ui/ClayCard';
import { GlowButton } from '../components/ui/GlowButton';
import { DarkInput } from '../components/ui/DarkInput';

const ObservabilityPage = () => {
  const traces = useOSStore(state => state.traces);
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isLive, setIsLive] = useState(true);

  const filterOptions = ['All', 'Success', 'Warning', 'Failed'];

  const filteredTraces = traces.filter(tr => {
    const matchesStatus = selectedStatus === 'All' || tr.status === selectedStatus;
    const matchesSearch = tr.agent.toLowerCase().includes(searchQuery.toLowerCase()) || tr.details.toLowerCase().includes(searchQuery.toLowerCase()) || tr.tool.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCopyTrace = (item) => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    addToast(`Trace payload JSON copied for ${item.agent}`, 'success');
  };

  const handleClear = () => {
    addToast('Purged outdated historical traces from visualization buffer', 'warning');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Activity className="w-4 h-4 animate-bounce text-emerald-400" />
            <span>REALTIME TRACE WATERFALL & EXECUTION DEBUGGER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-sans">
            Observability & Live Traces
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Millisecond precision telemetry waterfall capturing autonomous agent tool invocations, reasoning self-corrections, and retries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setIsLive(!isLive); addToast(isLive ? 'Paused live trace auto-scroll' : 'Resumed realtime log stream', 'info'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs border transition-all ${
              isLive ? 'bg-status-success/20 text-status-success border-status-success/40 shadow-glow-success animate-pulse' : 'bg-white/5 text-text-muted border-white/10'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLive ? 'animate-spin' : ''}`} />
            <span>{isLive ? '● Live Auto-Scroll ON' : '○ Stream Paused'}</span>
          </button>
          
          <GlowButton variant="secondary" icon={Download} onClick={() => addToast('Downloading JSONL complete execution trace...', 'success')} className="!h-10 text-xs">
            Export JSONL
          </GlowButton>
          <GlowButton variant="danger" icon={Trash2} onClick={handleClear} className="!h-10 text-xs">
            Clear Buffer
          </GlowButton>
        </div>
      </div>

      {/* Filter Dock */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-extrabold text-text-muted uppercase flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {filterOptions.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                selectedStatus === status
                  ? 'bg-accent/20 border-accent text-white'
                  : 'bg-bg-floating/60 border-white/8 text-text-secondary hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <DarkInput
          placeholder="Filter by agent name, MCP tool, or payload content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 !h-11 text-sm"
          icon={Search}
        />
      </div>

      {/* Waterfall Table & Logs Grid */}
      <ClayCard className="p-0 overflow-hidden border border-white/15 shadow-2xl bg-bg-secondary/70 font-mono text-xs" hover={false}>
        <div className="p-4 bg-bg-floating border-b border-white/10 flex items-center justify-between font-sans text-xs font-bold text-text-muted uppercase">
          <div className="flex items-center gap-3">
            <span>Timestamp</span>
            <span className="w-px h-4 bg-white/10 mx-2" />
            <span>Agent Reasoner</span>
            <span className="w-px h-4 bg-white/10 mx-2" />
            <span>Event Category</span>
          </div>
          <span>Execution Payload & Latency</span>
        </div>

        <div className="divide-y divide-white/6">
          {filteredTraces.map((tr) => (
            <div key={tr.id} className="p-4 hover:bg-white/4 transition-colors flex flex-col xl:flex-row xl:items-center justify-between gap-4 group">
              {/* Left Column Info */}
              <div className="flex flex-wrap items-center gap-4 min-w-0">
                <span className="text-text-muted font-semibold">{tr.time}</span>
                
                <span className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent-hover font-extrabold border border-accent/25">
                  {tr.agent}
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white font-semibold border border-white/10">
                  {tr.event}
                </span>

                <span className="text-text-muted font-semibold flex items-center gap-1.5">
                  <span>▸ Tool:</span> <strong className="text-white">{tr.tool}</strong>
                </span>
              </div>

              {/* Center Payload Details */}
              <div className="flex-1 max-w-2xl bg-black/40 p-2.5 rounded-xl border border-white/5 text-emerald-400 truncate font-mono text-[11px]">
                {tr.details}
              </div>

              {/* Right Latency & Actions */}
              <div className="flex items-center gap-4 flex-shrink-0 justify-end">
                <span className="flex items-center gap-1.5 font-bold text-xs">
                  {tr.status === 'Success' ? (
                    <span className="text-status-success flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {tr.latency}</span>
                  ) : (
                    <span className="text-status-warning flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {tr.latency} ({tr.status})</span>
                  )}
                </span>

                <button
                  onClick={() => handleCopyTrace(tr)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  title="Copy JSON Trace"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-bg-primary/90 border-t border-white/10 flex items-center justify-between text-[11px] text-text-muted">
          <span>Displaying top {filteredTraces.length} trace records from active memory ring buffer.</span>
          <span className="text-accent-hover font-semibold">AntiGravity Telemetry Daemon v2.0</span>
        </div>
      </ClayCard>
    </div>
  );
};

export default ObservabilityPage;

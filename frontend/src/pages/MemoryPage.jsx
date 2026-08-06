import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Database,
  Cpu,
  RefreshCw,
  Zap,
  CheckCircle2,
  GitMerge,
  Sliders,
  Trash2,
  Sparkles,
  Share2
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { ClayCard } from '../components/ui/ClayCard';
import { GlowButton } from '../components/ui/GlowButton';
import { PillBadge } from '../components/ui/PillBadge';

const MemoryPage = () => {
  const { addToast } = useToast();
  const [compressionRatio, setCompressionRatio] = useState(84.2);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleRunCompression = () => {
    setIsCompressing(true);
    addToast('Initiating vector deduplication and semantic memory pruning across Qdrant banks...', 'info');
    setTimeout(() => {
      setIsCompressing(false);
      setCompressionRatio(89.5);
      addToast('Memory pruning finished! Reclaimed 142 MB of VRAM context space.', 'success');
    }, 2000);
  };

  const memoryTiers = [
    { title: 'Working Memory (Ephemeral)', usage: '42.8 MB', capacity: '200K Tokens per Context', items: '14 Active Scraping Windows', color: 'from-purple-500 to-indigo-600', status: 'Optimal' },
    { title: 'Long-Term Memory (Vector)', usage: '1.48 GB', capacity: 'Qdrant Distributed Shard', items: '270,912 Embedded Vectors', color: 'from-blue-500 to-cyan-600', status: 'Synchronized' },
    { title: 'Shared Multi-Agent Graph', usage: '410.2 MB', capacity: 'GQL Entity Relations', items: '48,500 Knowledge Nodes', color: 'from-emerald-500 to-teal-600', status: 'Active Link' },
  ];

  const recentTraces = [
    { id: 'm-01', time: '10:06:44 AM', type: 'Entity Association', source: 'Code Weaver V3', target: 'Auth Migration Schema', detail: 'Linked Prisma model @unique constraint to CVE-2025-8912 resolution rule.' },
    { id: 'm-02', time: '10:05:12 AM', type: 'Context Pruning', source: 'SecOp Sentinel', target: 'OAuth2 Fuzz Log', detail: 'Compressed 4,200 repeated HTTP 429 rate limit events into single vector reflection.' },
    { id: 'm-03', time: '10:01:05 AM', type: 'Shared Reflection', source: 'Schema Architect', target: 'Global Workspace Memory', detail: 'Stored ArXiv transformer scaling math formulas for cross-agent reading.' },
    { id: 'm-04', time: '09:55:21 AM', type: 'Vector Snapshot', source: 'DevOps Automator', target: 'Kubernetes Cluster State', detail: 'Persisted pod metrics snapshot to Qdrant before rolling deployment.' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-xs font-bold text-accent-hover uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 animate-pulse" />
            <span>NEURAL MEMORY BANKS & KNOWLEDGE GRAPH</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-sans">
            Multi-Tiered Agent Memory Engine
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Realtime monitoring of ephemeral working scratchpads, Qdrant persistent vectors, and shared cross-agent reflection graphs.
          </p>
        </div>

        <GlowButton
          variant="primary"
          icon={RefreshCw}
          loading={isCompressing}
          onClick={handleRunCompression}
          className="shadow-glow-accent !h-11 text-sm"
        >
          Run Vector Pruning & Deduplication
        </GlowButton>
      </div>

      {/* 3 Memory Tiers Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {memoryTiers.map((tier, idx) => (
          <ClayCard key={idx} className="p-6 flex flex-col justify-between border border-white/10" hover>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tier.color} flex items-center justify-center text-white shadow-md`}>
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <PillBadge variant="success" dot pulse>
                  {tier.status}
                </PillBadge>
              </div>
              
              <h3 className="text-lg font-bold text-white tracking-tight">{tier.title}</h3>
              <div className="text-3xl font-black text-accent-hover mt-3">{tier.usage}</div>
              <div className="text-xs font-mono text-text-muted mt-1">Capacity: {tier.capacity}</div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-text-secondary font-semibold">
              <span>{tier.items}</span>
              <button onClick={() => addToast(`Opening raw heap dump for ${tier.title}`, 'info')} className="text-accent hover:underline font-bold">
                Inspect Dump →
              </button>
            </div>
          </ClayCard>
        ))}
      </div>

      {/* Memory Compression Efficiency Card */}
      <ClayCard className="p-6 bg-gradient-to-r from-bg-floating to-bg-card border border-white/15" hover={false}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-status-success flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-status-success animate-bounce" />
              <span>Context Compression Engine Online</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {compressionRatio}% Compression Efficiency Ratio
            </h3>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              AntiGravity uses adaptive semantic distillation to condense repetitive agent thought loops and idle tool payloads before saving to disk. This preserves long-term agent coherence across multi-day software projects.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm w-full bg-black/30 p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
              <span>Raw Context Footprint: <strong className="text-status-warning">4.8 GB</strong></span>
              <span>Compressed: <strong className="text-status-success">760 MB</strong></span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-status-success to-accent rounded-full" style={{ width: `${compressionRatio}%` }} />
            </div>
            <div className="text-[11px] text-text-muted text-center font-mono">
              ● Zero semantic degradation verified via embedding cosine bounds
            </div>
          </div>
        </div>
      </ClayCard>

      {/* Knowledge Graph Traces */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white font-sans tracking-tight flex items-center gap-2">
            <Share2 className="w-5 h-5 text-accent-hover" />
            <span>Live Entity & Knowledge Graph Connections</span>
          </h2>
          <span className="text-xs font-mono text-text-muted">GQL Graph Engine</span>
        </div>

        <ClayCard className="p-6 divide-y divide-white/8 border border-white/10" hover={false}>
          {recentTraces.map((tr) => (
            <div key={tr.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/4 px-3 rounded-2xl transition-colors">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent-hover font-mono bg-accent/15 px-2.5 py-0.5 rounded-md border border-accent/25">
                    {tr.type}
                  </span>
                  <span className="text-xs font-bold text-white">{tr.source}</span>
                  <span className="text-text-muted text-xs">➔</span>
                  <span className="text-xs font-mono text-status-success font-semibold">{tr.target}</span>
                </div>
                <p className="text-xs text-text-secondary font-mono pt-1 leading-relaxed">
                  {tr.detail}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0 text-xs text-text-muted">
                <span className="font-mono">{tr.time}</span>
                <button onClick={() => addToast(`Inspecting graph edge node ${tr.id}`, 'info')} className="text-accent hover:underline font-bold">
                  View Edge
                </button>
              </div>
            </div>
          ))}
        </ClayCard>
      </div>
    </div>
  );
};

export default MemoryPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  Server,
  FolderKanban,
  Play,
  ArrowRight,
  Plus,
  Terminal,
  Store,
  Activity,
  Zap,
  CheckCircle2,
  Brain,
  Layers,
  GitBranch
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useToast } from '../contexts/ToastContext';
import { ClayCard } from '../components/ui/ClayCard';
import { GlowButton } from '../components/ui/GlowButton';
import { PillBadge } from '../components/ui/PillBadge';

const HomePage = () => {
  const currentWorkspace = useOSStore(state => state.currentWorkspace);
  const projects = useOSStore(state => state.projects);
  const agents = useOSStore(state => state.agents);
  const mcpServers = useOSStore(state => state.mcpServers);
  const analytics = useOSStore(state => state.analytics);
  const traces = useOSStore(state => state.traces);
  const setActiveProject = useOSStore(state => state.setActiveProject);
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [simulatedRate, setSimulatedRate] = useState(4820);

  // Live micro-simulation of token throughput to give the interface a living heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedRate(prev => Math.floor(prev + (Math.random() * 240 - 120)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchAgent = (name) => {
    addToast(`Spawning new autonomous worker: ${name}`, 'success');
    navigate('/agents');
  };

  const openProject = (id) => {
    setActiveProject(id);
    navigate('/projects');
  };

  const marketplaceTemplates = [
    { title: 'Postgres Index & Query Optimizer', model: 'Claude 3.7 Sonnet', category: 'Database MCP', rating: '5.0 (420 installs)' },
    { title: 'Kubernetes Self-Healing Red Team', model: 'DeepSeek R1', category: 'DevSecOps', rating: '4.9 (890 installs)' },
    { title: 'Solidity Smart Contract Auditor', model: 'GPT-4o', category: 'Web3 Security', rating: '4.9 (310 installs)' },
    { title: 'React 19 & Accessibility Auto-Fixer', model: 'Gemini 2.5 Pro', category: 'Frontend Engine', rating: '4.8 (1,200 installs)' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Welcome Header & Mission Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-accent-hover mb-2">
            <Sparkles className="w-4 h-4 animate-bounce" />
            <span>AI OPERATING SYSTEM • MISSION CONTROL</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary font-sans">
            Good morning, Architect
          </h1>
          <p className="text-text-secondary text-base mt-1">
            Managing <strong className="text-white">{currentWorkspace.name}</strong>. You have 4 active software projects and 14 autonomous agents currently in runtime.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <GlowButton variant="secondary" onClick={() => navigate('/workspace')} icon={Terminal}>
            Open IDE Studio
          </GlowButton>
          <GlowButton variant="primary" onClick={() => handleLaunchAgent('Universal Reasoner V4')} icon={Plus}>
            Spawn Agent
          </GlowButton>
        </div>
      </div>

      {/* 2. Real-time Telemetry Cards Matrix (Claymorphic Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ClayCard className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-center justify-between text-text-secondary mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Inference Throughput</span>
            <div className="p-2 rounded-xl bg-accent/15 text-accent-hover">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              {simulatedRate.toLocaleString()} <span className="text-sm font-medium text-text-muted">t/sec</span>
            </div>
            <div className="text-xs text-status-success font-semibold flex items-center gap-1 mt-2">
              <span>▲ +18.4% vs previous cluster load</span>
            </div>
          </div>
        </ClayCard>

        <ClayCard className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-center justify-between text-text-secondary mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Active Agent Matrix</span>
            <div className="p-2 rounded-xl bg-status-success/15 text-status-success">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
              14 <span className="text-sm font-medium text-text-muted">Online</span>
            </div>
            <div className="text-xs text-text-secondary font-semibold flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-success inline-block" /> 10 Running</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-hover inline-block" /> 4 Thinking</span>
            </div>
          </div>
        </ClayCard>

        <ClayCard className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-center justify-between text-text-secondary mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">MCP Protocol Hub</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              {mcpServers.filter(s => s.status === 'Connected').length} / {mcpServers.length} <span className="text-sm font-medium text-text-muted">Servers</span>
            </div>
            <div className="text-xs text-status-success font-semibold flex items-center gap-1 mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> 99.99% protocol round-trip health
            </div>
          </div>
        </ClayCard>

        <ClayCard className="p-5 flex flex-col justify-between" hover>
          <div className="flex items-center justify-between text-text-secondary mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Compute Budget</span>
            <div className="p-2 rounded-xl bg-status-warning/15 text-status-warning">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              {analytics.monthlyComputeSpend}
            </div>
            <div className="text-xs text-text-muted font-medium mt-2">
              Allocated across 8x NVIDIA H100 SXM5 GPUs
            </div>
          </div>
        </ClayCard>
      </div>

      {/* 3. Pinned Autonomous Software Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-accent-hover" />
            <h2 className="text-xl font-bold text-text-primary font-sans tracking-tight">Pinned Autonomous Projects</h2>
          </div>
          <button onClick={() => navigate('/projects')} className="text-xs font-bold text-accent-hover hover:text-white transition-colors flex items-center gap-1">
            View all projects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.slice(0, 2).map((proj) => (
            <ClayCard key={proj.id} className="p-6 flex flex-col justify-between border border-white/10" hover onClick={() => openProject(proj.id)}>
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary tracking-tight hover:text-accent-hover transition-colors">
                      {proj.name}
                    </h3>
                    <div className="text-xs text-text-muted flex items-center gap-2 mt-1">
                      <GitBranch className="w-3.5 h-3.5 text-status-success" />
                      <span className="font-mono">{proj.repo}</span>
                      <span>•</span>
                      <span>Updated {proj.updatedAt}</span>
                    </div>
                  </div>
                  <PillBadge variant="success" dot pulse>
                    {proj.status}
                  </PillBadge>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {proj.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/8 flex items-center justify-between text-xs font-semibold text-text-secondary">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-white">
                    <Cpu className="w-4 h-4 text-accent-hover" />
                    {proj.agentsCount} Active Agents
                  </span>
                  <span>Tokens: <strong className="text-white">{proj.tokensUsed}</strong></span>
                </div>
                <span className="text-accent-hover font-bold flex items-center gap-1 group">
                  Open Center <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </ClayCard>
          ))}
        </div>
      </div>

      {/* 4. Live Agent Execution & Reasoning Feed + Agent Marketplace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Agent Thoughts & Activity Ticker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent-hover" />
              <h2 className="text-xl font-bold text-text-primary font-sans tracking-tight">Live Agent Reasoning Stream</h2>
            </div>
            <button onClick={() => navigate('/agents')} className="text-xs font-bold text-accent-hover hover:text-white transition-colors">
              Manage Matrix →
            </button>
          </div>

          <ClayCard className="p-6 divide-y divide-white/8" hover={false}>
            {agents.slice(0, 3).map((agent) => (
              <div key={agent.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                <div className="relative flex-shrink-0 mt-1">
                  <img src={agent.avatar} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-white/15 shadow-md" />
                  <span className="absolute -bottom-1 -right-1">
                    <PillBadge variant={agent.status} dot pulse className="!p-0 !w-3.5 !h-3.5 flex items-center justify-center" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-text-primary flex items-center gap-2">
                      {agent.name}
                      <span className="text-xs text-text-muted font-normal">({agent.role})</span>
                    </span>
                    <span className="text-xs font-mono text-text-muted bg-white/5 px-2 py-0.5 rounded border border-white/8">
                      {agent.model} • {agent.latency}
                    </span>
                  </div>
                  
                  <div className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full inline-block animate-ping" />
                    Task: {agent.currentTask}
                  </div>

                  <div className="p-3 rounded-xl bg-bg-primary/70 border border-white/8 text-xs font-mono text-accent-hover/90 italic leading-relaxed shadow-inner">
                    "{agent.currentThought}"
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-accent to-status-success"
                    />
                  </div>
                </div>
              </div>
            ))}
          </ClayCard>
        </div>

        {/* Right Col: Autonomous Agent Marketplace Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-status-success" />
              <h2 className="text-xl font-bold text-text-primary font-sans tracking-tight">Agent Marketplace</h2>
            </div>
            <span className="text-xs text-text-muted">2,400+ available</span>
          </div>

          <ClayCard className="p-5 space-y-3" hover={false}>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Deploy battle-tested specialized agent templates engineered by leading AI research teams.
            </p>

            <div className="space-y-3">
              {marketplaceTemplates.map((template, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/4 hover:bg-white/8 border border-white/8 transition-all flex flex-col justify-between group">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-bold text-sm text-text-primary group-hover:text-accent-hover transition-colors">
                      {template.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted font-medium mt-1">
                    <span className="bg-accent/10 text-accent-hover px-2 py-0.5 rounded-md border border-accent/20 font-mono">
                      {template.model}
                    </span>
                    <span>{template.rating}</span>
                  </div>
                  <GlowButton
                    variant="secondary"
                    size="sm"
                    className="w-full mt-3 !h-9 text-xs"
                    onClick={() => {
                      addToast(`Importing template: ${template.title} into workspace...`, 'success');
                      navigate('/agents');
                    }}
                  >
                    Deploy to Workspace
                  </GlowButton>
                </div>
              ))}
            </div>
          </ClayCard>
        </div>
      </div>

      {/* 5. Live System Telemetry & Observability Feed Bottom Roll */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
            <Activity className="w-4 h-4 text-status-success animate-pulse" />
            <span>Real-time OS Event & Trace Stream</span>
          </div>
          <button onClick={() => navigate('/observability')} className="text-xs font-bold text-accent-hover">
            Open Observability Waterfall →
          </button>
        </div>
        
        <ClayCard className="p-4 bg-bg-secondary/60 font-mono text-xs overflow-x-auto border border-white/8" hover={false}>
          <div className="space-y-2">
            {traces.slice(0, 3).map((tr) => (
              <div key={tr.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
                <div className="flex items-center gap-4 min-w-[500px]">
                  <span className="text-text-muted">{tr.time}</span>
                  <span className="text-accent-hover font-bold w-36 truncate">{tr.agent}</span>
                  <span className="bg-white/5 px-2 py-0.5 rounded text-white">{tr.event}</span>
                  <span className="text-text-secondary truncate max-w-md">{tr.details}</span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-text-muted">{tr.tool}</span>
                  <span className={tr.status === 'Success' ? 'text-status-success' : 'text-status-warning font-bold'}>
                    {tr.latency} • [{tr.status}]
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ClayCard>
      </div>
    </div>
  );
};

export default HomePage;

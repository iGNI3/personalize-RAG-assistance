import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  GitBranch,
  Cpu,
  Database,
  Server,
  Terminal,
  Activity,
  DollarSign,
  Plus,
  Play,
  Share2,
  CheckCircle,
  FileCode2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useToast } from '../contexts/ToastContext';
import { ClayCard } from '../components/ui/ClayCard';
import { GlowButton } from '../components/ui/GlowButton';
import { PillBadge } from '../components/ui/PillBadge';

const ProjectsPage = () => {
  const projects = useOSStore(state => state.projects);
  const activeProjectId = useOSStore(state => state.activeProjectId);
  const setActiveProject = useOSStore(state => state.setActiveProject);
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('topology'); // 'topology' | 'agents' | 'commits' | 'logs'
  const [isRunningTests, setIsRunningTests] = useState(false);

  const currentProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const triggerTestPipeline = () => {
    setIsRunningTests(true);
    addToast('Initiating autonomous PR testing and regression suite across active agents...', 'success');
    setTimeout(() => {
      setIsRunningTests(false);
      addToast('All 142 integration tests passed in sandbox container!', 'success');
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Project Switcher Tabs & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-xs font-bold text-accent-hover uppercase tracking-widest mb-1">
            PROJECT COMMAND & ORCHESTRATION CENTER
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-sans">
            {currentProject.name}
          </h1>
          <div className="flex items-center gap-4 text-xs text-text-secondary mt-2">
            <span className="flex items-center gap-1 text-status-success font-mono">
              <GitBranch className="w-3.5 h-3.5" /> {currentProject.repo} (main)
            </span>
            <span>•</span>
            <span>Last Commit: <strong className="text-white">{currentProject.lastCommit}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GlowButton
            variant="secondary"
            icon={RefreshCw}
            loading={isRunningTests}
            onClick={triggerTestPipeline}
          >
            Run PR Verification
          </GlowButton>
          <GlowButton
            variant="primary"
            icon={Plus}
            onClick={() => addToast('Modal opened: Deploy additional MCP adapter or agent worker', 'success')}
          >
            Attach Resource
          </GlowButton>
        </div>
      </div>

      {/* Project Selector Pills Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {projects.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveProject(p.id)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-2.5 ${
              currentProject.id === p.id
                ? 'bg-accent/20 border-accent text-white shadow-glow-accent'
                : 'bg-bg-floating/60 border-white/8 text-text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-accent-hover" />
            <span>{p.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
              {p.agentsCount} agents
            </span>
          </button>
        ))}
      </div>

      {/* Quick Telemetry KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ClayCard className="p-4 flex items-center justify-between" hover={false}>
          <div>
            <div className="text-xs font-bold text-text-muted uppercase">Active Workers</div>
            <div className="text-2xl font-black text-white mt-1">{currentProject.agentsCount} Agents</div>
          </div>
          <Cpu className="w-8 h-8 text-status-success opacity-80" />
        </ClayCard>

        <ClayCard className="p-4 flex items-center justify-between" hover={false}>
          <div>
            <div className="text-xs font-bold text-text-muted uppercase">Token Burn</div>
            <div className="text-2xl font-black text-white mt-1">{currentProject.tokensUsed}</div>
          </div>
          <Activity className="w-8 h-8 text-accent-hover opacity-80" />
        </ClayCard>

        <ClayCard className="p-4 flex items-center justify-between" hover={false}>
          <div>
            <div className="text-xs font-bold text-text-muted uppercase">Monthly Spend</div>
            <div className="text-2xl font-black text-white mt-1">{currentProject.monthlyCost}</div>
          </div>
          <DollarSign className="w-8 h-8 text-status-warning opacity-80" />
        </ClayCard>

        <ClayCard className="p-4 flex items-center justify-between" hover={false}>
          <div>
            <div className="text-xs font-bold text-text-muted uppercase">SAIF Compliance</div>
            <div className="text-2xl font-black text-status-success mt-1">Tier 1 Verified</div>
          </div>
          <ShieldCheck className="w-8 h-8 text-status-success opacity-80" />
        </ClayCard>
      </div>

      {/* Main Studio Area: Tab Selection */}
      <div>
        <div className="flex border-b border-white/10 mb-6 gap-6">
          {[
            { id: 'topology', label: 'Architecture Topology', icon: Share2 },
            { id: 'agents', label: 'Assigned Agents & Tasks', icon: Cpu },
            { id: 'commits', label: 'Repository PRs & Commits', icon: GitBranch },
            { id: 'logs', label: 'Live Sandbox Logs', icon: Terminal },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-bold text-sm flex items-center gap-2 transition-colors relative ${
                  activeTab === tab.id ? 'text-white' : 'text-text-secondary hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="projTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-glow-accent" />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: INTERACTIVE ARCHITECTURE TOPOLOGY VISUALIZATION */}
        {activeTab === 'topology' && (
          <ClayCard className="p-8 border border-white/10 overflow-hidden relative min-h-[520px] flex flex-col justify-between" hover={false}>
            {/* Simulated Grid Pattern Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="flex items-center justify-between z-10 mb-8">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Live Multi-Agent Wiring Graph</h3>
                <p className="text-xs text-text-muted">Realtime data communication links between Reasoners, MCP Adapters, and Memory Vectors.</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-status-success/10 text-status-success border border-status-success/20 rounded-full animate-pulse">
                ● Graph Active (24ms ping)
              </span>
            </div>

            {/* Architecture Node Interactive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-10 my-auto py-6">
              {[
                { type: 'Primary Model', name: 'Claude 3.7 Sonnet', details: 'Core Reasoner (200K ctx)', icon: Cpu, color: 'from-purple-500 to-indigo-600', ping: '410ms' },
                { type: 'Protocol Adapter', name: 'GitHub MCP Server', details: 'Full Write/Commit Access', icon: Server, color: 'from-blue-600 to-cyan-600', ping: '19ms' },
                { type: 'Memory Vector', name: 'Codebase Qdrant DB', details: '1536d Cosine Index', icon: Database, color: 'from-amber-500 to-orange-600', ping: '6ms' },
                { type: 'Supervisor Agent', name: 'DevSecOps Red-Team', details: 'Automated PR Reviewer', icon: ShieldCheck, color: 'from-emerald-500 to-teal-600', ping: '12ms' }
              ].map((node, i) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="p-6 rounded-3xl bg-bg-floating/90 border border-white/15 shadow-2xl relative group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${node.color} flex items-center justify-center text-white shadow-lg`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono font-bold text-accent-hover bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                          {node.ping}
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-text-muted uppercase tracking-wider">{node.type}</div>
                      <div className="text-lg font-bold text-white mt-1">{node.name}</div>
                      <p className="text-xs text-text-secondary mt-2">{node.details}</p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-text-muted">
                      <span>Status: <strong className="text-status-success">Online</strong></span>
                      <button onClick={() => addToast(`Inspecting AST configuration for ${node.name}`, 'success')} className="text-accent hover:underline">
                        Configure
                      </button>
                    </div>

                    {/* Simulated Connecting Wire Line to Next Node */}
                    {i < 3 && (
                      <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 w-6 items-center justify-center z-20 pointer-events-none">
                        <div className="w-full h-[2px] bg-gradient-to-r from-accent to-status-success animate-pulse" />
                        <span className="absolute right-0 w-2 h-2 rounded-full bg-status-success animate-ping" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10 text-xs text-text-muted">
              <span>Security rule: All inter-agent payloads encrypted via TLS 1.3 mTLS tunnels.</span>
              <button onClick={() => addToast('Exporting terraform orchestration schema...', 'success')} className="text-white hover:underline font-semibold">
                Export Deployment Plan (.yaml)
              </button>
            </div>
          </ClayCard>
        )}

        {/* TAB 2: ASSIGNED AGENTS & TASKS */}
        {activeTab === 'agents' && (
          <ClayCard className="p-6 space-y-4" hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg">Active Agents on {currentProject.name}</h3>
              <GlowButton size="sm" variant="primary">Add Worker</GlowButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Code Weaver V3', task: 'Writing unit tests for authentication endpoint', status: 'Running', tokens: '14,290 t' },
                { name: 'SecOp Sentinel', task: 'Scanning AST for SQL injection vectors', status: 'Thinking', tokens: '8,410 t' },
              ].map((a, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/4 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      {a.name}
                      <PillBadge variant="success" dot pulse>{a.status}</PillBadge>
                    </div>
                    <div className="text-xs text-text-secondary mt-1">{a.task}</div>
                  </div>
                  <span className="text-xs font-mono text-text-muted">{a.tokens}</span>
                </div>
              ))}
            </div>
          </ClayCard>
        )}

        {/* TAB 3 & 4: COMMITS AND LOGS PREVIEW */}
        {(activeTab === 'commits' || activeTab === 'logs') && (
          <ClayCard className="p-6 bg-bg-secondary font-mono text-xs text-text-secondary border border-white/10 space-y-3" hover={false}>
            <div className="text-status-success font-bold">● Live Docker Sandbox Container Output Stream (#449c0c6f):</div>
            <div className="space-y-1 text-text-muted">
              <div>[10:06:40.104] [mcp/github] Fetched 14 untracked files from branch 'feature/mcp-auth'</div>
              <div>[10:06:41.210] [agent/code-weaver] Running automated test runner: pytest tests/ -v</div>
              <div>[10:06:44.901] [sandbox/exec] PASSED 42/42 tests in 3.41s. Coverage: 98.4%</div>
              <div>[10:06:45.000] [agent/supervisor] Creating signed commit hash 9f8d1a2: 'test: complete coverage for auth'</div>
            </div>
          </ClayCard>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;

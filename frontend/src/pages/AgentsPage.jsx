import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Play,
  Pause,
  Copy,
  Trash2,
  Terminal,
  Plus,
  Activity,
  Brain,
  Zap,
  ShieldAlert,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useToast } from '../contexts/ToastContext';
import { ClayCard } from '../components/ui/ClayCard';
import { GlowButton } from '../components/ui/GlowButton';
import { PillBadge } from '../components/ui/PillBadge';
import { DarkInput } from '../components/ui/DarkInput';

const AgentsPage = () => {
  const agents = useOSStore(state => state.agents);
  const toggleAgentStatus = useOSStore(state => state.toggleAgentStatus);
  const duplicateAgent = useOSStore(state => state.duplicateAgent);
  const deleteAgent = useOSStore(state => state.deleteAgent);
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('Senior Autonomous Developer');
  const [selectedModel, setSelectedModel] = useState('Claude 3.7 Sonnet');

  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.currentTask.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAgent = (e) => {
    e.preventDefault();
    if (!newAgentName) {
      addToast('Please enter an identifier name for the autonomous worker', 'warning');
      return;
    }
    const created = {
      id: `agent-${Date.now()}`,
      name: newAgentName,
      role: newAgentRole,
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      status: 'Running',
      currentTask: 'Initializing MCP sandboxed connections and reading workspace state...',
      currentThought: 'Warming neural inference engine with 200K system instructions prompt...',
      memoryUsage: '124 MB',
      model: selectedModel,
      latency: '19ms',
      tokens: '2,450',
      runningTime: '0h 1m',
      progress: 10
    };
    useOSStore.setState(state => ({ agents: [created, ...state.agents] }));
    addToast(`Successfully deployed ${newAgentName} to live agent matrix!`, 'success');
    setShowModal(false);
    setNewAgentName('');
  };

  const handlePauseResume = (id, name, status) => {
    toggleAgentStatus(id);
    const action = status === 'Running' || status === 'Thinking' ? 'Paused' : 'Resumed runtime for';
    addToast(`${action} worker: ${name}`, 'info');
  };

  const handleDuplicate = (id, name) => {
    duplicateAgent(id);
    addToast(`Duplicated worker topology: ${name} (Copy)`, 'success');
  };

  const handleDelete = (id, name) => {
    deleteAgent(id);
    addToast(`Terminated and pruned container state for ${name}`, 'warning');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Launch Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-xs font-bold text-accent-hover uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>AUTONOMOUS AGENT RUNTIME MATRIX</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-sans">
            AI Agent Fleet & Orchestration
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage deployed autonomous workers, monitor live thought streams, and scale compute allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DarkInput
            placeholder="Filter matrix by name or task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 !h-11 text-sm"
          />
          <GlowButton
            variant="primary"
            icon={Plus}
            onClick={() => setShowModal(true)}
            className="!h-11 text-sm shadow-glow-accent"
          >
            Deploy Agent Worker
          </GlowButton>
        </div>
      </div>

      {/* Agents Matrix Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <ClayCard key={agent.id} className="p-6 flex flex-col justify-between border border-white/10 group" hover>
            <div>
              {/* Agent Top Profile */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex-shrink-0">
                    <img src={agent.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border border-white/20 shadow-md" />
                    <span className="absolute -bottom-1 -right-1">
                      <PillBadge variant={agent.status} dot pulse className="!p-0 !w-3.5 !h-3.5 flex items-center justify-center" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-primary group-hover:text-accent-hover transition-colors leading-tight">
                      {agent.name}
                    </h3>
                    <div className="text-xs font-semibold text-accent/90 mt-0.5">{agent.role}</div>
                  </div>
                </div>
                
                <PillBadge variant={agent.status} dot pulse>
                  {agent.status}
                </PillBadge>
              </div>

              {/* Hardware Specs & Model Badge */}
              <div className="flex items-center justify-between text-xs text-text-muted bg-white/4 p-2.5 rounded-2xl border border-white/6 font-mono mb-4">
                <span className="font-bold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent-hover" />
                  {agent.model}
                </span>
                <span>VRAM: <strong className="text-white">{agent.memoryUsage}</strong></span>
                <span>Ping: <strong className="text-status-success">{agent.latency}</strong></span>
              </div>

              {/* Current Active Task */}
              <div className="text-xs font-bold text-text-primary mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping inline-block" />
                <span>Active Objective:</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2">
                {agent.currentTask}
              </p>

              {/* Live Thought Stream Bubble */}
              <div className="p-3.5 rounded-2xl bg-bg-primary/80 border border-white/8 font-mono text-xs text-accent-hover italic leading-relaxed shadow-inner mb-6 line-clamp-3">
                "{agent.currentThought}"
              </div>
            </div>

            <div>
              {/* Token Throughput & Progress Bar */}
              <div className="flex items-center justify-between text-xs text-text-secondary font-semibold mb-1.5">
                <span>Runtime: {agent.runningTime}</span>
                <span>Consumed: <strong className="text-white">{agent.tokens} tokens</strong></span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-accent to-status-success"
                />
              </div>

              {/* Execution Control Dock */}
              <div className="pt-4 border-t border-white/8 flex items-center justify-between gap-2">
                <button
                  onClick={() => handlePauseResume(agent.id, agent.name, agent.status)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 font-bold text-xs text-text-primary transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {agent.status === 'Running' || agent.status === 'Thinking' ? (
                    <> <Pause className="w-3.5 h-3.5 text-status-warning" /> Pause </>
                  ) : (
                    <> <Play className="w-3.5 h-3.5 text-status-success" /> Resume </>
                  )}
                </button>

                <button
                  onClick={() => addToast(`Stream logs active for container ${agent.id}`, 'info')}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-text-secondary hover:text-white transition-all text-xs flex items-center justify-center"
                  title="Inspect Logs"
                >
                  <Terminal className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDuplicate(agent.id, agent.name)}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-text-secondary hover:text-white transition-all text-xs flex items-center justify-center"
                  title="Duplicate Worker"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(agent.id, agent.name)}
                  className="py-2 px-3 rounded-xl bg-status-danger/10 hover:bg-status-danger/20 border border-status-danger/25 text-status-danger transition-all text-xs flex items-center justify-center"
                  title="Terminate Agent"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ClayCard>
        ))}
      </div>

      {/* Deploy Agent Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-modal rounded-clay p-8 border border-white/15 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-accent-hover flex items-center justify-center text-white shadow-md">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Deploy Autonomous Worker</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white text-xs font-bold px-2.5 py-1 rounded bg-white/5">
                  ESC
                </button>
              </div>

              <form onSubmit={handleCreateAgent} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                    Agent Identifier
                  </label>
                  <DarkInput
                    placeholder="e.g. Quant Optimizer V2"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                    Specialist Role & Directive
                  </label>
                  <DarkInput
                    placeholder="e.g. Chief Autonomous Developer"
                    value={newAgentRole}
                    onChange={(e) => setNewAgentRole(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                    Primary Reasoning Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl bg-[#151C31] text-white border border-white/10 focus:border-accent focus:outline-none text-sm font-semibold"
                  >
                    <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet (200K ctx • $3.00/1M)</option>
                    <option value="GPT-4o (Omni)">GPT-4o Omni (128K ctx • $2.50/1M)</option>
                    <option value="DeepSeek R1">DeepSeek R1 High Reasoning ($0.55/1M)</option>
                    <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (2M ctx Native)</option>
                    <option value="Qwen 2.5 72B (Local Ollama)">Qwen 2.5 72B Local On-Premises</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <GlowButton type="button" variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </GlowButton>
                  <GlowButton type="submit" variant="primary" icon={Plus} className="shadow-glow-accent">
                    Deploy to Runtime
                  </GlowButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentsPage;

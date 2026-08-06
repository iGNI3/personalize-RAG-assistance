import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Terminal,
  Code,
  Database,
  FileText,
  Cpu,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Copy,
  Layers,
  Search,
  BookOpen,
  Split,
  Bot
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useToast } from '../contexts/ToastContext';
import { ClayCard } from '../components/ui/ClayCard';
import { GlowButton } from '../components/ui/GlowButton';
import { PillBadge } from '../components/ui/PillBadge';

const ChatWorkspacePage = () => {
  const models = useOSStore(state => state.models);
  const { addToast } = useToast();

  const [selectedModel, setSelectedModel] = useState('Claude 3.7 Sonnet');
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Conversation history stream
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Analyze our authentication endpoint against potential OAuth2 race conditions and generate a Prisma schema migration to lock concurrent sessions.',
      timestamp: '10:04 AM'
    },
    {
      id: 'msg-2',
      sender: 'agent',
      agentName: 'Code Weaver V3 (Primary Reasoner)',
      model: 'Claude 3.7 Sonnet',
      timestamp: '10:04 AM',
      thoughts: [
        'Inspecting AST schema via Postgres MCP connector...',
        'Identified missing unqiue constraint on `oauth_refresh_token` table index.',
        'Constructing atomic migration with lock-free concurrent execution.'
      ],
      codeBlock: `model OAuthSession {\n  id          String   @id @default(uuid())\n  userId      String\n  refreshToken String  @unique // Added unique index to prevent race lock\n  expiresAt   DateTime\n  createdAt   DateTime @default(now())\n\n  @@index([userId, refreshToken])\n}`,
      text: 'I have completed the security trace and generated the required atomic Prisma migration. I leveraged the `postgres-mcp` connector to verify that no overlapping transactions currently conflict in production.'
    }
  ]);

  // Realtime Live Tool Call Inspector feed
  const [toolCalls, setToolCalls] = useState([
    { id: 't-1', tool: 'postgres-mcp/describe_table', args: '{ table: "oauth_refresh_token" }', status: 'Success', latency: '14ms', result: 'Columns: [id, userId, refreshToken, expiresAt]' },
    { id: 't-2', tool: 'github-mcp/read_file', args: '{ path: "prisma/schema.prisma" }', status: 'Success', latency: '28ms', result: 'Loaded 420 lines of schema definition' },
    { id: 't-3', tool: 'qdrant/vector_search', args: '{ query: "OAuth2 concurrency lock best practices" }', status: 'Success', latency: '8ms', result: 'Top match: RFC-6749 sec-10.4 (Score 0.92)' }
  ]);

  // Cited Vector Memory sources
  const citedSources = [
    { id: 's-1', title: 'OAuth2 Security Architecture Guideline', chunk: 'Section 4.2: Preventing token replay attacks via DB uniqueness', score: 0.94, collection: 'AntiGravity Core SDK Repository' },
    { id: 's-2', title: 'Prisma 6.0 Zero-Downtime Migration Ops', chunk: 'Deploying @@unique indexes without blocking write locks in PG', score: 0.89, collection: 'ArXiv Deep Learning & DevOps Corpus' }
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    const newMsg = { id: `msg-${Date.now()}`, sender: 'user', text: promptInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setPromptInput('');
    setIsSynthesizing(true);
    addToast(`Dispatching reasoning task to ${selectedModel}...`, 'info');

    // Simulate autonomous agent tool call and reply after 2 seconds
    setTimeout(() => {
      setToolCalls(prev => [
        { id: `t-${Date.now()}`, tool: 'docker-mcp/execute_bash', args: '{ cmd: "npx prisma migrate dev" }', status: 'Success', latency: '312ms', result: 'Migration applied cleanly to container.' },
        ...prev
      ]);

      const replyMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        agentName: 'Code Weaver V3',
        model: selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        thoughts: [
          `Analyzing user directive with ${selectedModel}...`,
          'Invoked docker-mcp test runner container to validate syntax.',
          'Synthesizing final architectural confirmation.'
        ],
        text: `I have executed the requested modifications inside the autonomous Docker sandbox container. The tests compiled cleanly with 100% regression validation.`
      };
      setMessages(prev => [...prev, replyMsg]);
      setIsSynthesizing(false);
      addToast('Agent reasoning execution complete!', 'success');
    }, 2200);
  };

  return (
    <div className="h-[calc(100vh-130px)] flex gap-5 pb-4">
      {/* LEFT PANE (20%): SESSION HISTORIES & BRANCH SNAPSHOTS */}
      <div className="hidden xl:flex xl:w-64 flex-col gap-4">
        <ClayCard className="p-4 flex flex-col h-full border border-white/10" hover={false}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-accent-hover" />
              <span>Workspace Trees</span>
            </span>
            <span className="text-[10px] font-mono bg-accent/20 text-accent-hover px-2 py-0.5 rounded-full">Active</span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1 text-sm">
            {[
              { title: 'OAuth2 Race Condition Fix', time: 'Active now', count: '14 tools used', active: true },
              { title: 'Qdrant Sharded Embeddings', time: '2 hours ago', count: '8 tools used', active: false },
              { title: 'Kubernetes eBPF Probe', time: 'Yesterday', count: '24 tools used', active: false },
              { title: 'Prisma Billing Schema', time: '3 days ago', count: '6 tools used', active: false },
            ].map((branch, i) => (
              <div
                key={i}
                onClick={() => addToast(`Loaded conversation snapshot: ${branch.title}`, 'info')}
                className={`p-3 rounded-2xl cursor-pointer transition-all duration-150 border ${
                  branch.active
                    ? 'bg-accent/20 border-accent/40 text-white shadow-sm'
                    : 'bg-white/4 hover:bg-white/8 border-transparent text-text-secondary hover:text-white'
                }`}
              >
                <div className="font-bold truncate">{branch.title}</div>
                <div className="text-xs text-text-muted mt-1 flex items-center justify-between">
                  <span>{branch.time}</span>
                  <span className="font-mono text-[10px]">{branch.count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10">
            <GlowButton variant="secondary" className="w-full text-xs !h-10" onClick={() => addToast('Created fresh memory sandbox session', 'success')}>
              + New Workspace Thread
            </GlowButton>
          </div>
        </ClayCard>
      </div>

      {/* CENTER PANE (50%): CURSOR-STYLE STREAMING CONVERSATION & PROMPT BAR */}
      <div className="flex-1 flex flex-col justify-between h-full gap-4 min-w-0">
        <ClayCard className="p-6 flex-1 flex flex-col overflow-hidden border border-white/10" hover={false}>
          {/* Top Chat Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-accent-hover" />
              <div>
                <div className="font-bold text-base text-white">Autonomous IDE Reasoning Engine</div>
                <div className="text-xs text-text-muted">Simultaneous tool execution and vector citations active</div>
              </div>
            </div>
            
            {/* Model Selection Dropdown */}
            <div className="relative">
              <button
                onClick={() => setModelMenuOpen(!modelMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-bg-floating hover:bg-bg-card border border-white/15 text-xs font-bold text-white transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-hover animate-pulse" />
                <span>Model: {selectedModel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
              </button>

              {modelMenuOpen && (
                <div className="absolute right-0 top-10 w-64 p-2 glass-modal rounded-2xl shadow-2xl z-50 space-y-1 border border-white/20">
                  {models.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.name); setModelMenuOpen(false); addToast(`Reasoning core switched to ${m.name}`, 'info'); }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                        selectedModel === m.name ? 'bg-accent/20 text-white font-bold' : 'text-text-secondary hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{m.name}</span>
                      <span className="font-mono text-text-muted">{m.speed}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conversation Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.sender === 'agent' && (
                  <div className="flex items-center gap-2 text-xs font-bold text-accent-hover mb-2 pl-1">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>{msg.agentName} • {msg.model}</span>
                    <span className="text-text-muted font-normal">({msg.timestamp})</span>
                  </div>
                )}

                <div className={`p-5 rounded-3xl max-w-3xl leading-relaxed text-sm shadow-md border ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-accent to-purple-600 text-white font-medium border-white/20 rounded-tr-sm'
                    : 'bg-bg-floating/90 text-text-primary border-white/10 rounded-tl-sm w-full'
                }`}>
                  {/* Agent Thoughts Accordion */}
                  {msg.thoughts && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-bg-primary/70 border border-white/8 font-mono text-xs text-text-secondary space-y-1">
                      <div className="text-[11px] font-extrabold text-status-success uppercase flex items-center gap-1.5 pb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Autonomous Reasoning Chain verified
                      </div>
                      {msg.thoughts.map((th, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-text-muted">
                          <span>▸</span>
                          <span>{th}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Generated Code Block */}
                  {msg.codeBlock && (
                    <div className="mt-4 rounded-2xl bg-bg-primary border border-white/15 overflow-hidden font-mono text-xs shadow-inner">
                      <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-text-muted">
                        <span className="font-bold text-white flex items-center gap-2">
                          <Code className="w-4 h-4 text-accent-hover" /> prisma/schema.prisma
                        </span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(msg.codeBlock); addToast('Code copied to system clipboard', 'success'); }}
                          className="hover:text-white transition-colors flex items-center gap-1 text-xs"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy AST
                        </button>
                      </div>
                      <pre className="p-4 text-emerald-400 overflow-x-auto leading-normal">{msg.codeBlock}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSynthesizing && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-bg-floating w-72 text-sm text-accent-hover font-bold animate-pulse">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Agent reasoning in progress...</span>
              </div>
            )}
          </div>

          {/* Bottom Chat Prompt Input Dock */}
          <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3 flex-shrink-0">
            <input
              type="text"
              placeholder={`Instruct autonomous IDE agent using ${selectedModel}...`}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              disabled={isSynthesizing}
              className="flex-1 h-13 px-5 rounded-2xl bg-bg-floating/90 hover:bg-bg-floating text-white placeholder-text-muted border border-white/10 focus:border-accent focus:outline-none transition-all duration-200 text-sm font-medium shadow-inner"
            />
            <GlowButton type="submit" variant="primary" className="!h-13 px-6 font-bold text-sm shadow-glow-accent" disabled={isSynthesizing}>
              <Send className="w-4 h-4 mr-1" /> Transmit
            </GlowButton>
          </form>
        </ClayCard>
      </div>

      {/* RIGHT PANE (30%): SIMULTANEOUS LIVE TOOL CALL INSPECTOR + VECTOR CITATIONS */}
      <div className="w-full xl:w-96 flex flex-col gap-4 flex-shrink-0 h-full">
        {/* Top Half: Live Tool Call Inspector */}
        <ClayCard className="p-4 flex-1 flex flex-col overflow-hidden border border-white/10" hover={false}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 flex-shrink-0">
            <span className="text-xs font-extrabold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-status-success" />
              <span>Live MCP Tool Executions</span>
            </span>
            <span className="text-[10px] font-mono bg-status-success/15 text-status-success px-2 py-0.5 rounded-full animate-pulse">
              ● Live Stream
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 text-xs font-mono pr-1">
            {toolCalls.map(tool => (
              <div key={tool.id} className="p-3 rounded-2xl bg-bg-secondary/80 border border-white/8 hover:border-white/15 transition-all">
                <div className="flex items-center justify-between text-white font-bold mb-1">
                  <span className="text-accent-hover truncate max-w-[190px]">{tool.tool}</span>
                  <span className="text-status-success text-[10px]">{tool.latency}</span>
                </div>
                <div className="text-text-muted text-[11px] truncate mb-1">Args: {tool.args}</div>
                <div className="text-emerald-400/90 text-[11px] bg-black/40 p-2 rounded-lg border border-white/5 truncate">
                  ➔ {tool.result}
                </div>
              </div>
            ))}
          </div>
        </ClayCard>

        {/* Bottom Half: Cited Vector Memory Sources */}
        <ClayCard className="p-4 flex-1 flex flex-col overflow-hidden border border-white/10" hover={false}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 flex-shrink-0">
            <span className="text-xs font-extrabold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-status-warning" />
              <span>Cited Memory Embeddings</span>
            </span>
            <span className="text-[10px] font-mono text-text-muted">Cosine Sim Top-K</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 text-xs pr-1">
            {citedSources.map(src => (
              <div key={src.id} className="p-3 rounded-2xl bg-white/4 hover:bg-white/8 border border-white/8 transition-all space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span className="truncate max-w-[200px] text-accent-hover">{src.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-warning/15 text-status-warning font-bold">
                    Score {(src.score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-text-muted font-mono text-[11px] truncate">{src.chunk}</div>
                <div className="text-[10px] text-text-secondary pt-1 border-t border-white/5 flex items-center justify-between">
                  <span>Base: {src.collection}</span>
                  <button onClick={() => addToast(`Opening vector chunk from ${src.collection}`, 'info')} className="text-white hover:underline font-semibold">
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ClayCard>
      </div>
    </div>
  );
};

export default ChatWorkspacePage;

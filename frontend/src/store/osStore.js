import { create } from 'zustand';

export const useOSStore = create((set, get) => ({
  // Workspace & User State
  currentWorkspace: { id: 'ws-1', name: 'Production AI Core', role: 'Head of AI Architecture' },
  workspaces: [
    { id: 'ws-1', name: 'Production AI Core', agents: 14, tokens: '12.4M' },
    { id: 'ws-2', name: 'Enterprise R&D Sandbox', agents: 6, tokens: '4.1M' },
    { id: 'ws-3', name: 'Security & Red Team Ops', agents: 8, tokens: '9.8M' }
  ],
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  switchWorkspace: (wsId) => {
    const target = get().workspaces.find(w => w.id === wsId);
    if (target) set({ currentWorkspace: { ...target, role: 'Head of AI Architecture' } });
  },

  // Projects State
  projects: [
    {
      id: 'proj-1',
      name: 'Autonomous Software Engineer',
      description: 'End-to-end multi-agent software developer capable of architecting, coding, PR testing, and deployment.',
      status: 'Active',
      repo: 'github.com/antigravity/auto-dev-engine',
      agentsCount: 6,
      tokensUsed: '4.8M',
      monthlyCost: '$142.50',
      lastCommit: 'fix(mcp): resolve concurrent websocket locks in docker sandbox',
      updatedAt: '2 mins ago',
      pinned: true,
      architecture: [
        { id: 'node-1', type: 'model', name: 'Claude 3.7 Sonnet', label: 'Primary Reasoner' },
        { id: 'node-2', type: 'mcp', name: 'GitHub MCP Server', label: 'Repo Control' },
        { id: 'node-3', type: 'memory', name: 'Codebase Vector DB', label: '1536d Embeddings' },
        { id: 'node-4', type: 'agent', name: 'QA & Self-Correction Agent', label: 'Automated Test Suite' }
      ]
    },
    {
      id: 'proj-2',
      name: 'Zero-Day Security Sentinel',
      description: 'Autonomous cyber threat hunting and AST vulnerability scanner across internal Kubernetes clusters.',
      status: 'Active',
      repo: 'github.com/antigravity/k8s-sec-sentinel',
      agentsCount: 4,
      tokensUsed: '3.1M',
      monthlyCost: '$89.20',
      lastCommit: 'feat(trace): inject eBPF kernel event analyzer for memory leak anomaly',
      updatedAt: '14 mins ago',
      pinned: true
    },
    {
      id: 'proj-3',
      name: 'Enterprise Financial Forecasting',
      description: 'Multimodal quarterly prediction engine synthesizing Bloomberg feeds, PDF quarterly reports, and SEC 10-K filings.',
      status: 'Active',
      repo: 'github.com/antigravity/quant-synth-v4',
      agentsCount: 5,
      tokensUsed: '5.2M',
      monthlyCost: '$210.00',
      lastCommit: 'perf(qdrant): shard historical market ticks across 4 nodes',
      updatedAt: '1 hour ago',
      pinned: false
    }
  ],
  activeProjectId: 'proj-1',
  setActiveProject: (id) => set({ activeProjectId: id }),

  // Agents State
  agents: [
    {
      id: 'agent-1',
      name: 'Code Weaver V3',
      role: 'Chief Autonomous Developer',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      status: 'Running',
      currentTask: 'Synthesizing Prisma schema migration for multi-tenant billing IDs',
      currentThought: 'Analyzing relational constraints and foreign keys in Postgres MCP before generating zero-downtime migration scripts...',
      memoryUsage: '412 MB',
      model: 'Claude 3.7 Sonnet',
      latency: '24ms',
      tokens: '142,590',
      runningTime: '4h 12m',
      progress: 78
    },
    {
      id: 'agent-2',
      name: 'SecOp Sentinel',
      role: 'Vulnerability Red-Teamer',
      avatar: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=120&q=80',
      status: 'Thinking',
      currentTask: 'Fuzzing OAuth2 token refresh race conditions on edge ingress gateways',
      currentThought: 'Constructing high-frequency adversarial JWT payloads to test rate-limiting thresholds...',
      memoryUsage: '680 MB',
      model: 'DeepSeek R1',
      latency: '18ms',
      tokens: '310,400',
      runningTime: '12h 45m',
      progress: 45
    },
    {
      id: 'agent-3',
      name: 'Schema Architect',
      role: 'Knowledge Graph Synthesizer',
      avatar: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=120&q=80',
      status: 'Running',
      currentTask: 'Extracting semantic relationships from 45 ArXiv machine learning whitepapers',
      currentThought: 'Embedding attention mechanism equations into dense high-dimensional clusters...',
      memoryUsage: '1.2 GB',
      model: 'GPT-4o',
      latency: '35ms',
      tokens: '890,120',
      runningTime: '1d 6h',
      progress: 92
    },
    {
      id: 'agent-4',
      name: 'DevOps Automator',
      role: 'Infrastructure & Kubernetes Healer',
      avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=120&q=80',
      status: 'Idle',
      currentTask: 'Awaiting cluster alert event or pull request merge trigger',
      currentThought: 'All pods nominal across US-East-1 and EU-West-4. Heartbeat telemetry checked.',
      memoryUsage: '180 MB',
      model: 'Claude 3.3 Opus',
      latency: '12ms',
      tokens: '45,210',
      runningTime: '3d 14h',
      progress: 100
    },
    {
      id: 'agent-5',
      name: 'Dataform Validator',
      role: 'ELT Pipeline Supervisor',
      avatar: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=120&q=80',
      status: 'Paused',
      currentTask: 'Paused by operator during upstream BigQuery schema freeze',
      currentThought: 'Checkpoint state persisted to Qdrant memory snapshot #409.',
      memoryUsage: '94 MB',
      model: 'Gemini 2.5 Pro',
      latency: '31ms',
      tokens: '12,900',
      runningTime: '0h 45m',
      progress: 20
    }
  ],
  toggleAgentStatus: (id) => set(state => ({
    agents: state.agents.map(agent => {
      if (agent.id === id) {
        const nextStatus = agent.status === 'Running' || agent.status === 'Thinking' ? 'Paused' : 'Running';
        return { ...agent, status: nextStatus };
      }
      return agent;
    })
  })),
  duplicateAgent: (id) => {
    const target = get().agents.find(a => a.id === id);
    if (target) {
      const newAgent = {
        ...target,
        id: `agent-${Date.now()}`,
        name: `${target.name} (Copy)`,
        status: 'Idle',
        tokens: '0',
        progress: 0,
        runningTime: '0m'
      };
      set(state => ({ agents: [newAgent, ...state.agents] }));
    }
  },
  deleteAgent: (id) => set(state => ({ agents: state.agents.filter(a => a.id !== id) })),

  // Knowledge Collections
  knowledgeCollections: [
    {
      id: 'know-1',
      name: 'AntiGravity Core SDK Repository',
      description: 'Source code syntax, AST trees, API contracts, and architecture documentation for autonomous agents.',
      documentsCount: 1420,
      embeddingsCount: '48,512 vectors',
      chunksCount: '192,400 chunks',
      storage: '485 MB',
      version: 'v4.8-beta',
      permissions: 'Role: Admin & Architect',
      githubSync: true,
      googleDriveSync: false,
      notionSync: false,
      lastSynced: '10 minutes ago'
    },
    {
      id: 'know-2',
      name: 'Enterprise Legal Contracts & SAIF',
      description: 'Security rules, SAIF risk matrices, SOC2 Type II audit logs, and vendor compliance records.',
      documentsCount: 310,
      embeddingsCount: '12,400 vectors',
      chunksCount: '45,000 chunks',
      storage: '128 MB',
      version: 'v2.1-prod',
      permissions: 'Role: Compliance Specialist Only',
      githubSync: false,
      googleDriveSync: true,
      notionSync: true,
      lastSynced: '1 hour ago'
    },
    {
      id: 'know-3',
      name: 'ArXiv Deep Learning Research 2025-2026',
      description: 'Curated corpus of state-of-the-art transformer architectures, inference scaling laws, and RLHF methodologies.',
      documentsCount: 5890,
      embeddingsCount: '210,000 vectors',
      chunksCount: '850,000 chunks',
      storage: '2.4 GB',
      version: 'v1.0-archive',
      permissions: 'Global Workspace Public',
      githubSync: false,
      googleDriveSync: false,
      notionSync: false,
      lastSynced: '2 days ago'
    }
  ],
  toggleSync: (colId, provider) => set(state => ({
    knowledgeCollections: state.knowledgeCollections.map(col => {
      if (col.id === colId) {
        return { ...col, [provider]: !col[provider] };
      }
      return col;
    })
  })),

  // MCP Servers State
  mcpServers: [
    { id: 'mcp-1', name: 'github-production-mcp', status: 'Connected', latency: '19ms', toolsCount: 24, health: '99.99%', logs: 'Last commit fetch signed with ed25519 key' },
    { id: 'mcp-2', name: 'postgres-analytics-db', status: 'Connected', latency: '6ms', toolsCount: 12, health: '100%', logs: 'Query pool capacity 45/100 active connections' },
    { id: 'mcp-3', name: 'playwright-browser-automation', status: 'Connected', latency: '42ms', toolsCount: 18, health: '98.5%', logs: 'Playwright worker pool warmed with Chromium engine' },
    { id: 'mcp-4', name: 'docker-sandbox-executor', status: 'Connected', latency: '11ms', toolsCount: 8, health: '100%', logs: 'Sandbox container #449c ready with Python 3.11 & Node 20' },
    { id: 'mcp-5', name: 'web-search-crawler', status: 'Disconnected', latency: '—', toolsCount: 5, health: 'Offline', logs: 'Connection reset by remote edge router' }
  ],
  reconnectMcp: (id) => set(state => ({
    mcpServers: state.mcpServers.map(server => {
      if (server.id === id) {
        return { ...server, status: 'Connected', latency: '22ms', health: '99.9%' };
      }
      return server;
    })
  })),
  disconnectMcp: (id) => set(state => ({
    mcpServers: state.mcpServers.map(server => {
      if (server.id === id) {
        return { ...server, status: 'Disconnected', latency: '—', health: 'Offline' };
      }
      return server;
    })
  })),

  // Model Catalog State
  models: [
    { id: 'mod-1', provider: 'Anthropic', name: 'Claude 3.7 Sonnet', speed: '98 t/s', context: '200K', priceIn: '$3.00 / 1M', priceOut: '$15.00 / 1M', latency: '410ms', reasoning: 'S+ Tier', vision: 'Yes', available: true, isDefault: true },
    { id: 'mod-2', provider: 'Anthropic', name: 'Claude 3.3 Opus', speed: '45 t/s', context: '200K', priceIn: '$15.00 / 1M', priceOut: '$75.00 / 1M', latency: '890ms', reasoning: 'S+ Tier', vision: 'Yes', available: true, isDefault: false },
    { id: 'mod-3', provider: 'OpenAI', name: 'GPT-4o (Omni)', speed: '110 t/s', context: '128K', priceIn: '$2.50 / 1M', priceOut: '$10.00 / 1M', latency: '380ms', reasoning: 'A+ Tier', vision: 'Yes', available: true, isDefault: false },
    { id: 'mod-4', provider: 'OpenAI', name: 'o3-mini (High Reasoning)', speed: '85 t/s', context: '200K', priceIn: '$1.10 / 1M', priceOut: '$4.40 / 1M', latency: '1,240ms (CoT)', reasoning: 'S Tier', vision: 'No', available: true, isDefault: false },
    { id: 'mod-5', provider: 'Google', name: 'Gemini 2.5 Pro', speed: '140 t/s', context: '2,000K', priceIn: '$1.25 / 1M', priceOut: '$5.00 / 1M', latency: '320ms', reasoning: 'S Tier', vision: 'Yes (Native 4K)', available: true, isDefault: false },
    { id: 'mod-6', provider: 'Google', name: 'Gemini 2.5 Flash-Lite', speed: '280 t/s', context: '1,000K', priceIn: '$0.075 / 1M', priceOut: '$0.30 / 1M', latency: '140ms', reasoning: 'A Tier', vision: 'Yes', available: true, isDefault: false },
    { id: 'mod-7', provider: 'DeepSeek', name: 'DeepSeek R1', speed: '95 t/s', context: '128K', priceIn: '$0.55 / 1M', priceOut: '$2.19 / 1M', latency: '980ms (CoT)', reasoning: 'S Tier', vision: 'No', available: true, isDefault: false },
    { id: 'mod-8', provider: 'Mistral', name: 'Mistral Large 2', speed: '105 t/s', context: '128K', priceIn: '$2.00 / 1M', priceOut: '$6.00 / 1M', latency: '450ms', reasoning: 'A Tier', vision: 'No', available: true, isDefault: false },
    { id: 'mod-9', provider: 'Local Ollama', name: 'Qwen 2.5 72B Instruct (FP8)', speed: '64 t/s', context: '64K', priceIn: '$0.00 (On-Prem)', priceOut: '$0.00 (On-Prem)', latency: '190ms', reasoning: 'A+ Tier', vision: 'No', available: true, isDefault: false }
  ],
  setDefaultModel: (id) => set(state => ({
    models: state.models.map(m => ({ ...m, isDefault: m.id === id }))
  })),

  // Analytics & System Health Telemetry
  analytics: {
    systemHealth: '99.98%',
    cpuUsage: 34,
    gpuCluster: { model: '8x NVIDIA H100 80GB SXM5', utilization: 74, vramUsed: '512 / 640 GB', temperature: '62°C' },
    ramUsage: '142 / 256 GB (55%)',
    liveTokenRate: '4,820 /sec',
    monthlyComputeSpend: '$8,412.50',
    totalRequests24h: '412,980',
    avgLatency: '194ms',
    tokenHistory: [
      { time: '00:00', Claude: 1420, GPT4o: 890, Gemini: 1200, DeepSeek: 500 },
      { time: '04:00', Claude: 980, GPT4o: 450, Gemini: 890, DeepSeek: 1200 },
      { time: '08:00', Claude: 3200, GPT4o: 2100, Gemini: 4100, DeepSeek: 2800 },
      { time: '12:00', Claude: 5400, GPT4o: 3800, Gemini: 6200, DeepSeek: 4900 },
      { time: '16:00', Claude: 4800, GPT4o: 4100, Gemini: 5900, DeepSeek: 5100 },
      { time: '20:00', Claude: 2900, GPT4o: 1900, Gemini: 3400, DeepSeek: 3200 },
    ],
    costDistribution: [
      { name: 'Autonomous Software Engineering', value: 3400, color: '#6D5EF8' },
      { name: 'Security & Vulnerability Scans', value: 2100, color: '#3DDC97' },
      { name: 'Knowledge Vector Embeddings', value: 1450, color: '#FFC857' },
      { name: 'Realtime Multimodal R&D', value: 1462, color: '#8478FF' },
    ]
  },

  // Observability Live Trace Waterfall
  traces: [
    { id: 'tr-01', time: '10:06:32.410', agent: 'Code Weaver V3', event: 'MCP Tool Exec', tool: 'postgres-mcp/query', latency: '14ms', status: 'Success', details: 'SELECT column_name FROM information_schema.columns WHERE table_name = "billing"' },
    { id: 'tr-02', time: '10:06:31.902', agent: 'Code Weaver V3', event: 'Reasoning Step', tool: 'Claude 3.7 Sonnet', latency: '410ms', status: 'Success', details: 'Synthesized foreign key cascade policy with 99.8% AST syntax validation.' },
    { id: 'tr-03', time: '10:06:29.110', agent: 'SecOp Sentinel', event: 'Security Fuzz', tool: 'playwright-mcp/http_post', latency: '85ms', status: 'Warning', details: 'Rate limit bucket exhausted (HTTP 429). Initiating exponential jitter backoff algorithm.' },
    { id: 'tr-04', time: '10:06:25.804', agent: 'Schema Architect', event: 'Vector Search', tool: 'qdrant/cosine_search', latency: '9ms', status: 'Success', details: 'Retrieved top-K=5 context chunks (score: 0.892) from ArXiv ML Papers Corpus.' },
    { id: 'tr-05', time: '10:06:21.312', agent: 'DevOps Automator', event: 'Health Check', tool: 'docker-sandbox-mcp/ping', latency: '5ms', status: 'Success', details: 'All 14 autonomous runner containers responding within <10ms threshold.' },
  ]
}));

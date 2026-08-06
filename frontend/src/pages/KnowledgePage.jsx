import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Search,
  CheckCircle2,
  RefreshCw,
  Sliders,
  FolderSync,
  Cloud,
  Github,
  FileText,
  Lock,
  Plus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useToast } from '../contexts/ToastContext';
import { ClayCard } from '../components/ui/ClayCard';
import { GlowButton } from '../components/ui/GlowButton';
import { PillBadge } from '../components/ui/PillBadge';
import { DarkInput } from '../components/ui/DarkInput';

const KnowledgePage = () => {
  const collections = useOSStore(state => state.knowledgeCollections);
  const toggleSync = useOSStore(state => state.toggleSync);
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simulate semantic vector search against embeddings database
  const handleVectorSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    addToast(`Computing 1536d cosine vector similarity for "${searchQuery}"...`, 'info');

    setTimeout(() => {
      setSearchResults([
        { title: 'AntiGravity_Agent_Orchestration_AST.ts', chunk: 'export interface AgentRuntime { id: string; mcpConnections: MCPAdapter[]; memoryVector: QdrantClient; }', score: '0.962', collection: 'AntiGravity Core SDK Repository' },
        { title: 'SAIF_AI_Security_Compliance_2026.pdf', chunk: 'Rule 4.1: All autonomous file modification requests must obtain user confirmation before destructive execution.', score: '0.914', collection: 'Enterprise Legal Contracts & SAIF' },
        { title: 'ArXiv_Transformer_Attention_Memory_2508.019.pdf', chunk: 'By pruning idle KV caches in multi-agent pipelines, inference hardware footprint drops by 38.4% on NVIDIA H100 arrays.', score: '0.885', collection: 'ArXiv Deep Learning Research' }
      ]);
      setIsSearching(false);
      addToast('Retrieved top-K=3 high similarity embedding chunks!', 'success');
    }, 1200);
  };

  const handleSyncToggle = (id, colName, provider, currentVal) => {
    toggleSync(id, provider);
    const label = provider === 'githubSync' ? 'GitHub Repos' : provider === 'googleDriveSync' ? 'Google Drive' : 'Notion AI Workspace';
    const status = currentVal ? 'disconnected from' : 'synchronized with';
    addToast(`Connector updated: ${label} is now ${status} ${colName}`, 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-xs font-bold text-status-warning uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Database className="w-4 h-4 animate-bounce text-status-warning" />
            <span>QDRANT VECTOR EMBEDDINGS & CORPUS HUB</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-sans">
            Knowledge & Memory Collections
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Synchronize enterprise document repositories, GitHub source code, and cloud storage into dense 1536d vector memory banks.
          </p>
        </div>

        <GlowButton
          variant="primary"
          icon={Plus}
          onClick={() => addToast('Opening ingestion modal: Supports PDF, TXT, MD, AST trees, and GitHub repo URLs', 'success')}
          className="shadow-glow-accent !h-11 text-sm"
        >
          Create Vector Collection
        </GlowButton>
      </div>

      {/* 1. INTERACTIVE SEMANTIC VECTOR SEARCH SANDBOX */}
      <ClayCard className="p-6 border border-white/15 bg-gradient-to-r from-bg-card to-bg-floating" hover={false}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-accent-hover" />
              <span>Semantic Vector Search Sandbox</span>
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Test cosine similarity retrievals across all embedded document chunks and code syntax trees in real time.
            </p>
          </div>
          <span className="text-xs font-mono text-status-success bg-status-success/10 px-3 py-1 rounded-full border border-status-success/20">
            ● Index status: 270,912 active vector chunks (100% indexed)
          </span>
        </div>

        <form onSubmit={handleVectorSearch} className="flex flex-col md:flex-row items-center gap-3">
          <DarkInput
            placeholder="Type a natural language question or code keyword (e.g. 'How do agents secure MCP connections?')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 !h-12 text-sm"
          />
          <GlowButton type="submit" variant="primary" loading={isSearching} className="w-full md:w-auto !h-12 px-8 font-bold text-sm shadow-glow-accent">
            Run Cosine Query
          </GlowButton>
        </form>

        {/* Display Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <div className="text-xs font-bold uppercase text-text-muted">Top-K Retrieved Vector Matches:</div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {searchResults.map((res, i) => (
                <div key={i} className="p-4 rounded-2xl bg-bg-primary/80 border border-white/10 hover:border-accent/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-sm text-accent-hover truncate">{res.title}</span>
                      <span className="text-xs font-mono font-extrabold bg-accent/20 text-white px-2 py-0.5 rounded-md border border-accent/30">
                        Score {res.score}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-text-secondary leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                      "{res.chunk}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-text-muted font-semibold">
                    <span>{res.collection}</span>
                    <span className="text-status-success flex items-center gap-1">Verified <ShieldCheck className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ClayCard>

      {/* 2. KNOWLEDGE COLLECTIONS MATRIX */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-text-primary font-sans tracking-tight">Active Embedded Collections</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <ClayCard key={col.id} className="p-6 flex flex-col justify-between border border-white/10" hover>
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <Database className="w-6 h-6" />
                  </div>
                  <PillBadge variant="success" dot>
                    {col.version}
                  </PillBadge>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight hover:text-accent-hover transition-colors mb-2">
                  {col.name}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-6">
                  {col.description}
                </p>

                {/* Vector Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs font-mono mb-6">
                  <div className="p-2.5 rounded-xl bg-white/4 border border-white/6">
                    <div className="text-text-muted font-sans font-bold text-[10px] uppercase">Vectors</div>
                    <div className="text-white font-bold mt-0.5">{col.embeddingsCount}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/4 border border-white/6">
                    <div className="text-text-muted font-sans font-bold text-[10px] uppercase">Density</div>
                    <div className="text-white font-bold mt-0.5">{col.chunksCount}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/4 border border-white/6">
                    <div className="text-text-muted font-sans font-bold text-[10px] uppercase">Footprint</div>
                    <div className="text-white font-bold mt-0.5">{col.storage}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/4 border border-white/6">
                    <div className="text-text-muted font-sans font-bold text-[10px] uppercase">Last Indexed</div>
                    <div className="text-status-success font-bold mt-0.5">{col.lastSynced}</div>
                  </div>
                </div>

                {/* Interactive Sync Connectors Toggles */}
                <div className="space-y-2 mb-6">
                  <div className="text-xs font-extrabold text-text-muted uppercase tracking-wider mb-2">Live Cloud Connectors:</div>

                  {/* GitHub Repo Sync */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-primary/60 border border-white/8">
                    <span className="text-xs font-semibold text-white flex items-center gap-2">
                      <Github className="w-4 h-4 text-accent-hover" /> GitHub Continuous PR Sync
                    </span>
                    <button
                      onClick={() => handleSyncToggle(col.id, col.name, 'githubSync', col.githubSync)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                        col.githubSync ? 'bg-status-success/20 text-status-success border border-status-success/30' : 'bg-white/10 text-text-muted hover:text-white'
                      }`}
                    >
                      {col.githubSync ? 'Sync Active' : 'Disconnected'}
                    </button>
                  </div>

                  {/* Google Drive Sync */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-primary/60 border border-white/8">
                    <span className="text-xs font-semibold text-white flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-blue-400" /> Google Drive Enterprise Folder
                    </span>
                    <button
                      onClick={() => handleSyncToggle(col.id, col.name, 'googleDriveSync', col.googleDriveSync)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                        col.googleDriveSync ? 'bg-status-success/20 text-status-success border border-status-success/30' : 'bg-white/10 text-text-muted hover:text-white'
                      }`}
                    >
                      {col.googleDriveSync ? 'Sync Active' : 'Disconnected'}
                    </button>
                  </div>

                  {/* Notion AI Workspace Sync */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-primary/60 border border-white/8">
                    <span className="text-xs font-semibold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" /> Notion AI Workspace Sync
                    </span>
                    <button
                      onClick={() => handleSyncToggle(col.id, col.name, 'notionSync', col.notionSync)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                        col.notionSync ? 'bg-status-success/20 text-status-success border border-status-success/30' : 'bg-white/10 text-text-muted hover:text-white'
                      }`}
                    >
                      {col.notionSync ? 'Sync Active' : 'Disconnected'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-text-muted font-medium">
                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-status-warning" /> {col.permissions}</span>
                <button onClick={() => addToast(`Opening AST viewer for ${col.name}`, 'info')} className="text-accent-hover font-bold hover:underline flex items-center gap-1">
                  Manage Vectors →
                </button>
              </div>
            </ClayCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage;

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Cpu,
  Zap,
  DollarSign,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Server
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useToast } from '../contexts/ToastContext';
import { ClayCard } from '../components/ui/ClayCard';
import { GlowButton } from '../components/ui/GlowButton';
import { PillBadge } from '../components/ui/PillBadge';
import { DarkInput } from '../components/ui/DarkInput';

const ModelsPage = () => {
  const models = useOSStore(state => state.models);
  const setDefaultModel = useOSStore(state => state.setDefaultModel);
  const { addToast } = useToast();

  const [selectedProvider, setSelectedProvider] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const providers = ['All', 'Anthropic', 'OpenAI', 'Google', 'DeepSeek', 'Mistral', 'Local Ollama'];

  const filteredModels = models.filter(m => {
    const matchesProvider = selectedProvider === 'All' || m.provider === selectedProvider;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  const handleSetDefault = (id, name) => {
    setDefaultModel(id);
    addToast(`Global default reasoning model switched to ${name}`, 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-xs font-bold text-accent-hover uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 animate-bounce text-accent-hover" />
            <span>UNIVERSAL MODEL CATALOG & INFERENCE ROUTING</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-sans">
            Foundation Models Registry
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Configure intelligent model routing across frontier cloud APIs and localized on-premises Ollama GPU inference clusters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DarkInput
            placeholder="Search model catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 !h-11 text-sm"
          />
          <GlowButton variant="secondary" icon={Server} onClick={() => addToast('Opening custom LLM endpoint connection string (vLLM / Triton)...', 'info')} className="!h-11 text-sm">
            Connect Custom Endpoint
          </GlowButton>
        </div>
      </div>

      {/* Provider Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {providers.map(prov => (
          <button
            key={prov}
            onClick={() => setSelectedProvider(prov)}
            className={`px-4 py-2 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border ${
              selectedProvider === prov
                ? 'bg-accent/20 border-accent text-white shadow-glow-accent'
                : 'bg-bg-floating/60 border-white/8 text-text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            {prov}
          </button>
        ))}
      </div>

      {/* Models Comparative Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <ClayCard
            key={model.id}
            className={`p-6 flex flex-col justify-between border ${model.isDefault ? 'border-accent/60 bg-accent/5' : 'border-white/10'}`}
            hover
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-extrabold text-accent-hover uppercase font-mono tracking-wider">
                    {model.provider}
                  </span>
                  <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    {model.name}
                  </h3>
                </div>
                {model.isDefault ? (
                  <span className="px-3 py-1 rounded-full bg-accent text-white text-xs font-bold shadow-glow-accent flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Default
                  </span>
                ) : (
                  <PillBadge variant="success" dot>
                    Online
                  </PillBadge>
                )}
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-6">
                <div className="p-3 rounded-2xl bg-white/4 border border-white/6">
                  <div className="text-text-muted font-sans font-bold text-[10px] uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 text-status-warning" /> Speed Throughput
                  </div>
                  <div className="text-white font-black text-sm mt-1">{model.speed}</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/4 border border-white/6">
                  <div className="text-text-muted font-sans font-bold text-[10px] uppercase flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-blue-400" /> Max Context
                  </div>
                  <div className="text-white font-black text-sm mt-1">{model.context} words</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/4 border border-white/6">
                  <div className="text-text-muted font-sans font-bold text-[10px] uppercase flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-status-success" /> Pricing Input/Output
                  </div>
                  <div className="text-status-success font-bold text-xs mt-1 truncate">{model.priceIn}</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/4 border border-white/6">
                  <div className="text-text-muted font-sans font-bold text-[10px] uppercase flex items-center gap-1">
                    <Eye className="w-3 h-3 text-purple-400" /> Vision & Reasoning
                  </div>
                  <div className="text-white font-bold text-xs mt-1">{model.reasoning} • {model.vision === 'No' ? 'Text Only' : 'Vision'}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-text-muted font-mono">Ping: {model.latency}</span>

              {model.isDefault ? (
                <span className="text-xs font-bold text-status-success flex items-center gap-1">
                  Active OS Core Reasoner
                </span>
              ) : (
                <GlowButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSetDefault(model.id, model.name)}
                  className="!h-9 text-xs"
                >
                  Set as Default Reasoner
                </GlowButton>
              )}
            </div>
          </ClayCard>
        ))}
      </div>
    </div>
  );
};

export default ModelsPage;

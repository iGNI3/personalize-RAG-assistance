import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  Cpu,
  Activity,
  DollarSign,
  Zap,
  TrendingUp,
  Server,
  Download,
  Calendar
} from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useToast } from '../contexts/ToastContext';
import { ClayCard } from '../components/ui/ClayCard';
import { GlowButton } from '../components/ui/GlowButton';

const AnalyticsPage = () => {
  const analytics = useOSStore(state => state.analytics);
  const { addToast } = useToast();

  const [timeRange, setTimeRange] = useState('24h');

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-modal p-3.5 rounded-2xl border border-white/15 text-xs shadow-2xl font-sans">
          <div className="font-bold text-white mb-2 border-b border-white/10 pb-1.5">Time: {label}</div>
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-6 my-1">
              <span style={{ color: item.color }} className="font-bold">{item.name}:</span>
              <span className="font-mono font-extrabold text-white">{item.value.toLocaleString()} tokens</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="text-xs font-bold text-status-success uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 animate-pulse text-status-success" />
            <span>MISSION CONTROL • REALTIME TELEMETRY</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-sans">
            Hardware Telemetry & Cost Analytics
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Deep GPU utilization monitoring, token inference burn rates, and financial compute cost distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-bg-floating/80 p-1 rounded-2xl border border-white/10 text-xs font-bold">
            {['1h', '24h', '7d', '30d'].map(range => (
              <button
                key={range}
                onClick={() => { setTimeRange(range); addToast(`Telemetry window adjusted to past ${range}`, 'info'); }}
                className={`px-4 py-1.5 rounded-xl transition-all ${timeRange === range ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <GlowButton variant="secondary" icon={Download} onClick={() => addToast('Exporting CSV compute telemetry audit...', 'success')} className="!h-10 text-xs">
            Export Report
          </GlowButton>
        </div>
      </div>

      {/* Hardware Gauge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ClayCard className="p-5 flex flex-col justify-between border border-white/10" hover={false}>
          <div className="flex items-center justify-between text-text-secondary mb-3">
            <span className="text-xs font-bold uppercase">GPU Cluster Load</span>
            <Server className="w-5 h-5 text-accent-hover" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{analytics.gpuCluster.utilization}% <span className="text-sm font-normal text-text-muted">Load</span></div>
            <div className="text-xs text-text-muted mt-1 font-mono">{analytics.gpuCluster.model}</div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-accent to-status-warning rounded-full" style={{ width: `${analytics.gpuCluster.utilization}%` }} />
            </div>
          </div>
        </ClayCard>

        <ClayCard className="p-5 flex flex-col justify-between border border-white/10" hover={false}>
          <div className="flex items-center justify-between text-text-secondary mb-3">
            <span className="text-xs font-bold uppercase">System VRAM</span>
            <Cpu className="w-5 h-5 text-status-success" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{analytics.gpuCluster.vramUsed}</div>
            <div className="text-xs text-status-success font-semibold mt-1">● High Speed SXM5 Memory Bandwidth</div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-status-success to-emerald-400 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </ClayCard>

        <ClayCard className="p-5 flex flex-col justify-between border border-white/10" hover={false}>
          <div className="flex items-center justify-between text-text-secondary mb-3">
            <span className="text-xs font-bold uppercase">Total Requests (24h)</span>
            <TrendingUp className="w-5 h-5 text-status-warning" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{analytics.totalRequests24h}</div>
            <div className="text-xs text-text-muted mt-1 font-mono">Avg Latency: <strong className="text-white">{analytics.avgLatency}</strong></div>
            <div className="text-xs text-status-success mt-3 font-semibold">▲ +24.1% user throughput growth</div>
          </div>
        </ClayCard>

        <ClayCard className="p-5 flex flex-col justify-between border border-white/10" hover={false}>
          <div className="flex items-center justify-between text-text-secondary mb-3">
            <span className="text-xs font-bold uppercase">System Uptime</span>
            <Activity className="w-5 h-5 text-status-success animate-pulse" />
          </div>
          <div>
            <div className="text-3xl font-black text-status-success">{analytics.systemHealth}</div>
            <div className="text-xs text-text-muted mt-1">Zero downtime automated rollover active</div>
            <div className="text-xs font-mono text-text-muted mt-3">Temperature: {analytics.gpuCluster.temperature} (Nominal)</div>
          </div>
        </ClayCard>
      </div>

      {/* Interactive Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Token Consumption Over Time Line Chart */}
        <ClayCard className="p-6 lg:col-span-2 border border-white/10 flex flex-col justify-between" hover={false}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Hourly Token Consumption by Model</h2>
              <p className="text-xs text-text-secondary">Measured across all 14 active autonomous agent loops.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-white"><span className="w-2.5 h-2.5 rounded-full bg-[#6D5EF8]" /> Claude 3.7</span>
              <span className="flex items-center gap-1.5 text-white"><span className="w-2.5 h-2.5 rounded-full bg-[#3DDC97]" /> GPT-4o</span>
              <span className="flex items-center gap-1.5 text-white"><span className="w-2.5 h-2.5 rounded-full bg-[#FFC857]" /> Gemini 2.5</span>
            </div>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.tokenHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.25)" tick={{ fill: '#808CA8', fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.25)" tick={{ fill: '#808CA8', fontSize: 12 }} />
                <Tooltip content={customTooltip} />
                <Line type="monotone" dataKey="Claude" name="Claude 3.7 Sonnet" stroke="#6D5EF8" strokeWidth={3} dot={{ r: 4, fill: '#6D5EF8' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="GPT4o" name="OpenAI GPT-4o" stroke="#3DDC97" strokeWidth={3} dot={{ r: 4, fill: '#3DDC97' }} />
                <Line type="monotone" dataKey="Gemini" name="Google Gemini 2.5 Pro" stroke="#FFC857" strokeWidth={3} dot={{ r: 4, fill: '#FFC857' }} />
                <Line type="monotone" dataKey="DeepSeek" name="DeepSeek R1" stroke="#FF6B6B" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ClayCard>

        {/* Right Col: Cost Distribution Breakdown */}
        <ClayCard className="p-6 border border-white/10 flex flex-col justify-between" hover={false}>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight mb-1">Compute Cost Breakdown</h2>
            <p className="text-xs text-text-secondary mb-6">Financial allocation per project feature category.</p>

            <div className="w-full h-52 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.costDistribution}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.costDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`$${val} spend`, 'Allocation']}
                    contentStyle={{ backgroundColor: '#12192C', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-text-muted">Total Spend</span>
                <span className="text-base font-extrabold text-white">{analytics.monthlyComputeSpend}</span>
              </div>
            </div>

            <div className="space-y-2.5 mt-4 text-xs">
              {analytics.costDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/4 border border-white/6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-text-primary">{item.name}</span>
                  </div>
                  <span className="font-mono font-extrabold text-white">${item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ClayCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;

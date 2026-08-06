import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Activity, Clock, Zap, Target, TrendingUp } from 'lucide-react';
import { api } from '../api/client';
import { SkeletonLoader } from '../components/LoadingStates';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b'];

const MetricsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.getMetricsSummary();
        if (!data.timeseries) {
          data.timeseries = [];
        }
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch metrics", err);
        // Set actual zero/empty state instead of deceptive dummy data
        setSummary({
          total_queries: 0,
          avg_response_time: 0,
          total_tokens_used: 0,
          success_rate: 0,
          queries_by_model: {},
          recent_queries: [],
          timeseries: []
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="glass-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-secondary font-medium">{title}</h3>
        <div className="p-2 bg-bg-tertiary rounded-lg text-accent-primary">
          <Icon size={20} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-success font-medium">
            <TrendingUp size={14} />
            <span>{trend} vs last week</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading || !summary) {
    return (
      <div className="page-container max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i => <SkeletonLoader key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader className="h-80 w-full" />
          <SkeletonLoader className="h-80 w-full" />
        </div>
      </div>
    );
  }

  const modelData = Object.entries(summary.queries_by_model || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="page-header">
          <div>
            <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-secondary text-sm">System performance and usage metrics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Queries" 
            value={summary.total_queries.toLocaleString()} 
            icon={Activity} 
          />
          <StatCard 
            title="Avg Response Time" 
            value={`${Math.round(summary.avg_response_time)}ms`} 
            icon={Clock} 
          />
          <StatCard 
            title="Tokens Used" 
            value={summary.total_tokens_used >= 1000 ? (summary.total_tokens_used / 1000).toFixed(1) + 'k' : summary.total_tokens_used.toLocaleString()} 
            icon={Zap} 
          />
          <StatCard 
            title="Success Rate" 
            value={`${Math.round(summary.success_rate)}%`} 
            icon={Target} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Response Time Chart */}
          <div className="glass-card">
            <h3 className="font-semibold mb-6">Response Time & Query Volume</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.timeseries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Area type="monotone" dataKey="responseTime" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Usage Chart */}
          <div className="glass-card">
            <h3 className="font-semibold mb-6">Model Distribution</h3>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {modelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Queries Table */}
        <div className="glass-card overflow-hidden p-0">
          <div className="p-6 border-b border-border-glass">
            <h3 className="font-semibold">Recent Queries</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-tertiary bg-opacity-50 text-secondary text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Query</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Time (ms)</th>
                  <th className="p-4 font-medium">Tokens</th>
                  <th className="p-4 font-medium">Model</th>
                  <th className="p-4 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass text-sm">
                {summary.recent_queries?.map((query, i) => (
                  <tr key={i} className="hover:bg-bg-glass-hover transition-colors">
                    <td className="p-4 font-medium text-primary max-w-xs truncate" title={query.query}>
                      {query.query}
                    </td>
                    <td className="p-4">
                      <span className={`badge ${query.status === 'success' ? 'badge-success' : 'badge-error'}`}>
                        {query.status}
                      </span>
                    </td>
                    <td className="p-4 text-secondary">{query.response_time_ms}</td>
                    <td className="p-4 text-secondary">{query.total_tokens}</td>
                    <td className="p-4 text-secondary">
                      <span className="badge badge-neutral bg-transparent border-border-glass-hover text-xs">
                        {query.model_name}
                      </span>
                    </td>
                    <td className="p-4 text-secondary text-xs whitespace-nowrap">
                      {new Date(query.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {(!summary.recent_queries || summary.recent_queries.length === 0) && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-secondary">
                      No recent queries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPage;

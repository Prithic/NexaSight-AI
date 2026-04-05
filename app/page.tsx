"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  TrendingUp,
  Shield,
  ShieldCheck,
  Zap,
  Clock,
  ArrowUpRight,
  FileText
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { supabase } from "@/lib/supabase";

const chartData = [
  { name: 'Mon', reports: 40 },
  { name: 'Tue', reports: 30 },
  { name: 'Wed', reports: 45 },
  { name: 'Thu', reports: 50 },
  { name: 'Fri', reports: 65 },
  { name: 'Sat', reports: 45 },
  { name: 'Sun', reports: 20 },
];

const insights = [
  { 
    title: "Anomaly Detected: Sector 7", 
    description: "AI identified a 40% increase in waste-related reports in the last 48 hours. Potential localized collection failure.",
    severity: "High" 
  },
  { 
    title: "Efficiency Gain: Zone B", 
    description: "Pothole repair response time improved by 15% following the new prioritization algorithm.",
    severity: "Info" 
  }
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    uptime: "99.9%"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: total } = await supabase.from('reports').select('*', { count: 'exact', head: true });
        const { count: active } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'Pending');
        const { count: resolved } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'Resolved');
        
        setStats({
          total: total || 0,
          active: active || 0,
          resolved: resolved || 0,
          uptime: "99.9%"
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Reports", value: stats.total, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12% Inc" },
    { label: "Active Issues", value: stats.active, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10", trend: "High Priority" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "98% Success" },
    { label: "System Uptime", value: stats.uptime, icon: Activity, color: "text-brand", bg: "bg-brand/10", trend: "Optimal" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden p-12 rounded-[3.5rem] glass border border-white/10">
        <div className="z-10 space-y-4">
          <div className="space-y-1">
            <h2 className="text-5xl font-black tracking-tight text-white leading-tight">
              City Intelligence <br/> 
              <span className="text-zinc-500">Command Center</span>
            </h2>
            <p className="text-zinc-400 font-medium text-xl max-w-lg">
              Real-time urban diagnostic and predictive analytics for smart infrastructure.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
             <Link href="/report" className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center space-x-3 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl">
               <Plus size={16} strokeWidth={3} />
               <span>New Incident Report</span>
             </Link>
             <button className="px-8 py-4 rounded-2xl bg-zinc-900 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-colors">
               Live Analytics
             </button>
             <button className="px-8 py-4 rounded-2xl bg-zinc-900 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-colors">
               Response Teams
             </button>
          </div>
        </div>

        {/* User Activity Stub */}
        <div className="z-10 flex flex-col items-end space-y-4">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] font-black text-white overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[10px] font-black text-brand">
                +14
              </div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Active Fleet Personnel</p>
        </div>
        
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand/10 blur-[100px] rounded-full" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand/5 to-transparent flex items-center justify-center opacity-40">
           <ShieldCheck size={400} className="text-brand opacity-5 pointer-events-none" strokeWidth={0.5} />
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl glass glass-hover group border border-white/5"
          >
            <div className="flex h-full items-start justify-between">
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                  <h3 className="text-3xl font-black text-white mt-1">
                    {loading ? "..." : stat.value}
                  </h3>
                </div>
                <div className="flex items-center space-x-1 text-[10px] font-bold text-zinc-400">
                  <TrendingUp size={12} className={stat.color} />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <ArrowUpRight size={20} className="text-zinc-700 group-hover:text-brand transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[2.5rem] border border-white/5"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold">Incident Velocity</h3>
                <p className="text-sm text-muted-foreground">7-Day average reporting frequency</p>
              </div>
              <div className="flex items-center space-x-2 text-brand text-sm font-bold bg-brand/10 px-3 py-1.5 rounded-xl">
                <TrendingUp size={16} />
                <span>+24% vs Last Week</span>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(10px)'
                    }}
                    itemStyle={{ color: 'var(--brand)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="reports" 
                    stroke="var(--brand)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorReports)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${insight.severity === 'High' ? 'text-rose-500' : 'text-brand'}`}>
                    {insight.severity} Alert
                  </span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-bold mb-2">{insight.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="glass p-6 rounded-[2rem] border border-brand/20 bg-brand/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 bg-brand rounded-bl-3xl">
              <Zap size={20} className="text-white animate-pulse" />
            </div>
            <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
              <span>Predictive Alert</span>
            </h3>
            <p className="text-sm text-brand-light leading-relaxed mb-6">
              AI models predict a **15% increase** in water leakage reports in Sector 4 over the next 48 hours due to pressure fluctuations.
            </p>
            <button className="w-full py-3 rounded-xl bg-brand text-white text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95">
              Deploy Preventive Crew
            </button>
          </div>

          <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
            <h3 className="font-bold flex items-center space-x-2">
              <Clock size={18} className="text-brand" />
              <span>Recent Activity</span>
            </h3>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-brand" />
                  <div className="flex-1">
                    <p className="text-xs font-bold">New report: Road Damage</p>
                    <p className="text-[10px] text-muted-foreground">Sector 7 • {i * 5} mins ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

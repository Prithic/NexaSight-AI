"use client";

import { motion } from "framer-motion";
import { 
  AlertCircle, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Zap,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Reports", value: "1,284", icon: BarChart3, color: "text-brand" },
  { label: "Active Issues", value: "412", icon: AlertCircle, color: "text-amber-400" },
  { label: "Resolved", value: "872", icon: CheckCircle2, color: "text-emerald-400" },
  { label: "Critical Priority", value: "12", icon: Zap, color: "text-rose-500" },
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

export default function Home() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Civic Intelligence Dashboard</h2>
          <p className="text-muted-foreground mt-1">Real-time monitoring and AI-driven urban analytics.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 rounded-xl glass glass-hover text-sm font-medium flex items-center space-x-2">
            <span>Export Report</span>
          </button>
          <Link href="/report" className="px-6 py-2 rounded-xl bg-brand hover:bg-brand-dark transition-colors text-sm font-bold shadow-lg shadow-brand/20">
            Submit New Report
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl glass glass-hover relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon size={64} />
            </div>
            <div className={`p-2 rounded-lg bg-white/5 w-fit mb-4 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Insight Section */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl glass relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <div className="animate-pulse bg-brand/10 p-4 rounded-full">
                <TrendingUp className="text-brand" size={32} />
              </div>
            </div>
            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">AI Insight Engine</span>
              <h3 className="text-2xl font-bold mt-4">City Health Analysis</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Our neural models have processed 12,000+ data points today. Overall city maintenance efficiency is up <span className="text-emerald-400 font-bold">12.4%</span> this week.
              </p>
              <div className="mt-8 flex items-center space-x-4">
                <div className="h-12 w-full bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-sm">Critical Hotspots</span>
                  <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-500 text-xs font-bold">3 Detected</span>
                </div>
                <div className="h-12 w-full bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-sm">Predicted Failures</span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-500 text-xs font-bold">8 Low Risk</span>
                </div>
              </div>
            </div>
          </div>

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

        {/* Impact Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass h-full">
            <h3 className="text-xl font-bold mb-6">Area Impact Ranking</h3>
            <div className="space-y-6">
              {[
                { name: "Downtown Core", score: 98, status: "stable" },
                { name: "Sector 7 North", score: 64, status: "declining" },
                { name: "West Valley", score: 85, status: "improving" },
                { name: "Old Quarter", score: 72, status: "stable" },
              ].map((area, i) => (
                <div key={area.name} className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{area.name}</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${area.score}%` }}
                        className={`h-full ${area.score > 80 ? 'bg-emerald-500' : area.score > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">{area.score}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{area.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
              View Detailed Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

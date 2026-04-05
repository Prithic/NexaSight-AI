"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import { AlertTriangle, Loader2, Info, Navigation, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import the entire Map component to avoid SSR and Type issues
const RealTimeMap = dynamic(
  () => import("@/components/RealTimeMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-[2.5rem] border border-white/5 animate-pulse">
        <Loader2 className="animate-spin text-brand mb-4" size={40} strokeWidth={1.5} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Initialiazing Geospatial Engine</p>
      </div>
    )
  }
);

export default function MapPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .limit(100);

        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error("Map fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-1">
             <h2 className="text-4xl font-black tracking-tight text-white">Live Intelligence Map</h2>
             <div className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-[8px] font-black uppercase tracking-widest text-rose-500 flex items-center space-x-1">
                <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                <span>Real-time</span>
             </div>
          </div>
          <p className="text-zinc-500 font-medium text-lg">Interactive visualization of city hazards and infrastructure status.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-zinc-900/50 border border-white/5 p-1.5 rounded-2xl">
          {['Heatmap', 'Markers', 'Satellite'].map((tab) => (
            <button 
              key={tab}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === 'Markers' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 rounded-[3rem] overflow-hidden glass border border-white/5 relative shadow-2xl">
        <AnimatePresence mode="wait">
          {!loading ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="w-full h-full"
            >
              <RealTimeMap reports={reports} />
            </motion.div>
          ) : (
            <div className="w-full h-full bg-zinc-900/20" />
          )}
        </AnimatePresence>

        {/* Floating Side Info */}
        <div className="absolute top-6 left-6 z-[1000] space-y-3">
           <div className="p-4 glass rounded-3xl border border-white/10 w-64 backdrop-blur-3xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center space-x-2">
                <Layers size={14} className="text-brand" />
                <span>Active Layers</span>
              </h3>
              <div className="space-y-3">
                 <div className="flex items-center justify-between group cursor-pointer">
                    <span className="text-[10px] font-bold text-white group-hover:text-brand transition-colors">Critical Zones</span>
                    <div className="w-8 h-4 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center px-1">
                       <div className="w-2 h-2 rounded-full bg-rose-500" />
                    </div>
                 </div>
                 <div className="flex items-center justify-between group cursor-pointer">
                    <span className="text-[10px] font-bold text-white group-hover:text-brand transition-colors">Response Units</span>
                    <div className="w-8 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-end px-1">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-10 right-10 z-[1000] p-6 glass rounded-[2.5rem] w-80 border border-white/10 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Navigation size={16} className="text-brand" />
              <span>Map Key</span>
            </h3>
            <Info size={14} className="text-zinc-600" />
          </div>
          <div className="space-y-3">
             <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
               <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                  <div>
                    <p className="text-[10px] text-white font-black uppercase tracking-widest leading-none">Critical</p>
                    <p className="text-[10px] text-zinc-500 font-medium mt-1">Requires immediate response</p>
                  </div>
               </div>
             </div>
             <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
               <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                  <div>
                    <p className="text-[10px] text-white font-black uppercase tracking-widest leading-none">High Priority</p>
                    <p className="text-[10px] text-zinc-500 font-medium mt-1">Scheduled for dispatch</p>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

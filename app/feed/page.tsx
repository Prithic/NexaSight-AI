"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Image as ImageIcon,
  CheckCircle2,
  Filter,
  Search,
  Loader2
} from "lucide-react";

export default function FeedPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

    // Real-time subscription
    const channel = supabase
      .channel("realtime_reports")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reports" }, (payload) => {
        setReports((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-white">Incident Feed</h2>
          <p className="text-zinc-500 font-medium text-lg">Real-time stream of city-wide reports and AI diagnostics.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              className="pl-12 pr-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white outline-none focus:border-brand/50 transition-all w-64"
            />
          </div>
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-brand" size={40} />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Accessing Database...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-20 rounded-[2.5rem] glass border border-dashed border-white/10 text-center space-y-4">
            <AlertCircle size={48} className="mx-auto text-zinc-700" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">No Incidents Found</h3>
              <p className="text-zinc-500">The city is currently quiet. All systems are green.</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {reports.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
                
                <div className="p-8 rounded-[2rem] glass border border-white/5 group-hover:border-white/10 transition-all relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                    {/* Visual Evidence Placeholder */}
                    <div className="w-full lg:w-48 h-48 lg:h-32 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-zinc-800 transition-colors">
                      <ImageIcon size={32} className="text-zinc-700 group-hover:text-brand transition-colors" strokeWidth={1.5} />
                      <span className="text-[10px] mt-2 font-black uppercase tracking-widest text-zinc-600">No Image</span>
                      {item.severity_level === 'Critical' && (
                        <div className="absolute inset-0 bg-rose-500/5 animate-pulse-soft" />
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-2xl font-black text-white group-hover:text-brand transition-colors leading-none">
                              {item.type}
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                              #{item.id.toString().slice(-4)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm font-semibold text-zinc-400">
                            <div className="flex items-center space-x-1.5">
                              <MapPin size={14} className="text-brand" />
                              <span>{item.location_name || "Unknown Location"}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <Clock size={14} />
                              <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                            item.severity_level === 'Critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                            item.severity_level === 'High' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            'bg-brand/10 text-brand border-brand/20'
                          }`}>
                            {item.severity_level}
                          </span>
                          <div className="flex items-center space-x-1.5">
                             <div className={`w-2 h-2 rounded-full ${
                               item.status === 'Resolved' ? 'bg-emerald-500' : 
                               item.status === 'Dispatched' ? 'bg-brand shadow-[0_0_8px_rgba(56,189,248,0.4)]' : 'bg-amber-500'
                             }`} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.status}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-zinc-300 text-lg leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all">
                        {item.description}
                      </p>

                      <div className="pt-4 flex items-center justify-between border-t border-white/5">
                        <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest">
                          <button className="flex items-center space-x-2 text-brand hover:text-white transition-colors">
                            <ExternalLink size={14} />
                            <span>View Full Diagnostics</span>
                          </button>
                          <button className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors">
                            <CheckCircle2 size={14} />
                            <span>Mark as Resolved</span>
                          </button>
                        </div>
                        
                        {item.status === 'Resolved' && (
                          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                             <CheckCircle2 size={14} />
                             <span>Verified By AI</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && reports.length > 0 && (
        <button className="w-full py-6 rounded-3xl border border-white/10 text-xs font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-zinc-500 hover:text-white">
          Load Historical Data
        </button>
      )}
    </div>
  );
}

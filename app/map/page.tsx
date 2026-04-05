"use client";

import dynamic from "next/dynamic";
import { AlertTriangle, Loader2 } from "lucide-react";

// Dynamically import the entire Map component to avoid SSR and Type issues
const RealTimeMap = dynamic(
  () => import("@/components/RealTimeMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-3xl animate-pulse">
        <Loader2 className="animate-spin text-brand" size={40} />
      </div>
    )
  }
);

const sampleReports = [
  { id: 1, type: "Pothole", severity: "High", lat: 51.505, lng: -0.09, desc: "Large pothole in middle of lane." },
  { id: 2, type: "Illegal Dumping", severity: "Critical", lat: 51.51, lng: -0.1, desc: "Hazardous waste dumped near residential area." },
  { id: 3, type: "Water Leakage", severity: "Medium", lat: 51.515, lng: -0.08, desc: "Main pipe leaking for 2 days." },
];

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Interactive Live Map</h2>
          <p className="text-muted-foreground">Real-time visualization of city incidents and severity hotzones.</p>
        </div>
        <div className="flex items-center space-x-2 glass px-4 py-2 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Critical</span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-[10px]">High</span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Fixed</span>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-3xl overflow-hidden glass border border-white/10 relative">
        <RealTimeMap reports={sampleReports} />

        {/* Legend Overlay */}
        <div className="absolute bottom-6 left-6 z-[1000] p-4 glass rounded-2xl w-64">
          <h3 className="text-sm font-bold mb-3 flex items-center space-x-2">
            <AlertTriangle size={16} className="text-brand" />
            <span>Map Insights</span>
          </h3>
          <div className="space-y-3">
             <div className="p-2 rounded-lg bg-white/5 border border-white/10">
               <p className="text-[10px] text-muted-foreground font-bold uppercase">Trending Zone</p>
               <p className="text-xs font-medium">Sector 7 Central - Rising reports</p>
             </div>
             <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
               <p className="text-[10px] text-emerald-400 font-bold uppercase">Target Achieved</p>
               <p className="text-xs font-medium text-emerald-400">West Valley Potholes - 100% Fixed</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { 
  AlertCircle, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";

const feedItems = [
  {
    id: "R-8234",
    type: "Illegal Dumping",
    location: "Old Quarter, Street 12",
    time: "2 minutes ago",
    severity: "Critical",
    description: "Hazardous waste found near public park entrance.",
    status: "Pending"
  },
  {
    id: "R-8233",
    type: "Water Leakage",
    location: "West Valley Main Rd",
    time: "15 minutes ago",
    severity: "Medium",
    description: "Large pipe burst, water flooding the sidewalk.",
    status: "Dispatched"
  },
  {
    id: "R-8232",
    type: "Pothole",
    location: "Sector 7, Lane B",
    time: "45 minutes ago",
    severity: "High",
    description: "Deep pothole causing traffic slowdowns.",
    status: "Resolved"
  },
  {
    id: "R-8231",
    type: "Broken Streetlight",
    location: "Downtown Core, Plaza",
    time: "1 hour ago",
    severity: "Low",
    description: "Three lights are out in the south plaza area.",
    status: "Pending"
  }
];

export default function FeedPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Real-time Incident Feed</h2>
          <p className="text-muted-foreground">Live stream of city-wide reports and AI diagnostics.</p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-brand/20 flex items-center justify-center text-[10px] font-bold">
              U{i}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
            +42
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {feedItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl glass glass-hover relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 flex flex-col items-end space-y-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                item.severity === 'Critical' ? 'bg-rose-500/20 text-rose-500' : 
                item.severity === 'High' ? 'bg-amber-500/20 text-amber-500' : 'bg-brand/20 text-brand'
              }`}>
                {item.severity}
              </span>
              <div className="flex items-center space-x-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                <Clock size={12} />
                <span>{item.time}</span>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 rounded-xl bg-white/5 flex flex-col items-center justify-center text-muted-foreground group-hover:bg-white/10 transition-colors">
                <ImageIcon size={24} />
                <span className="text-[10px] mt-2 font-bold uppercase">Evidence</span>
              </div>
              
              <div className="flex-1 space-y-2 pt-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold">{item.type}</h3>
                  <span className="text-xs text-muted-foreground opacity-50">#{item.id}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} className="text-brand" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'Resolved' ? 'bg-emerald-500' : 
                      item.status === 'Dispatched' ? 'bg-brand' : 'bg-amber-500'
                    }`} />
                    <span>{item.status}</span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed max-w-xl line-clamp-1 group-hover:line-clamp-none transition-all">
                  {item.description}
                </p>

                <div className="pt-2 flex items-center space-x-4">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-brand flex items-center space-x-1 hover:underline">
                    <ExternalLink size={12} />
                    <span>Details</span>
                  </button>
                  {item.status === 'Resolved' && (
                    <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                      <CheckCircle2 size={12} />
                      <span>Verified Fix</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full py-4 rounded-2xl border border-white/5 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-muted-foreground">
        Load Previous Reports
      </button>
    </div>
  );
}

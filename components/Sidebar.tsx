"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Map, FilePlus, Bell, User, Settings, Shield } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Live Map", icon: Map },
  { href: "/report", label: "Submit Report", icon: FilePlus },
  { href: "/feed", label: "Real-time Feed", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 glass border-r hidden md:flex flex-col fixed h-full z-50">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
            <Shield className="text-white" size={18} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            NexaSight AI
          </h1>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-brand/60 px-1">
          Civic Intelligence
        </p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`relative flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? "text-white bg-white/5" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-brand rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon 
                size={22} 
                className={`transition-colors ${isActive ? "text-brand" : "group-hover:text-brand"}`} 
              />
              <span className="font-semibold text-sm tracking-tight">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="p-4 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 group cursor-pointer hover:border-white/10 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand border border-brand/20">
                <User size={20} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Administrator</p>
              <p className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-wider">Super User</p>
            </div>
            <Settings size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </div>
        </div>
      </div>
    </aside>
  );
}

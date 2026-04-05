import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, Map, FilePlus, Bell, User, Settings } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexaSight AI | Civic Intelligence Platform",
  description: "Real-time AI-powered civic intelligence and prediction platform for smart cities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 glass border-r hidden md:flex flex-col fixed h-full z-50">
            <div className="p-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                NexaSight AI
              </h1>
            </div>
            
            <nav className="flex-1 px-4 space-y-2 mt-4">
              <Link href="/" className="flex items-center space-x-3 p-3 rounded-xl glass-hover text-brand">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <Link href="/map" className="flex items-center space-x-3 p-3 rounded-xl glass-hover text-muted-foreground hover:text-foreground">
                <Map size={20} />
                <span>Live Map</span>
              </Link>
              <Link href="/report" className="flex items-center space-x-3 p-3 rounded-xl glass-hover text-muted-foreground hover:text-foreground">
                <FilePlus size={20} />
                <span>Submit Report</span>
              </Link>
              <Link href="/feed" className="flex items-center space-x-3 p-3 rounded-xl glass-hover text-muted-foreground hover:text-foreground">
                <Bell size={20} />
                <span>Real-time Feed</span>
              </Link>
            </nav>

            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-3 p-3 rounded-xl glass-hover cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand">
                  <User size={20} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">Founder Engineer</p>
                  <p className="text-xs text-muted-foreground truncate">admin@nexasight.ai</p>
                </div>
                <Settings size={16} className="text-muted-foreground" />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 md:ml-64 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

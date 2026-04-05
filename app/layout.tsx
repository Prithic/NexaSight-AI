import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

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
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 md:ml-72 bg-transparent relative z-0 min-h-screen">
            <div className="p-8 pb-32">
              {children}
            </div>
            
            {/* Background Aura */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] -z-10 rounded-full" />
            <div className="fixed bottom-0 left-72 w-[300px] h-[300px] bg-accent/5 blur-[100px] -z-10 rounded-full" />
          </main>
        </div>
      </body>
    </html>
  );
}

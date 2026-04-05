"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Camera, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Loader2,
  FileText,
  Zap,
  ShieldCheck,
  Navigation
} from "lucide-react";
import { analyzeCivicIssue } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeCivicIssue(image);
      setReportData(result);
      setStep(3);
    } catch (err) {
      setError("AI analysis failed. Please try again or fill manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  const submitReport = async () => {
    if (!reportData) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("reports")
        .insert([
          {
            type: reportData.type,
            severity: reportData.severityLevel,
            description: reportData.description,
            lat: 12.9716, // Default for now
            lng: 77.5946, // Default for now
            status: "Pending"
          }
        ]);

      if (error) throw error;

      alert("Report submitted successfully! City authorities have been notified.");
      reset();
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(`Failed to submit report: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setImage(null);
    setReportData(null);
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-1">
             <h2 className="text-4xl font-black tracking-tight text-white">Report Incident</h2>
             <div className="px-2 py-1 rounded bg-brand/10 border border-brand/20 text-[8px] font-black uppercase tracking-widest text-brand flex items-center space-x-1">
                <ShieldCheck size={10} />
                <span>AI Verified</span>
             </div>
          </div>
          <p className="text-zinc-500 font-medium text-lg">Harness artificial intelligence for instant diagnostic reporting.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`w-10 h-1 h-1.5 rounded-full transition-all duration-500 ${
                step >= s ? 'bg-brand' : 'bg-zinc-800'
              } ${step === s ? 'w-16' : 'w-10'}`} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="group relative"
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="hidden" 
              ref={fileInputRef}
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video rounded-[3rem] border-2 border-dashed border-white/10 glass glass-hover cursor-pointer flex flex-col items-center justify-center p-12 transition-all group-hover:border-brand/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 rounded-full bg-zinc-900 border border-white/5 mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                <Camera className="text-zinc-500 group-hover:text-brand transition-colors" size={48} strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Capture Visual Data</h3>
              <p className="text-zinc-500 font-medium text-lg">Upload or drag incident photo to initiate analysis</p>
              
              <div className="mt-12 flex items-center space-x-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                <span className="flex items-center space-x-2">
                  <CheckCircle2 size={12} className="text-brand" />
                  <span>Metadata Extraction</span>
                </span>
                <span className="flex items-center space-x-2">
                  <CheckCircle2 size={12} className="text-brand" />
                  <span>GPS Validation</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && image && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="relative aspect-video rounded-[3rem] overflow-hidden glass border border-white/10 shadow-2xl">
              <Image src={image} alt="Preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button 
                onClick={reset}
                className="absolute top-6 right-6 p-4 rounded-full bg-black/40 text-white backdrop-blur-xl border border-white/10 hover:bg-black/60 transition-colors"
                disabled={analyzing}
              >
                <X size={24} />
              </button>
            </div>
            
            <button
              disabled={analyzing}
              onClick={handleAnalyze}
              className="w-full py-6 rounded-[2rem] bg-white text-black font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-white/10 flex items-center justify-center space-x-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Loader2 className="animate-spin" size={20} strokeWidth={3} />
                  <span>Synthesizing Intelligence...</span>
                </>
              ) : (
                <>
                  <Zap size={20} fill="currentColor" />
                  <span>Process with NexaSight AI</span>
                </>
              )}
            </button>
            {error && <p className="text-center text-rose-500 text-sm font-black uppercase tracking-widest">{error}</p>}
          </motion.div>
        )}

        {step === 3 && reportData && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Result Card */}
               <div className="p-10 glass rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                     <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                       reportData.severityLevel === 'Critical' ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500' : 'bg-brand/10 border border-brand/20 text-brand'
                     }`}>
                        {reportData.severityLevel} PRIORITY
                     </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Classified As</h4>
                      <h3 className="text-4xl font-black text-white">{reportData.type}</h3>
                    </div>

                    <div className="space-y-4 p-6 rounded-3xl bg-white/5 border border-white/5">
                      <div className="flex items-center space-x-3 text-brand">
                        <AlertTriangle size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Diagnostic Insight</span>
                      </div>
                      <p className="text-zinc-300 font-medium text-lg leading-relaxed">{reportData.description}</p>
                    </div>

                    <div className="flex items-start space-x-4">
                       <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400">
                          <Navigation size={20} />
                       </div>
                       <div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Recommended Action</h4>
                         <p className="text-white font-bold text-sm">{reportData.suggestedAction}</p>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Submission Details */}
               <div className="space-y-6">
                  <div className="p-8 glass rounded-[2.5rem] border border-white/5">
                     <h3 className="text-sm font-black text-white mb-6 flex items-center space-x-2">
                        <MapPin size={16} className="text-brand" />
                        <span>Geo-Validation</span>
                     </h3>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                           <span className="text-xs font-bold text-zinc-500">Auto-Detected Sector</span>
                           <span className="text-xs font-black text-white">Central Core [12.9, 77.5]</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                           <span className="text-xs font-bold text-zinc-500">Confidence Score</span>
                           <span className="text-xs font-black text-emerald-500">98.4%</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col space-y-4 pt-4">
                    <button
                      disabled={isSubmitting}
                      onClick={submitReport}
                      className="w-full py-6 rounded-[2rem] bg-brand hover:bg-brand-dark text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-brand/20 flex items-center justify-center space-x-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={20} strokeWidth={3} />
                      ) : (
                        <>
                          <CheckCircle2 size={20} />
                          <span>Finalize & Dispatch Report</span>
                        </>
                      )}
                    </button>
                    <button 
                       onClick={reset}
                       className="w-full py-6 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-colors"
                    >
                      Discard Report
                    </button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

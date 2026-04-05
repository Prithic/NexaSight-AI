"use client";

import { useState, useRef } from "react";
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
  Send
} from "lucide-react";
import { analyzeCivicIssue } from "@/lib/gemini";
import Image from "next/image";

interface AnalysisResult {
  type: string;
  severityScore: number;
  severityLevel: string;
  description: string;
  suggestedAction: string;
}

export default function ReportPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [step, setStep] = useState(1);
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
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeCivicIssue(image);
      setResult(analysis);
      setStep(3);
    } catch (error) {
      alert("Failed to analyze image. Please ensure your API key is configured.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-2xl bg-brand/10 text-brand">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Submit Civic Report</h2>
          <p className="text-muted-foreground">Capture and analyze real-world issues with AI intelligence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Progress Steps */}
        <div className="md:col-span-1 space-y-4">
          {[
            { id: 1, label: "Evidence Capture", desc: "Upload or take a photo" },
            { id: 2, label: "AI Diagnostic", desc: "Intelligent processing" },
            { id: 3, label: "Review & Submit", desc: "Final verification" },
          ].map((item) => (
            <div 
              key={item.id} 
              className={`p-4 rounded-2xl border transition-all ${
                step === item.id 
                  ? "bg-brand/5 border-brand/20" 
                  : step > item.id ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/5 border-white/5"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step >= item.id ? "bg-brand text-white" : "bg-white/10 text-muted-foreground"
                }`}>
                  {step > item.id ? <CheckCircle2 size={14} /> : item.id}
                </div>
                <span className={`text-sm font-bold ${step === item.id ? "text-brand" : ""}`}>{item.label}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-9">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Right: Interaction Area */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="group relative h-[400px] rounded-3xl border-2 border-dashed border-white/10 glass flex flex-col items-center justify-center cursor-pointer hover:border-brand/40 transition-colors overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-6 rounded-full bg-brand/10 text-brand group-hover:scale-110 transition-transform">
                  <Camera size={40} />
                </div>
                <h3 className="text-xl font-bold mt-6">Upload Evidence</h3>
                <p className="text-muted-foreground text-sm mt-2">Take a photo or drag & drop</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </motion.div>
            )}

            {step === 2 && image && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden glass">
                  <Image src={image} alt="Preview" fill className="object-cover" />
                  <button 
                    onClick={reset}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <button
                  disabled={isAnalyzing}
                  onClick={handleAnalyze}
                  className="w-full py-4 rounded-2xl bg-brand hover:bg-brand-dark text-white font-bold text-lg shadow-xl shadow-brand/20 flex items-center justify-center space-x-3 transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>AI Engine Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={24} />
                      <span>Analyze with NexaSight AI</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {step === 3 && result && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="p-8 rounded-3xl glass space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        result.severityLevel === 'Critical' ? 'bg-rose-500/20 text-rose-500' : 'bg-brand/20 text-brand'
                      }`}>
                        <AlertTriangle size={20} />
                      </div>
                      <span className="font-bold text-lg">{result.type}</span>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                      result.severityLevel === 'Critical' ? 'bg-rose-500' : 
                      result.severityLevel === 'High' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>
                      {result.severityLevel} PRIORITY
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</label>
                      <p className="mt-1 text-lg leading-relaxed">{result.description}</p>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <label className="text-[10px] font-bold text-brand uppercase tracking-widest">AI Suggested Action</label>
                      <p className="mt-1 text-sm">{result.suggestedAction}</p>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <MapPin size={20} />
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase">Location Metadata</p>
                        <p className="text-sm">Auto-detected: Sector 7, Downtown Core</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button 
                    onClick={reset}
                    className="flex-1 py-4 rounded-2xl glass glass-hover text-sm font-bold uppercase tracking-widest transition-all"
                  >
                    Retake
                  </button>
                  <button className="flex-[2] py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-3 transition-all">
                    <Send size={24} />
                    <span>Submit & Track</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  ArrowRight, 
  Search, 
  Image as ImageIcon, 
  Workflow, 
  Upload, 
  Cpu, 
  BarChart3,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Header } from './Header';
import { ViewMode } from '../types';

interface LandingViewProps {
  onNavigate: (mode: ViewMode) => void;
  onOpenSampleReport: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenSampleReport }) => {
  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col font-body">
      <Header onNavigate={onNavigate} />

      <main className="flex-grow flex flex-col items-center w-full pb-20">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-20 pt-16 lg:pt-24 pb-20 flex flex-col items-center text-center relative overflow-hidden">
          {/* Glowing gradient backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#8083ff]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

          {/* New Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#222a3d] border border-[#334155] mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
            <span className="font-mono text-xs text-[#c7c4d7] uppercase tracking-wider font-medium">
              NEW: DEEPFAKE IMAGE DETECTION V2
            </span>
          </div>

          {/* Display Headline */}
          <h1 className="font-headline font-bold text-4xl sm:text-6xl lg:text-7xl text-[#dae2fd] mb-6 max-w-4xl mx-auto leading-[1.1] tracking-tight">
            Detect with <span className="ai-gradient-text">Truvix</span>.<br />
            Protect the Authentic.
          </h1>

          <p className="text-base sm:text-lg text-[#c7c4d7] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Advanced forensic analysis for modern digital media. Identify AI-generated text, altered imagery, and synthetic audio with clinical precision and real-time probability scoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
            <button 
              onClick={() => onNavigate('text-scan')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#8083ff] to-[#6f00be] text-white px-8 py-4 rounded-xl font-semibold text-base hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Start Analyzing</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={onOpenSampleReport}
              className="w-full sm:w-auto bg-transparent border border-[#334155] text-[#dae2fd] hover:text-white px-8 py-4 rounded-xl font-medium text-base hover:bg-[#222a3d] transition-colors"
            >
              View Sample Report
            </button>
          </div>

          {/* Interactive Dashboard UI Preview Banner */}
          <div 
            onClick={onOpenSampleReport}
            className="mt-16 w-full max-w-5xl rounded-2xl border border-[#334155] bg-[#1e293b] p-3 shadow-2xl relative group cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b1326] z-10 pointer-events-none" />
            
            {/* Interactive Preview Overlay Bar */}
            <div className="absolute top-6 right-6 z-20 bg-[#060e20]/90 border border-[#8083ff]/40 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-mono text-[#c0c1ff] flex items-center gap-2 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
              <span>Click to open interactive sample analysis</span>
            </div>

            {/* Inner Graphic Mockup of Detector Dashboard */}
            <div className="w-full h-auto rounded-xl bg-[#0b1326] border border-[#334155]/60 p-6 sm:p-8 text-left grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column Gauge */}
              <div className="lg:col-span-4 bg-[#131b2e] p-6 rounded-xl border border-[#334155]/40 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-xs text-[#908fa0] uppercase tracking-wider mb-2">Confidence Overview</span>
                <div className="relative w-36 h-36 flex items-center justify-center my-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#222a3d" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="251" strokeDashoffset="5" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline font-bold text-3xl text-white">98<span className="text-sm">%</span></span>
                    <span className="font-mono text-[10px] text-[#8b5cf6] uppercase">AI Probability</span>
                  </div>
                </div>
                <div className="w-full space-y-1.5 font-mono text-xs text-[#c7c4d7] border-t border-[#334155]/40 pt-3 mt-2">
                  <div className="flex justify-between"><span>Confidence Score:</span><span className="text-[#8083ff]">98.4%</span></div>
                  <div className="flex justify-between"><span>Certainty:</span><span className="text-[#10b981]">Very High</span></div>
                  <div className="flex justify-between"><span>Analysis Depth:</span><span>78%</span></div>
                </div>
              </div>

              {/* Right Column Analysis Text Snippet */}
              <div className="lg:col-span-8 bg-[#131b2e] p-6 rounded-xl border border-[#334155]/40 flex flex-col">
                <div className="flex items-center justify-between border-b border-[#334155]/40 pb-3 mb-4">
                  <span className="font-mono text-xs text-[#8083ff] font-semibold">Text Analysis Module</span>
                  <span className="text-xs text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded font-mono">Scan Completed</span>
                </div>
                <p className="text-sm text-[#dae2fd] leading-relaxed mb-4">
                  The rapid advancements in large language models (LLMs) have significantly transformed content creation. While offering numerous benefits, <span className="bg-[#8b5cf6]/20 border-l-2 border-[#8b5cf6] px-1 text-white">the proliferation of AI-generated text presents challenges</span> related to academic integrity, misinformation, and authenticity. AURA DETECTION provides a robust solution to verify origin.
                </p>
                <div className="mt-auto grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs bg-[#0b1326] p-3 rounded-lg border border-[#334155]/30">
                  <div>
                    <span className="text-[#908fa0] block">Perplexity</span>
                    <span className="text-white font-semibold">35.9 Low</span>
                  </div>
                  <div>
                    <span className="text-[#908fa0] block">Burstiness</span>
                    <span className="text-white font-semibold">1.2 Low</span>
                  </div>
                  <div>
                    <span className="text-[#908fa0] block">Predicted Source</span>
                    <span className="text-[#c0c1ff] font-semibold">GPT-4 / Claude 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-20 py-16" id="features">
          <div className="mb-12 text-left">
            <h2 className="font-headline font-bold text-2xl lg:text-3xl text-white mb-2">Forensic Toolkit</h2>
            <p className="text-sm lg:text-base text-[#c7c4d7] max-w-xl">
              Comprehensive analytical models designed to dissect and verify the origin of any digital asset.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento 1: Text Analysis */}
            <div className="md:col-span-8 bg-[#1e293b] rounded-2xl border border-[#334155] p-8 flex flex-col bento-card relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <span className="font-mono text-xs text-[#908fa0] uppercase tracking-widest block mb-2">Text Analysis</span>
                  <h3 className="font-headline font-semibold text-xl text-white mb-2">Linguistic Pattern Recognition</h3>
                  <p className="text-sm text-[#c7c4d7] max-w-md">
                    Detect LLM structural signatures, perplexity anomalies, and burstiness patterns in written content.
                  </p>
                </div>
                <div className="p-3 bg-[#171f33] rounded-xl border border-[#334155]/60 text-[#8083ff]">
                  <Search className="w-6 h-6" />
                </div>
              </div>

              <div className="mt-auto bg-[#0b1326] border border-[#334155] rounded-xl p-4 text-xs lg:text-sm text-[#c7c4d7] space-y-2 relative z-10">
                <p>
                  The system utilizes advanced <span className="bg-[#8b5cf6]/20 border-l-2 border-[#8b5cf6] px-1.5 py-0.5 text-white font-medium">natural language processing</span> to evaluate syntax.
                </p>
                <p>
                  Human text often exhibits <span className="bg-[#10b981]/20 border-l-2 border-[#10b981] px-1.5 py-0.5 text-white font-medium">higher variance in sentence structure</span> compared to synthetic generation.
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Bento 2: Confidence Scoring Ring */}
            <div className="md:col-span-4 bg-[#1e293b] rounded-2xl border border-[#334155] p-8 flex flex-col items-center justify-center text-center bento-card">
              <span className="font-mono text-xs text-[#908fa0] uppercase tracking-widest mb-2 w-full text-left">Confidence Scoring</span>
              <div className="relative w-36 h-36 flex items-center justify-center my-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#2d3449" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="264" strokeDashoffset="40" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline font-bold text-4xl text-white">85<span className="text-xl">%</span></span>
                  <span className="font-mono text-[10px] text-[#8b5cf6] uppercase tracking-wider font-semibold">AI Generated</span>
                </div>
              </div>
              <p className="text-xs text-[#c7c4d7] mt-2">
                Granular probability metrics calibrated across 12 distinct analytical models.
              </p>
            </div>

            {/* Bento 3: Visual Forensic Noise Map */}
            <div className="md:col-span-6 bg-[#1e293b] rounded-2xl border border-[#334155] p-8 flex flex-col bento-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-mono text-xs text-[#908fa0] uppercase tracking-widest block mb-2">Visual Forensic</span>
                  <h3 className="font-headline font-semibold text-xl text-white mb-2">Noise Map Extraction</h3>
                </div>
                <div className="p-3 bg-[#171f33] rounded-xl border border-[#334155]/60 text-[#89ceff]">
                  <ImageIcon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs lg:text-sm text-[#c7c4d7] mb-6">
                Identify generative artifacts, blending errors, and inconsistent light noise patterns invisible to the human eye.
              </p>
              <div className="mt-auto h-28 rounded-xl bg-[#0b1326] border border-[#334155] overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8083ff]/10 via-[#009ada]/20 to-transparent" />
                <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-[#009ada] shadow-[0_0_12px_#009ada]" />
                <span className="font-mono text-xs text-[#89ceff] z-10 bg-[#060e20]/80 px-3 py-1 rounded-full border border-[#009ada]/40">
                  Forensic Heatmap Active
                </span>
              </div>
            </div>

            {/* Bento 4: High-Volume Pipeline */}
            <div className="md:col-span-6 bg-[#1e293b] rounded-2xl border border-[#334155] p-8 flex flex-col bento-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-mono text-xs text-[#908fa0] uppercase tracking-widest block mb-2">Enterprise Scale</span>
                  <h3 className="font-headline font-semibold text-xl text-white mb-2">High-Volume Pipeline</h3>
                </div>
                <div className="p-3 bg-[#171f33] rounded-xl border border-[#334155]/60 text-[#ddb7ff]">
                  <Workflow className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs lg:text-sm text-[#c7c4d7] mb-6">
                Process thousands of documents or images concurrently via robust API endpoints designed for automated moderation flows.
              </p>
              <div className="mt-auto space-y-2 bg-[#0b1326] p-4 rounded-xl border border-[#334155]">
                <div className="w-full bg-[#222a3d] rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#8083ff] to-[#ddb7ff] h-full w-[88%] rounded-full" />
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#908fa0]">Processing Queue</span>
                  <span className="text-white font-semibold">12,450 / hr</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Pipeline Section */}
        <section className="w-full max-w-5xl mx-auto px-6 lg:px-20 py-16">
          <div className="text-center mb-16">
            <h2 className="font-headline font-bold text-2xl lg:text-3xl text-white mb-3">The Analysis Pipeline</h2>
            <p className="text-sm lg:text-base text-[#c7c4d7] max-w-xl mx-auto">
              From raw input to definitive forensic report in milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line on desktop */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-[#334155] -z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#171f33] border border-[#334155] flex items-center justify-center mb-6 shadow-lg shadow-[#0b1326] relative">
                <Upload className="w-7 h-7 text-[#8083ff]" />
                <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-[#0b1326] border border-[#334155] flex items-center justify-center font-mono text-[11px] font-bold text-white">
                  1
                </div>
              </div>
              <h4 className="font-headline font-semibold text-lg text-white mb-2">Ingestion</h4>
              <p className="text-xs text-[#c7c4d7] max-w-[220px]">
                Upload text, document, or image payload via UI or secure REST API.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#171f33] border border-[#334155] flex items-center justify-center mb-6 shadow-lg shadow-[#0b1326] relative">
                <Cpu className="w-7 h-7 text-[#009ada]" />
                <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-[#0b1326] border border-[#334155] flex items-center justify-center font-mono text-[11px] font-bold text-white">
                  2
                </div>
              </div>
              <h4 className="font-headline font-semibold text-lg text-white mb-2">Multi-Model Scan</h4>
              <p className="text-xs text-[#c7c4d7] max-w-[220px]">
                Data is fragmented and analyzed concurrently across specialized neural networks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#8083ff] border border-[#8083ff] flex items-center justify-center mb-6 shadow-lg shadow-[#8083ff]/30 relative">
                <BarChart3 className="w-7 h-7 text-[#0d0096]" />
                <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-[#0b1326] border border-[#334155] flex items-center justify-center font-mono text-[11px] font-bold text-white">
                  3
                </div>
              </div>
              <h4 className="font-headline font-semibold text-lg text-white mb-2">Forensic Output</h4>
              <p className="text-xs text-[#c7c4d7] max-w-[220px]">
                Receive a deterministic probability score alongside highlighted evidentiary data.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#060e20] border-t border-[#334155]/30 flex flex-col md:flex-row justify-between items-center px-6 lg:px-20 py-8 w-full gap-4 text-xs text-[#908fa0]">
        <div className="flex items-center gap-3">
          <span className="font-headline font-bold text-sm text-white">Truvix AI</span>
          <span>|</span>
          <span>&copy; {new Date().getFullYear()} Truvix AI Detector. Precision in every pixel.</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">API Documentation</button>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </nav>
      </footer>
    </div>
  );
};

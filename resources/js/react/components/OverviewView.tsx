import React from 'react';
import { 
  Zap, 
  CheckCircle2, 
  FileText, 
  Image as ImageIcon, 
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { UserCredits, ViewMode } from '../types';

interface OverviewViewProps {
  credits: UserCredits;
  onNavigate: (mode: ViewMode) => void;
  onSubscribe: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ credits, onNavigate, onSubscribe }) => {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#334155]/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline text-white tracking-tight">Usage Dashboard</h1>
          <p className="text-sm text-[#c7c4d7] mt-1">Track your analysis credits and plan limits.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#131b2e] border border-[#334155] px-4 py-2 rounded-xl text-xs font-mono text-[#c0c1ff] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8083ff]" />
            <span>{credits.used}/{credits.max} Credits Used</span>
          </div>
          <button
            onClick={() => onNavigate('text-scan')}
            className="bg-[#8083ff] hover:bg-[#9193ff] text-[#0d0096] font-semibold px-4 py-2 rounded-xl text-xs font-mono transition-all glow-button flex items-center gap-1"
          >
            <span>+ Scan Text</span>
          </button>
        </div>
      </div>

      {/* Top Row: Current Usage & Pro Upgrade Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Cycle Usage Card */}
        <div className="lg:col-span-7 bg-[#1e293b] rounded-2xl border border-[#334155] p-8 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="font-mono text-xs text-[#908fa0] uppercase tracking-widest mb-4">
              CURRENT CYCLE USAGE
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline font-bold text-5xl text-white">{credits.used}</span>
              <span className="font-headline font-medium text-2xl text-[#908fa0]">/ {credits.max} Credits Used</span>
            </div>
            <p className="text-sm text-[#c7c4d7] max-w-md mt-2">
              Your {credits.isPro ? 'Pro' : 'Free'} plan includes {credits.max} advanced forensic scans per cycle. Resets in 12 days.
            </p>
          </div>

          <div className="mt-8 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#908fa0]">Plan Utilization</span>
              <span className="text-[#8083ff] font-semibold">{Math.round((credits.used / credits.max) * 100)}% UTILIZED</span>
            </div>
            <div className="w-full bg-[#0b1326] rounded-full h-3 overflow-hidden p-0.5 border border-[#334155]">
              <div 
                className="bg-gradient-to-r from-[#8083ff] to-[#6f00be] h-full rounded-full transition-all duration-700"
                style={{ width: `${(credits.used / credits.max) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Upgrade to Pro Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#171f33] via-[#1e293b] to-[#222a3d] rounded-2xl border border-[#8083ff]/40 p-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#8b5cf6]/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] font-mono text-[11px] font-semibold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5 fill-[#f59e0b]" />
              UPGRADE TO PRO
            </div>

            <h3 className="font-headline font-bold text-2xl text-white mb-4">
              Unlock Unlimited Scans
            </h3>

            <ul className="space-y-2.5 text-xs text-[#dae2fd] mb-6 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                <span>Unlimited Text & Image Forensics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                <span>Priority Processing Queue & Heatmaps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                <span>Advanced API Access & PDF Exports</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onSubscribe}
            className="w-full bg-gradient-to-r from-[#8083ff] to-[#6f00be] hover:from-[#9193ff] hover:to-[#820cd6] text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-[#8083ff]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{credits.isPro ? 'Manage Subscription' : 'Subscribe Now'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Lifetime Analytics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Scan Lifetime Card */}
        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#334155]/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#171f33] rounded-xl text-[#8083ff] border border-[#334155]/60">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs text-[#908fa0] uppercase tracking-wider font-semibold">
                AI TEXT SCAN
              </span>
            </div>
            <span className="font-mono text-xs bg-[#131b2e] px-2.5 py-1 rounded-md text-[#c7c4d7] border border-[#334155]">
              LIFETIME
            </span>
          </div>

          <div>
            <div className="font-headline font-bold text-4xl text-white mb-1">
              {credits.totalDocuments}
            </div>
            <div className="text-xs text-[#908fa0]">Documents Analyzed</div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#c0c1ff] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                  AI Generated
                </span>
                <span className="text-white font-semibold">{credits.aiTextPercentage}%</span>
              </div>
              <div className="w-full bg-[#0b1326] rounded-full h-2 overflow-hidden">
                <div className="bg-[#8b5cf6] h-full rounded-full" style={{ width: `${credits.aiTextPercentage}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#10b981] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  Human Authored
                </span>
                <span className="text-white font-semibold">{credits.humanTextPercentage}%</span>
              </div>
              <div className="w-full bg-[#0b1326] rounded-full h-2 overflow-hidden">
                <div className="bg-[#10b981] h-full rounded-full" style={{ width: `${credits.humanTextPercentage}%` }} />
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('text-scan')}
            className="w-full text-center text-xs font-mono text-[#c0c1ff] hover:text-white pt-2 border-t border-[#334155]/40 flex items-center justify-center gap-1 group"
          >
            <span>Perform New Text Scan</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Image Forensic Lifetime Card */}
        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#334155]/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#171f33] rounded-xl text-[#009ada] border border-[#334155]/60">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs text-[#908fa0] uppercase tracking-wider font-semibold">
                IMAGE FORENSIC
              </span>
            </div>
            <span className="font-mono text-xs bg-[#131b2e] px-2.5 py-1 rounded-md text-[#c7c4d7] border border-[#334155]">
              LIFETIME
            </span>
          </div>

          <div>
            <div className="font-headline font-bold text-4xl text-white mb-1">
              {credits.totalImages}
            </div>
            <div className="text-xs text-[#908fa0]">Images Processed</div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#c0c1ff] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                  Synthetically Generated
                </span>
                <span className="text-white font-semibold">{credits.syntheticImagePercentage}%</span>
              </div>
              <div className="w-full bg-[#0b1326] rounded-full h-2 overflow-hidden">
                <div className="bg-[#8b5cf6] h-full rounded-full" style={{ width: `${credits.syntheticImagePercentage}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#10b981] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  Authentic
                </span>
                <span className="text-white font-semibold">{credits.authenticImagePercentage}%</span>
              </div>
              <div className="w-full bg-[#0b1326] rounded-full h-2 overflow-hidden">
                <div className="bg-[#10b981] h-full rounded-full" style={{ width: `${credits.authenticImagePercentage}%` }} />
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('image-forensic')}
            className="w-full text-center text-xs font-mono text-[#c0c1ff] hover:text-white pt-2 border-t border-[#334155]/40 flex items-center justify-center gap-1 group"
          >
            <span>Run Image Forensic Scan</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

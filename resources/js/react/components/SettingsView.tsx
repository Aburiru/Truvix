import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  Zap, 
  CheckCircle2, 
  Coins, 
  Sliders, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { UserCredits } from '../types';

interface SettingsViewProps {
  credits: UserCredits;
  onTopUpCredits: (amount: number) => void;
  onTogglePro: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ credits, onTopUpCredits, onTogglePro }) => {
  const [sensitivity, setSensitivity] = useState(75);
  const [autoHighlight, setAutoHighlight] = useState(true);

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Title */}
      <div className="border-b border-[#334155]/40 pb-6">
        <h1 className="text-3xl font-bold font-headline text-white tracking-tight">Settings & Plan</h1>
        <p className="text-sm text-[#c7c4d7] mt-1">Configure detection thresholds, manage credits, and API key preferences.</p>
      </div>

      {/* Plan & Credits Management */}
      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#334155]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#171f33] rounded-xl text-[#8083ff]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-semibold text-lg text-white">
                Current Subscription: {credits.isPro ? 'Pro Plan ($29/mo)' : 'Free Tier'}
              </h3>
              <p className="text-xs text-[#908fa0]">
                {credits.isPro ? 'Unlimited priority scans active' : 'Includes 5 credits per cycle'}
              </p>
            </div>
          </div>

          <button
            onClick={onTogglePro}
            className="bg-gradient-to-r from-[#8083ff] to-[#6f00be] text-white px-5 py-2.5 rounded-xl font-semibold text-xs font-mono shadow-md"
          >
            {credits.isPro ? 'Switch to Free Tier' : 'Upgrade to Pro Plan'}
          </button>
        </div>

        {/* Top-up Credits Simulator */}
        <div className="space-y-3">
          <label className="font-mono text-xs text-[#908fa0] uppercase tracking-wider block">
            Simulate Credit Top-Up (Demo)
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onTopUpCredits(5)}
              className="bg-[#131b2e] hover:bg-[#222a3d] border border-[#334155] text-[#c0c1ff] px-4 py-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5 text-[#8083ff]" />
              <span>+5 Credits</span>
            </button>
            <button
              onClick={() => onTopUpCredits(25)}
              className="bg-[#131b2e] hover:bg-[#222a3d] border border-[#334155] text-[#c0c1ff] px-4 py-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5 text-[#8083ff]" />
              <span>+25 Credits</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detection Threshold Customization */}
      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-[#334155]/40 pb-4">
          <Sliders className="w-5 h-5 text-[#009ada]" />
          <h3 className="font-headline font-semibold text-lg text-white">Detection Thresholds</h3>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-white font-medium">AI Sensitivity Threshold</span>
              <span className="text-[#8083ff] font-bold">{sensitivity}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full accent-[#8083ff] cursor-pointer"
            />
            <p className="text-xs text-[#908fa0] mt-1">
              Higher sensitivity increases detection of subtle LLM phrasing but may increase false positives.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-sm font-medium text-white block">Auto-Highlight AI Paragraphs</span>
              <span className="text-xs text-[#908fa0]">Automatically highlight suspect sentences upon scan completion.</span>
            </div>

            <button
              onClick={() => setAutoHighlight(!autoHighlight)}
              className={`w-11 h-6 rounded-full transition-colors p-1 relative ${
                autoHighlight ? 'bg-[#8083ff]' : 'bg-[#222a3d]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoHighlight ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Gemini API Key Configuration */}
      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-[#334155]/40 pb-4">
          <Key className="w-5 h-5 text-[#10b981]" />
          <h3 className="font-headline font-semibold text-lg text-white">Server API Status</h3>
        </div>

        <p className="text-xs text-[#c7c4d7] leading-relaxed">
          Truvix AI uses Google Gemini 2.5 Flash server-side with <code className="font-mono text-[#c0c1ff]">process.env.GEMINI_API_KEY</code> for real-time deep forensic text and vision analysis.
        </p>

        <div className="p-3 bg-[#0b1326] border border-[#334155] rounded-xl flex items-center justify-between text-xs font-mono text-[#10b981]">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            <span>Gemini Forensic Engine Connected</span>
          </span>
          <span className="text-[#908fa0]">v2.5 Flash</span>
        </div>
      </div>
    </div>
  );
};

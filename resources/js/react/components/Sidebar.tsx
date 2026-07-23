import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  HelpCircle,
  Home,
  Coins
} from 'lucide-react';
import { ViewMode, UserCredits } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (mode: ViewMode) => void;
  credits: UserCredits;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, credits }) => {
  const navItems = [
    { id: 'overview' as ViewMode, label: 'Overview', icon: LayoutDashboard },
    { id: 'text-scan' as ViewMode, label: 'AI Text Scan', icon: FileText },
    { id: 'image-forensic' as ViewMode, label: 'Image Forensic', icon: ImageIcon },
  ];

  return (
    <aside className="w-64 bg-[#060e20] border-r border-[#334155]/40 flex flex-col h-screen sticky top-0 shrink-0 select-none z-40">
      {/* App Branding */}
      <div className="p-6 pb-5 border-b border-[#334155]/20 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#6f00be] flex items-center justify-center text-white shadow-lg shadow-[#8083ff]/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base text-[#dae2fd] font-headline tracking-tight leading-none">
              Truvix AI
            </h1>
            <span className="text-[11px] font-mono text-[#c7c4d7]/70 uppercase tracking-wider block mt-1">
              {credits.isPro ? 'Pro Plan' : 'Free Plan'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="px-5 py-5">
        <button
          onClick={() => onNavigate('text-scan')}
          className="w-full bg-gradient-to-r from-[#8083ff] to-[#6f00be] hover:from-[#9193ff] hover:to-[#820cd6] text-white py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#8083ff]/25 hover:shadow-[#8083ff]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Analyze New</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <button
          onClick={() => onNavigate('landing')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#c7c4d7] hover:bg-[#131b2e] hover:text-white transition-colors"
        >
          <Home className="w-4 h-4 text-[#908fa0]" />
          <span>Home Landing</span>
        </button>

        <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase tracking-widest text-[#908fa0]">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || 
            (item.id === 'text-scan' && currentView === 'text-report') ||
            (item.id === 'image-forensic' && currentView === 'image-report');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#6f00be] text-white font-semibold shadow-md shadow-[#6f00be]/30'
                  : 'text-[#c7c4d7] hover:bg-[#131b2e] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#908fa0]'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Credits Banner Widget */}
      <div className="p-4 mx-3 mb-2 rounded-xl bg-[#131b2e] border border-[#334155]/50">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-[#c7c4d7] flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#8083ff]" />
            Scans Remaining
          </span>
          <span className="text-white font-bold">{credits.max - credits.used}/{credits.max}</span>
        </div>
        <div className="w-full bg-[#0b1326] rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#8083ff] to-[#8b5cf6] h-full rounded-full transition-all duration-500"
            style={{ width: `${((credits.max - credits.used) / credits.max) * 100}%` }}
          />
        </div>
        {!credits.isPro && (
          <button 
            onClick={() => onNavigate('overview')}
            className="mt-2.5 w-full text-center text-[11px] text-[#c0c1ff] hover:text-white font-mono hover:underline block"
          >
            Upgrade to Unlimited &rarr;
          </button>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-[#334155]/30 space-y-1">
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
            currentView === 'settings' ? 'bg-[#1e293b] text-white' : 'text-[#c7c4d7] hover:bg-[#131b2e] hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 text-[#908fa0]" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => onNavigate('support')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
            currentView === 'support' ? 'bg-[#1e293b] text-white' : 'text-[#c7c4d7] hover:bg-[#131b2e] hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-[#908fa0]" />
          <span>Support</span>
        </button>
      </div>
    </aside>
  );
};

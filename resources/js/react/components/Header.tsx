import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  onNavigate: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="bg-[#0b1326]/90 backdrop-blur-xl sticky top-0 z-50 border-b border-[#464554]/30 flex justify-between items-center px-6 lg:px-20 py-4 w-full">
      <div 
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={() => onNavigate('landing')}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8083ff] to-[#6f00be] flex items-center justify-center text-white shadow-md shadow-[#8083ff]/20 group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-[#dae2fd] font-headline">
          Truvix <span className="text-[#c0c1ff]">AI</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a 
          href="#features" 
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('features');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else onNavigate('landing');
          }}
          className="text-[#c0c1ff] hover:text-white transition-colors py-1 border-b-2 border-[#c0c1ff]"
        >
          Features
        </a>
        <button 
          onClick={() => onNavigate('overview')}
          className="text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors"
        >
          Dashboard
        </button>
        <button 
          onClick={() => onNavigate('settings')}
          className="text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors"
        >
          Pricing
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => onNavigate('overview')}
          className="text-[#c7c4d7] hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors hidden md:block"
        >
          Log In
        </button>
        <button 
          onClick={() => onNavigate('overview')}
          className="bg-[#8083ff] hover:bg-[#c0c1ff] text-[#0d0096] hover:text-[#07006c] px-5 py-2 rounded-full text-sm font-semibold transition-all glow-button flex items-center gap-1.5"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  Sparkles, 
  Coins, 
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TextScanReport, ViewMode } from '../types';

interface TextReportViewProps {
  report: TextScanReport;
  onNavigate: (mode: ViewMode) => void;
  onExportPDF: () => void;
}

export const TextReportView: React.FC<TextReportViewProps> = ({ report, onNavigate, onExportPDF }) => {
  const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null);

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#334155]/40 pb-6">
        <div>
          <button 
            onClick={() => onNavigate('text-scan')} 
            className="text-xs font-mono text-[#908fa0] hover:text-white flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Text Scan</span>
          </button>
          <h1 className="text-3xl font-bold font-headline text-white tracking-tight">Text Analysis Report</h1>
          <p className="text-sm font-mono text-[#c0c1ff] mt-1 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{report.title}</span>
            <span className="text-[#908fa0]">• {report.timestamp}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#131b2e] border border-[#334155] px-3.5 py-2 rounded-xl text-xs font-mono text-[#c0c1ff] flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#8083ff]" />
            <span>3/5 Credits</span>
          </div>

          <button
            onClick={onExportPDF}
            className="bg-[#1e293b] hover:bg-[#222a3d] border border-[#334155] text-white px-4 py-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Circular AI Probability Score Card */}
        <div className="lg:col-span-4 bg-[#1e293b] rounded-2xl border border-[#334155] p-8 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="font-mono text-xs text-[#908fa0] uppercase tracking-widest mb-4 w-full text-left">
            AI PROBABILITY
          </div>

          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#222a3d" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                fill="none" 
                stroke={report.aiProbability > 50 ? '#8b5cf6' : '#10b981'} 
                strokeWidth="8" 
                strokeDasharray="264" 
                strokeDashoffset={264 - (264 * report.aiProbability) / 100} 
                className="transition-all duration-1000" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline font-bold text-4xl text-white">
                {report.aiProbability}<span className="text-xl">%</span>
              </span>
              <span className="font-mono text-[11px] text-[#c0c1ff] font-semibold uppercase mt-1">
                {report.confidenceLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Linguistic Pattern Summary */}
        <div className="lg:col-span-8 bg-[#1e293b] rounded-2xl border border-[#334155] p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="font-mono text-xs text-[#908fa0] uppercase tracking-widest mb-4">
              LINGUISTIC PATTERN SUMMARY
            </div>

            <p className="text-sm lg:text-base text-[#dae2fd] leading-relaxed font-body">
              {report.linguisticPatternSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-6 mt-6 border-t border-[#334155]/40 font-mono text-xs">
            {report.highlightedTags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/40 text-[#c0c1ff] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 space-y-2">
          <div className="font-mono text-[11px] text-[#908fa0] uppercase tracking-widest">
            PERPLEXITY SCORE
          </div>
          <div className="font-headline font-bold text-2xl text-[#8b5cf6]">
            {report.perplexityScore !== null ? report.perplexityScore.toFixed(1) : 'N/A'}
          </div>
          <p className="text-xs text-[#c7c4d7]">
            {report.perplexityDescription}
          </p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 space-y-2">
          <div className="font-mono text-[11px] text-[#908fa0] uppercase tracking-widest">
            BURSTINESS
          </div>
          <div className="font-headline font-bold text-2xl text-[#8b5cf6]">
            {report.burstiness !== null ? report.burstiness.toFixed(1) : 'N/A'}
          </div>
          <p className="text-xs text-[#c7c4d7]">
            {report.burstinessDescription}
          </p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 space-y-2">
          <div className="font-mono text-[11px] text-[#908fa0] uppercase tracking-widest">
            SENTENCE LENGTH
          </div>
          <div className="font-headline font-bold text-2xl text-[#f59e0b]">
            {report.sentenceLength}
          </div>
          <p className="text-xs text-[#c7c4d7]">
            {report.avgSentenceLength !== null ? report.avgSentenceLength.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Document View Section */}
      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#334155]/40 pb-4">
          <div className="font-mono text-xs text-[#908fa0] uppercase tracking-widest">
            DOCUMENT VIEW
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
              <span className="text-[#c0c1ff]">AI Detected</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="text-[#10b981]">Human-like</span>
            </span>
          </div>
        </div>

        {/* Highlighted Paragraph List */}
        <div className="space-y-4 font-body">
          {report.paragraphs.map((p, idx) => {
            const isSelected = selectedParagraph === idx;

            return (
              <div 
                key={idx}
                onClick={() => setSelectedParagraph(isSelected ? null : idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  p.isAi 
                    ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/30 hover:border-[#8b5cf6]' 
                    : 'bg-[#10b981]/10 border-[#10b981]/30 hover:border-[#10b981]'
                }`}
              >
                <p className="text-sm lg:text-base text-[#dae2fd] leading-relaxed">
                  {p.text}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-white/10 font-mono text-xs text-[#c0c1ff] flex items-start gap-2 bg-[#0b1326] p-3 rounded-lg">
                    <Sparkles className="w-4 h-4 text-[#8b5cf6] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block mb-0.5">Truvix Diagnostic:</span>
                      <span>{p.reasoning}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => onNavigate('text-scan')}
          className="bg-gradient-to-r from-[#8083ff] to-[#6f00be] hover:from-[#9193ff] hover:to-[#820cd6] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-[#8083ff]/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Analyze New Document</span>
        </button>
      </div>
    </div>
  );
};

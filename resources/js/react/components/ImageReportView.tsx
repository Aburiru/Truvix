import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Coins, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Cpu,
  FileCheck2,
  Layers,
  Sparkles
} from 'lucide-react';
import { ImageForensicReport, ViewMode } from '../types';

interface ImageReportViewProps {
  report: ImageForensicReport;
  onNavigate: (mode: ViewMode) => void;
  onDownloadReport: () => void;
}

export const ImageReportView: React.FC<ImageReportViewProps> = ({ report, onNavigate, onDownloadReport }) => {
  const [showHeatmap, setShowHeatmap] = useState(true);

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#334155]/40 pb-6">
        <div>
          <button 
            onClick={() => onNavigate('image-forensic')} 
            className="text-xs font-mono text-[#908fa0] hover:text-white flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Image Forensic</span>
          </button>
          <h1 className="text-3xl font-bold font-headline text-white tracking-tight">Image Forensic Report</h1>
          <p className="text-sm font-mono text-[#c0c1ff] mt-1 flex items-center gap-2">
            <span>🖼️ {report.fileName}</span>
            <span className="text-[#908fa0]">• {report.timestamp}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#131b2e] border border-[#334155] px-3.5 py-2 rounded-xl text-xs font-mono text-[#f59e0b] flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#f59e0b]" />
            <span>2/5 Credits</span>
          </div>

          <button
            onClick={onDownloadReport}
            className="bg-[#1e293b] hover:bg-[#222a3d] border border-[#334155] text-white px-4 py-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>

          <button
            onClick={() => onNavigate('image-forensic')}
            className="bg-[#8083ff] hover:bg-[#9193ff] text-[#0d0096] font-semibold px-4 py-2 rounded-xl text-xs font-mono transition-all glow-button flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Top Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Visual Evidence & Interactive Heatmap */}
        <div className="lg:col-span-7 bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-[#908fa0]">
            <span className="uppercase tracking-widest font-semibold">VISUAL EVIDENCE</span>

            {/* Heatmap Toggle Switch */}
            <div className="flex items-center gap-2">
              <span>Forensic Heatmap</span>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`w-11 h-6 rounded-full transition-colors p-1 relative flex items-center ${
                  showHeatmap ? 'bg-[#8083ff]' : 'bg-[#222a3d]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    showHeatmap ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Image Canvas Container */}
          <div className="relative rounded-xl bg-[#0b1326] border border-[#334155] overflow-hidden flex items-center justify-center p-2 min-h-[320px]">
            <img
              src={report.imageUrl}
              alt="Forensic visual target"
              className="max-h-[360px] w-auto rounded-lg object-contain"
            />

            {/* Heatmap Overlay Layer */}
            {showHeatmap && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <svg className="w-full h-full absolute inset-0">
                  {report.heatmapRegions.map((region, idx) => (
                    <g key={idx}>
                      <circle
                        cx={`${region.x}%`}
                        cy={`${region.y}%`}
                        r={region.radius}
                        fill="rgba(139, 92, 246, 0.25)"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                      <circle
                        cx={`${region.x}%`}
                        cy={`${region.y}%`}
                        r="4"
                        fill="#8b5cf6"
                      />
                    </g>
                  ))}
                </svg>

                {/* Region Badge Label */}
                <div className="absolute bottom-3 left-3 bg-[#060e20]/90 border border-[#8b5cf6]/50 px-3 py-1 rounded-lg text-[11px] font-mono text-[#c0c1ff] flex items-center gap-2 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-ping" />
                  <span>SYNTHETIC HEATMAP OVERLAY ACTIVE</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Detection Score Card */}
        <div className="lg:col-span-5 bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs text-[#908fa0] uppercase tracking-widest mb-4">
              DETECTION SCORE
            </div>

            <div className="relative w-44 h-44 flex items-center justify-center my-4 mx-auto">
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
                  {report.aiProbability.toFixed(1)}<span className="text-xl">%</span>
                </span>
                <span className="font-mono text-[11px] text-[#8b5cf6] font-semibold uppercase tracking-wider mt-1">
                  {report.confidenceLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#131b2e] border border-[#334155] p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#8b5cf6] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-headline font-semibold text-sm text-white mb-1">
                {report.riskLevel}
              </h4>
              <p className="text-xs text-[#c7c4d7] leading-relaxed">
                {report.riskSummary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Findings (3 Risk Cards) */}
      <div className="space-y-4">
        <div className="font-mono text-xs text-[#908fa0] uppercase tracking-widest">
          FORENSIC FINDINGS
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[#171f33] rounded-lg text-[#8083ff]">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] font-mono text-[11px] font-semibold">
                {report.findings.noisePattern.risk}
              </span>
            </div>
            <h4 className="font-headline font-semibold text-base text-white">
              {report.findings.noisePattern.title}
            </h4>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              {report.findings.noisePattern.description}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[#171f33] rounded-lg text-[#10b981]">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] font-mono text-[11px] font-semibold">
                {report.findings.metadata.risk}
              </span>
            </div>
            <h4 className="font-headline font-semibold text-base text-white">
              {report.findings.metadata.title}
            </h4>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              {report.findings.metadata.description}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[#171f33] rounded-lg text-[#009ada]">
                <Layers className="w-4 h-4" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] font-mono text-[11px] font-semibold">
                {report.findings.pixelArtifacts.risk}
              </span>
            </div>
            <h4 className="font-headline font-semibold text-base text-white">
              {report.findings.pixelArtifacts.title}
            </h4>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              {report.findings.pixelArtifacts.description}
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Summary Block */}
      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-3 shadow-xl relative border-l-4 border-l-[#8b5cf6]">
        <div className="font-mono text-xs text-[#908fa0] uppercase tracking-widest">
          ANALYSIS SUMMARY
        </div>
        <p className="text-sm lg:text-base text-[#dae2fd] leading-relaxed font-body">
          {report.analysisSummary}
        </p>
      </div>
    </div>
  );
};

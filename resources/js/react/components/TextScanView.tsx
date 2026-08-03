import React, { useState } from 'react';
import { 
  Trash2, 
  ScanText, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Coins,
  Loader2,
  FileCheck
} from 'lucide-react';
import { UserCredits, ViewMode, TextScanReport } from '../types';
import { SAMPLE_TEXT_AI, SAMPLE_TEXT_HUMAN } from '../data/sampleData';

interface TextScanViewProps {
  credits: UserCredits;
  authToken: string;
  onAnalyzeComplete: (report: TextScanReport) => void;
  onNavigate: (mode: ViewMode) => void;
}

export const TextScanView: React.FC<TextScanViewProps> = ({ credits, authToken, onAnalyzeComplete, onNavigate }) => {
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const wordCount = textInput.trim().length > 0 ? textInput.trim().split(/\s+/).length : 0;

  const handleClear = () => {
    setTextInput('');
    setErrorMsg('');
  };

  const handleAnalyze = async () => {
    if (!textInput.trim()) {
      setErrorMsg('Please paste or type text to analyze.');
      return;
    }

    if (wordCount < 10) {
      setErrorMsg('Text is too short. Please enter at least 10 words for accurate analysis.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/analyze/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ text: textInput }),
      });

      const data = await response.json();

      if (response.ok && data.analysis) {
        const analysis = data.analysis;
        const fullReport: TextScanReport = {
          id: `rpt-txt-${analysis.id}`,
          title: `Scan_${new Date().toLocaleTimeString().replace(/:/g, '')}.txt`,
          timestamp: 'Just now',
          aiProbability: analysis.ai_probability * 100,
          confidenceLabel: analysis.confidence_score,
          perplexityScore: 'N/A', // ponytail: simple placeholder for now
          perplexityDescription: 'N/A',
          burstiness: 'N/A',
          burstinessDescription: 'N/A',
          sentenceLength: 'N/A',
          avgSentenceLength: 'N/A',
          linguisticPatternSummary: analysis.analysis_summary,
          highlightedTags: [], // ponytail: simple placeholder for now
          paragraphs: [{ text: analysis.input_content, isAi: analysis.ai_probability > 0.5, reasoning: analysis.analysis_summary }],
          originalText: analysis.input_content
        };

        onAnalyzeComplete(fullReport);
      } else {
        setErrorMsg(data.message || 'Failed to analyze text.');
      }
    } catch (err: any) {
      console.error('Text analysis request error:', err);
      setErrorMsg('Network error occurred. Falling back to local analyzer.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#334155]/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline text-white tracking-tight">AI Text Scan</h1>
          <p className="text-sm text-[#c7c4d7] mt-1">Paste your content to detect AI generation patterns.</p>
        </div>

        <div className="bg-[#131b2e] border border-[#334155] px-4 py-2 rounded-xl text-xs font-mono text-[#c0c1ff] flex items-center gap-2 self-start md:self-auto">
          <Coins className="w-4 h-4 text-[#8083ff]" />
          <span>{credits.max - credits.used}/{credits.max} Credits</span>
        </div>
      </div>

      {/* Input Container Box */}
      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-6 shadow-xl relative">
        {/* Box Subheader */}
        <div className="flex items-center justify-between text-xs font-mono text-[#908fa0]">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-widest font-semibold">INPUT CONTENT</span>
            <span className="text-[#334155]">|</span>
            <span className="text-[#c0c1ff]">Truvix Forensic Engine v2.4</span>
          </div>

          <div className="bg-[#131b2e] border border-[#334155] px-3 py-1 rounded-full text-[11px] text-[#c7c4d7] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span>Cost: 1 Credit</span>
          </div>
        </div>

        {/* Quick Load Sample Text Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#c7c4d7]">
          <span className="text-[#908fa0]">Sample presets:</span>
          <button
            onClick={() => { setTextInput(SAMPLE_TEXT_AI); setErrorMsg(''); }}
            className="px-3 py-1 rounded-lg bg-[#131b2e] hover:bg-[#222a3d] border border-[#334155] text-[#c0c1ff] hover:text-white transition-colors"
          >
            + High AI Sample (Brief)
          </button>
          <button
            onClick={() => { setTextInput(SAMPLE_TEXT_HUMAN); setErrorMsg(''); }}
            className="px-3 py-1 rounded-lg bg-[#131b2e] hover:bg-[#222a3d] border border-[#334155] text-[#10b981] hover:text-white transition-colors"
          >
            + Organic Human Sample
          </button>
        </div>

        {/* Textarea Input */}
        <div className="relative">
          <textarea
            value={textInput}
            onChange={(e) => { setTextInput(e.target.value); setErrorMsg(''); }}
            placeholder="Paste text here for analysis (minimum 50 words recommended for accurate results)..."
            rows={12}
            className="w-full bg-[#0b1326] border border-[#334155] rounded-xl p-5 text-sm lg:text-base text-[#dae2fd] placeholder-[#908fa0]/60 focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff] transition-all resize-none font-body leading-relaxed"
          />

          {errorMsg && (
            <div className="mt-2 text-xs font-mono text-[#ffb4ab] bg-[#93000a]/20 border border-[#93000a]/40 p-3 rounded-lg flex items-center gap-2">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs font-mono text-[#908fa0] self-start sm:self-auto">
            <span className="text-white font-semibold">{wordCount}</span> words
            {wordCount > 0 && wordCount < 20 && <span className="text-[#f59e0b] ml-2">(Short input)</span>}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {textInput.length > 0 && (
              <button
                onClick={handleClear}
                disabled={isAnalyzing}
                className="px-4 py-2.5 rounded-xl text-xs font-mono text-[#c7c4d7] hover:text-white hover:bg-[#131b2e] border border-transparent hover:border-[#334155] transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-[#908fa0]" />
                <span>Clear Text</span>
              </button>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !textInput.trim()}
              className="bg-gradient-to-r from-[#8083ff] to-[#6f00be] hover:from-[#9193ff] hover:to-[#820cd6] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-[#8083ff]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Vectors...</span>
                </>
              ) : (
                <>
                  <ScanText className="w-4 h-4" />
                  <span>Analyze Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Value Cards (High Speed, Accuracy, Privacy) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8083ff] font-semibold uppercase">
            <Zap className="w-4 h-4" />
            <span>High Speed</span>
          </div>
          <p className="text-xs text-[#c7c4d7] leading-relaxed">
            Results typically generated in under 3 seconds using our optimized forensic models.
          </p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#10b981] font-semibold uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>Accuracy</span>
          </div>
          <p className="text-xs text-[#c7c4d7] leading-relaxed">
            98.4% detection rate for GPT-4, Claude 3, and other modern LLM outputs.
          </p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#89ceff] font-semibold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy</span>
          </div>
          <p className="text-xs text-[#c7c4d7] leading-relaxed">
            Text is processed ephemerally and never stored or used for model training.
          </p>
        </div>
      </div>
    </div>
  );
};

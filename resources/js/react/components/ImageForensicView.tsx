import React, { useState } from 'react';
import { 
  Upload, 
  Search, 
  Image as ImageIcon, 
  Layers, 
  Cpu, 
  FileCheck2, 
  Sparkles, 
  Coins, 
  Loader2, 
  X
} from 'lucide-react';
import { UserCredits, ViewMode, ImageForensicReport } from '../types';
import { DEFAULT_IMAGE_REPORT, SAMPLE_IMAGE_URL } from '../data/sampleData';

interface ImageForensicViewProps {
  credits: UserCredits;
  authToken: string;
  onAnalyzeComplete: (report: ImageForensicReport) => void;
  onNavigate: (mode: ViewMode) => void;
}

export const ImageForensicView: React.FC<ImageForensicViewProps> = ({ credits, authToken, onAnalyzeComplete, onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('Uploaded_Image.png');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Image file size exceeds 10MB limit.');
        return;
      }
      setImageName(file.name);
      setErrorMsg('');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (url: string, name: string) => {
    setSelectedImage(url);
    setImageName(name);
    setErrorMsg('');
  };

  const handleRunScan = async () => {
    if (!selectedImage) {
      setErrorMsg('Please select or upload an image to scan.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg('');

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    };

    try {
      // PRD STEP 2: Upload image first, get filename back
      const blob = await fetch(selectedImage).then(r => r.blob());
      const file = new File([blob], imageName, { type: blob.type || 'image/png' });
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await fetch('/api/detect/image', {
        method: 'POST',
        headers,
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.uploaded) {
        setErrorMsg(uploadData.error || 'Upload failed.');
        return;
      }

      // PRD STEP 5: Send stored filename to process through AI service
      const detectRes = await fetch('/api/detect/image/process', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: uploadData.filename }),
      });
      const reportFromServer = await detectRes.json();

      const finalReport: ImageForensicReport = {
        ...reportFromServer,
        fileName: imageName,
        imageUrl: selectedImage,
        timestamp: 'Just now',
      };

      onAnalyzeComplete(finalReport);
    } catch (err) {
      console.error('Scan failed:', err);
      setErrorMsg('Network error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-body">
      {/* Top Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#334155]/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline text-white tracking-tight">Image Forensic</h1>
          <p className="text-sm text-[#c7c4d7] mt-1">
            Upload an image to detect AI-generated artifacts, synthetic textures, and digital manipulation.
          </p>
        </div>

        <div className="bg-[#131b2e] border border-[#334155] px-4 py-2 rounded-xl text-xs font-mono text-[#c0c1ff] flex items-center gap-2 self-start md:self-auto">
          <Coins className="w-4 h-4 text-[#8083ff]" />
          <span>Credits: {credits.max - credits.used}/{credits.max}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Left Container: Image Source & Upload */}
        <div className="lg:col-span-8 bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-[#908fa0]">
            <span className="uppercase tracking-widest font-semibold">IMAGE SOURCE</span>
            <span className="bg-[#131b2e] border border-[#334155] px-3 py-1 rounded-full text-[11px] text-[#c7c4d7] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" />
              Cost: 1 Credit
            </span>
          </div>

          {/* Sample Preset Selector */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#c7c4d7]">
            <span className="text-[#908fa0]">Try sample:</span>
            <button
              onClick={() => handleSelectSample(SAMPLE_IMAGE_URL, 'Profile_Photo.png')}
              className="px-3 py-1 rounded-lg bg-[#131b2e] hover:bg-[#222a3d] border border-[#334155] text-[#c0c1ff] transition-colors"
            >
              + Synthetic Portrait Sample
            </button>
            <button
              onClick={() => handleSelectSample('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop', 'Landscape_Camera.jpg')}
              className="px-3 py-1 rounded-lg bg-[#131b2e] hover:bg-[#222a3d] border border-[#334155] text-[#10b981] transition-colors"
            >
              + Organic Photo Sample
            </button>
          </div>

          {/* Upload Area / Image Preview */}
          <div className="relative flex-1 min-h-[320px] rounded-2xl border-2 border-dashed border-[#334155] hover:border-[#8083ff]/60 bg-[#0b1326] flex flex-col items-center justify-center p-6 text-center transition-all group overflow-hidden">
            {selectedImage ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Selected target"
                  className="max-h-[300px] w-auto rounded-xl object-contain border border-[#334155]/60 shadow-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-2 bg-[#060e20]/90 hover:bg-[#93000a] text-white rounded-xl border border-[#334155] transition-colors shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-3 font-mono text-xs text-[#c0c1ff] bg-[#131b2e] px-3 py-1 rounded-md border border-[#334155]">
                  {imageName}
                </div>
              </div>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-[#171f33] border border-[#334155] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <ImageIcon className="w-8 h-8 text-[#8083ff]" />
                </div>
                <h3 className="font-headline font-semibold text-lg text-white mb-1">
                  Drag & Drop Image Here
                </h3>
                <p className="text-xs text-[#c7c4d7] max-w-sm mb-6 leading-relaxed">
                  Or click to browse your files. Deep forensic analysis requires high-resolution images for optimal artifact detection.
                </p>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#908fa0]">
                  <span className="px-2.5 py-1 rounded bg-[#131b2e] border border-[#334155]">PNG</span>
                  <span className="px-2.5 py-1 rounded bg-[#131b2e] border border-[#334155]">JPG</span>
                  <span className="px-2.5 py-1 rounded bg-[#131b2e] border border-[#334155]">JPEG</span>
                </div>
              </label>
            )}
          </div>

          {errorMsg && (
            <div className="text-xs font-mono text-[#ffb4ab] bg-[#93000a]/20 border border-[#93000a]/40 p-3 rounded-lg">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* Run Deep Scan Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRunScan}
              disabled={isAnalyzing || !selectedImage}
              className="w-full sm:w-auto bg-gradient-to-r from-[#8083ff] to-[#6f00be] hover:from-[#9193ff] hover:to-[#820cd6] text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-[#8083ff]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Running Deep Forensics...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Run Deep Scan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side Column: Capabilities Breakdown */}
        <div className="lg:col-span-4 bg-[#1e293b] rounded-2xl border border-[#334155] p-6 lg:p-8 space-y-6 flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs text-[#908fa0] uppercase tracking-widest mb-6">
              FORENSIC CAPABILITIES
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#171f33] rounded-xl text-[#8083ff] border border-[#334155]/60 shrink-0 mt-0.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline font-semibold text-sm text-white mb-1">
                    Noise Pattern Analysis
                  </h4>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    Detects unnatural sensor noise patterns introduced by generative diffusion models like Midjourney and DALL-E.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#171f33] rounded-xl text-[#10b981] border border-[#334155]/60 shrink-0 mt-0.5">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline font-semibold text-sm text-white mb-1">
                    Metadata Forensics
                  </h4>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    Extracts and analyzes EXIF data, software signatures, and edit history for manipulation footprints.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#171f33] rounded-xl text-[#009ada] border border-[#334155]/60 shrink-0 mt-0.5">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline font-semibold text-sm text-white mb-1">
                    Pixel Level Artifacts
                  </h4>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    Identifies structural anomalies, blending errors, and upscaling artifacts common in AI generation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Visual Banner */}
          <div className="rounded-xl bg-[#0b1326] border border-[#334155] p-4 flex items-center justify-between text-xs font-mono text-[#908fa0]">
            <span>Deep Neural Model v2.4</span>
            <span className="text-[#10b981]">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

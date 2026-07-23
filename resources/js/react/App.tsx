import React, { useState } from 'react';
import { 
  ViewMode, 
  TextScanReport, 
  ImageForensicReport, 
  UserCredits 
} from './types';
import { 
  DEFAULT_TEXT_REPORT, 
  DEFAULT_IMAGE_REPORT 
} from './data/sampleData';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { OverviewView } from './components/OverviewView';
import { TextScanView } from './components/TextScanView';
import { ImageForensicView } from './components/ImageForensicView';
import { TextReportView } from './components/TextReportView';
import { ImageReportView } from './components/ImageReportView';
import { SettingsView } from './components/SettingsView';
import { SupportView } from './components/SupportView';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [credits, setCredits] = useState<UserCredits>({
    used: 2,
    max: 5,
    isPro: false,
    totalDocuments: 142,
    totalImages: 38,
    aiTextPercentage: 45,
    humanTextPercentage: 55,
    syntheticImagePercentage: 82,
    authenticImagePercentage: 18,
  });

  const [activeTextReport, setActiveTextReport] = useState<TextScanReport>(DEFAULT_TEXT_REPORT);
  const [activeImageReport, setActiveImageReport] = useState<ImageForensicReport>(DEFAULT_IMAGE_REPORT);

  // Navigation Handler
  const handleNavigate = (mode: ViewMode) => {
    setCurrentView(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Text Scan Completion Handler
  const handleTextScanComplete = (report: TextScanReport) => {
    setActiveTextReport(report);
    
    // Deduct credit
    setCredits((prev) => ({
      ...prev,
      used: Math.min(prev.max, prev.used + 1),
      totalDocuments: prev.totalDocuments + 1
    }));

    setCurrentView('text-report');
  };

  // Image Forensic Completion Handler
  const handleImageScanComplete = (report: ImageForensicReport) => {
    setActiveImageReport(report);

    // Deduct credit
    setCredits((prev) => ({
      ...prev,
      used: Math.min(prev.max, prev.used + 1),
      totalImages: prev.totalImages + 1
    }));

    setCurrentView('image-report');
  };

  // Top Up Credits Handler
  const handleTopUpCredits = (amount: number) => {
    setCredits((prev) => ({
      ...prev,
      max: prev.max + amount
    }));
  };

  // Toggle Pro Subscription
  const handleTogglePro = () => {
    setCredits((prev) => ({
      ...prev,
      isPro: !prev.isPro,
      max: !prev.isPro ? 9999 : 5
    }));
  };

  // Export PDF trigger
  const handleExportPDF = () => {
    alert('Exporting forensic report as high-resolution PDF artifact...');
  };

  if (currentView === 'landing') {
    return (
      <LandingView 
        onNavigate={handleNavigate}
        onOpenSampleReport={() => {
          setActiveTextReport(DEFAULT_TEXT_REPORT);
          handleNavigate('text-report');
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0b1326] text-[#dae2fd]">
      {/* Left Navigation Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        credits={credits}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {currentView === 'overview' && (
          <OverviewView
            credits={credits}
            onNavigate={handleNavigate}
            onSubscribe={handleTogglePro}
          />
        )}

        {currentView === 'text-scan' && (
          <TextScanView
            credits={credits}
            onAnalyzeComplete={handleTextScanComplete}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'image-forensic' && (
          <ImageForensicView
            credits={credits}
            onAnalyzeComplete={handleImageScanComplete}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'text-report' && (
          <TextReportView
            report={activeTextReport}
            onNavigate={handleNavigate}
            onExportPDF={handleExportPDF}
          />
        )}

        {currentView === 'image-report' && (
          <ImageReportView
            report={activeImageReport}
            onNavigate={handleNavigate}
            onDownloadReport={handleExportPDF}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            credits={credits}
            onTopUpCredits={handleTopUpCredits}
            onTogglePro={handleTogglePro}
          />
        )}

        {currentView === 'support' && (
          <SupportView />
        )}
      </main>
    </div>
  );
}

export default App;

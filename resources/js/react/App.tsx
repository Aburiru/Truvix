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
import { RegisterView } from './components/RegisterView';
import { LoginView } from './components/LoginView';

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
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Load token from localStorage on initial render
  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Save token to localStorage when it changes
  React.useEffect(() => {
    if (authToken) {
      localStorage.setItem('auth_token', authToken);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [authToken]);

  const handleNavigate = (mode: ViewMode) => {
    setCurrentView(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (token: string) => {
    setAuthToken(token);
    setCurrentView('overview');
  };

  const handleRegister = (token: string) => {
    setAuthToken(token);
    setCurrentView('overview');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentView('landing');
  };

  const handleTextScanComplete = (report: TextScanReport) => {
    setCredits((prev) => ({
      ...prev,
      used: Math.min(prev.max, prev.used + 1),
      totalDocuments: prev.totalDocuments + 1
    }));
    setActiveTextReport(report);
    setCurrentView('text-report');
  };

  const handleImageScanComplete = (report: ImageForensicReport) => {
    setCredits((prev) => ({
      ...prev,
      used: Math.min(prev.max, prev.used + 1),
      totalImages: prev.totalImages + 1
    }));
    setActiveImageReport(report);
    setCurrentView('image-report');
  };

  const handleTopUpCredits = (amount: number) => {
    setCredits((prev) => ({
      ...prev,
      max: prev.max + amount
    }));
  };

  const handleTogglePro = () => {
    setCredits((prev) => ({
      ...prev,
      isPro: !prev.isPro,
      max: !prev.isPro ? 9999 : 5
    }));
  };

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
        onLogout={handleLogout}
        isAuthenticated={!!authToken}
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
            authToken={authToken ? authToken : ''}
            onAnalyzeComplete={handleTextScanComplete}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentView === 'image-forensic' && (
          <ImageForensicView
            credits={credits}
            authToken={authToken ? authToken : ''}
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
        
        {/* Login Screen */}
        {currentView === 'login' && (
          <LoginView 
            onLogin={handleLogin} 
            onNavigate={handleNavigate} 
          />
        )}
        
        {currentView === 'register' && (
          <RegisterView 
            onRegister={handleRegister} 
            onNavigate={handleNavigate} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
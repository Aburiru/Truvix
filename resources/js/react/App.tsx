import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ViewMode,
  TextScanReport,
  ImageForensicReport,
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
  const [activeTextReport, setActiveTextReport] = useState<TextScanReport>(DEFAULT_TEXT_REPORT);
  const [activeImageReport, setActiveImageReport] = useState<ImageForensicReport>(DEFAULT_IMAGE_REPORT);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshCreditTrigger, setRefreshCreditTrigger] = useState(0); // New state for credit refresh

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
    setRefreshCreditTrigger(prev => prev + 1); // Refresh credits on login
  };

  const handleRegister = (token: string) => {
    setAuthToken(token);
    setCurrentView('overview');
    setRefreshCreditTrigger(prev => prev + 1); // Refresh credits on register
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentView('landing');
  };

  const handleCreditsUpdated = useCallback(() => {
    setRefreshCreditTrigger(prev => prev + 1);
  }, []);

  // The following functions related to local credit simulation should be removed or updated
  // as actual credit usage will be handled by backend and Midtrans integration.
  const handleTextScanComplete = (report: TextScanReport) => {
    // This logic should ideally reflect a credit deduction from the backend
    // For now, it's illustrative. Actual deduction handled by middleware.
    setActiveTextReport(report);
    setCurrentView('text-report');
    setRefreshCreditTrigger(prev => prev + 1); // Refresh credits after a scan
  };

  const handleImageScanComplete = (report: ImageForensicReport) => {
    // Similar to text scan, actual deduction handled by middleware.
    setActiveImageReport(report);
    setCurrentView('image-report');
    setRefreshCreditTrigger(prev => prev + 1); // Refresh credits after a scan
  };

  // These are no longer needed as plan logic is now handled in SettingsView
  // const handleTopUpCredits = (amount: number) => { ... };
  // const handleTogglePro = () => { ... };

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
        // credits={credits} // Removed, CreditDisplay fetches its own
        onLogout={handleLogout}
        isAuthenticated={!!authToken}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {currentView === 'overview' && (
          <OverviewView
            // credits={credits} // Removed
            onNavigate={handleNavigate}
            // onSubscribe={handleTogglePro} // Removed
          />
        )}

        {currentView === 'text-scan' && (
          <TextScanView
            // credits={credits} // Removed
            authToken={authToken ? authToken : ''}
            onAnalyzeComplete={handleTextScanComplete}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'image-forensic' && (
          <ImageForensicView
            // credits={credits} // Removed
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
            // credits={credits} // Removed
            // onTopUpCredits={handleTopUpCredits} // Removed
            // onTogglePro={handleTogglePro} // Removed
            onCreditsUpdated={handleCreditsUpdated} // New prop
          />
        )}

        {currentView === 'support' && (
          <SupportView />
        )}

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
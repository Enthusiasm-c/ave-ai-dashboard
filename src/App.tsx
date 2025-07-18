import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { DailyReportPage } from '@/pages/DailyReportPage';
import { ProfitPage } from '@/pages/ProfitPage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { ABCPage } from '@/pages/ABCPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { DebugPage } from '@/pages/DebugPage';
import { Layout } from '@/components/Layout';
import './App.css';

function App() {
  const { isReady } = useTelegram();

  useEffect(() => {
    // Debug logging
    console.log('Current URL:', window.location.href);
    console.log('Path:', window.location.pathname);
    console.log('Search:', window.location.search);
    console.log('Hash:', window.location.hash);
  }, []);

  if (!isReady) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Initializing...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DailyReportPage />} />
          <Route path="/profit" element={<ProfitPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/abc" element={<ABCPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
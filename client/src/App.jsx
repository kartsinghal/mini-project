import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HealthPulse from './components/HealthPulse';
import SymptomChecker from './components/SymptomChecker';
import ResultSection from './components/ResultSection';
import HealthScoreMeter from './components/HealthScoreMeter';
import SeverityAlertBanner from './components/SeverityAlertBanner';
import FirstAidSection from './components/FirstAidSection';
import AIChat from './components/AIChat';
import DisclaimerBanner from './components/DisclaimerBanner';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './index.css';

function HomePage() {
  const { isDark } = useTheme();
  const [results, setResults] = useState(null);

  return (
    <div className={isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}>
      <SeverityAlertBanner results={results} />
      <Navbar />
      <main>
        <HeroSection />
        <DisclaimerBanner />
        <HealthPulse />
        <SymptomChecker onResults={setResults} />
        <ResultSection results={results} />
        {results && <HealthScoreMeter results={results} />}
        <FirstAidSection />
        <AIChat />
      </main>
      <Footer />
    </div>
  );
}

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f1f5f9' : '#1e293b',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

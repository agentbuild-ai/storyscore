import React, { useState } from 'react';
import { track } from './utils/analytics.js';
import GatePage from './pages/GatePage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ContextPage from './pages/ContextPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import PrivacyModal from './components/PrivacyModal.jsx';

function checkUnlocked() {
  const code = import.meta.env.VITE_ACCESS_CODE;
  if (!code) return true;
  try { return localStorage.getItem('ss_access') === code; } catch { return true; }
}

const INITIAL_CONTEXT = { q1: '', q2: '', q3: '' };

export default function App() {
  // Serve admin dashboard at ?admin or /admin without a router library
  if (window.location.pathname === '/admin' || window.location.search.includes('admin')) {
    return <AdminPage />;
  }

  const [step, setStep] = useState(checkUnlocked() ? 'landing' : 'gate');
  const [scenario, setScenario] = useState(null);
  const [context, setContext] = useState(INITIAL_CONTEXT);

  function handleScenarioSelect(s) {
    track('scenario_selected', { scenario: s });
    setScenario(s);
    setStep('context');
  }

  function handleContextSubmit(ctx) {
    const answered = Object.values(ctx).filter(v => v && v !== 'skipped').length;
    track('context_submitted', { scenario, questions_answered: answered });
    setContext(ctx);
    setStep('chat');
  }

  function handleRestart() {
    setScenario(null);
    setContext(INITIAL_CONTEXT);
    setStep('landing');
  }

  if (step === 'gate') {
    return <GatePage onUnlock={() => setStep('landing')} />;
  }

  // Chat step gets a full-height layout
  if (step === 'chat') {
    return (
      <div style={{
        height: '100dvh',
        display: 'flex', flexDirection: 'column',
        padding: '20px 16px 0',
        overflow: 'hidden',
      }}>
        <div style={{
          flex: 1, width: '100%', maxWidth: 680,
          margin: '0 auto',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <ChatPage scenario={scenario} context={context} onRestart={handleRestart} />
        </div>
      </div>
    );
  }

  // Landing page — full width, no max-width constraint
  if (step === 'landing') {
    return (
      <>
        <PrivacyModal />
        <LandingPage onSelect={handleScenarioSelect} />
      </>
    );
  }

  // Context wizard step
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-2xl">
        <ContextPage
          scenario={scenario}
          onSubmit={handleContextSubmit}
          onBack={() => setStep('landing')}
        />
      </div>
    </div>
  );
}

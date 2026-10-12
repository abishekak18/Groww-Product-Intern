'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { LearnView } from '@/components/learn/LearnView';
import { SimulatorView } from '@/components/simulator/SimulatorView';
import { GoalsView } from '@/components/goals/GoalsView';
import { ProfileView } from '@/components/profile/ProfileView';
import { ShieldCheck } from 'lucide-react';

function AppContent() {
  const { activeTab, isLoaded } = useApp();

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold tracking-wide">
            Loading your Groww Start sandbox...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Navigation />
      <OnboardingModal />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'learn' && <LearnView />}
        {activeTab === 'simulator' && <SimulatorView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Groww Start — Independent Educational Companion for Indian Gen Z</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            This application is an independent educational prototype. It is not affiliated with, endorsed by, or representing Groww (Nextbillion Technology Pvt. Ltd.) or any registered brokerage. All asset names, ticker symbols, price series, and trading mechanics are fictional. No real monetary transactions or securities orders are conducted.
          </p>
        </div>
      </footer>
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

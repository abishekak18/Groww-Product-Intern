'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/money';
import { ShieldAlert, Sparkles, Wallet, RefreshCw, GraduationCap } from 'lucide-react';

export function Header() {
  const { state, portfolioMetrics, resetAllData } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Disclaimer Banner */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-1.5 px-4 font-medium flex items-center justify-center text-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-white">Independent Educational Demo for Indian Gen Z:</strong> Fictional market sandbox with zero real money. Not affiliated with any commercial entity.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">Groww Start</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Edu Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">First-Time Investor Companion</p>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Virtual Cash Pill */}
          <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <div className="text-[10px] text-slate-500 font-medium leading-none">Virtual Cash</div>
              <div className="text-sm font-bold text-slate-900 leading-tight">
                {formatINR(portfolioMetrics.virtualCashPaise)}
              </div>
            </div>
          </div>

          {/* User Persona Pill */}
          <div className="hidden md:flex items-center gap-2 bg-emerald-50/70 border border-emerald-200/60 px-3 py-1.5 rounded-xl text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold capitalize">
              {state.profile.persona} • {state.profile.familiarity}
            </span>
          </div>

          {/* Quick Reset Demo Data button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all virtual cash, holdings, and lessons back to original ₹10,000 state?')) {
                resetAllData();
              }
            }}
            title="Reset demo data"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
            aria-label="Reset demo sandbox"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

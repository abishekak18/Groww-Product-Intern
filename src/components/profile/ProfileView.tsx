'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserPersona, InvestingFamiliarity } from '@/types';
import { LESSONS } from '@/data/lessons';
import {
  User,
  ShieldCheck,
  Lock,
  RefreshCw,
  Award,
  BookOpen,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export function ProfileView() {
  const { state, updateProfile, resetAllData } = useApp();
  const [name, setName] = useState(state.profile.name);
  const [persona, setPersona] = useState<UserPersona>(state.profile.persona);
  const [familiarity, setFamiliarity] = useState<InvestingFamiliarity>(state.profile.familiarity);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const completedCount = state.completedLessonIds.length;
  const totalLessons = LESSONS.length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Gen Z Explorer',
      persona,
      familiarity,
    });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setShowResetModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header Profile Summary */}
      <div className="fintech-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-3xl font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 shrink-0">
          {state.profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="capitalize">{state.profile.persona} • {state.profile.familiarity}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{state.profile.name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Goal: <span className="text-slate-200">{state.profile.primaryGoal}</span>
          </p>
        </div>
        <div className="bg-white/10 px-4 py-3 rounded-2xl text-center border border-white/10 shrink-0">
          <div className="text-xs text-slate-300 font-medium">Lessons Mastered</div>
          <div className="text-2xl font-bold text-emerald-400">
            {completedCount} / {totalLessons}
          </div>
        </div>
      </div>

      {/* Preferences Form */}
      <div className="fintech-card p-6 sm:p-7 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <span>Learning Preferences & Persona</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Customize how lessons and recommendations are tailored to your stage.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="profile-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Your Name / Nickname
            </label>
            <input
              id="profile-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Occupation
              </label>
              <div className="space-y-2">
                {[
                  { id: 'student', label: 'College Student' },
                  { id: 'intern', label: 'Intern / First-Time Earner' },
                  { id: 'professional', label: 'Working Professional' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPersona(item.id as UserPersona)}
                    className={`w-full p-2.5 text-left text-xs font-semibold rounded-xl border transition-all ${
                      persona === item.id
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Investing Familiarity Level
              </label>
              <div className="space-y-2">
                {[
                  { id: 'beginner', label: 'Beginner (Starting from zero)' },
                  { id: 'intermediate', label: 'Intermediate (Know basics)' },
                  { id: 'experienced', label: 'Experienced (Exploring strategies)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFamiliarity(item.id as InvestingFamiliarity)}
                    className={`w-full p-2.5 text-left text-xs font-semibold rounded-xl border transition-all ${
                      familiarity === item.id
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {isSavedToast ? (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Preferences updated successfully!</span>
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              id="save-profile-btn"
              className="fintech-btn-primary px-5 py-2.5 text-xs sm:text-sm font-bold"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Privacy & Safety Guarantee */}
      <div className="fintech-card p-6 sm:p-7 space-y-4 bg-gradient-to-br from-emerald-50/40 to-slate-50 border-emerald-200/60">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Privacy & Security by Design</span>
        </div>
        <h2 className="text-base font-bold text-slate-900">Your Data Stays 100% on Your Device</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Sensitive Information:</strong> We never ask for or store bank details, PAN card numbers, Aadhaar, debit/credit cards, or demat account logins.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Local-Only Storage:</strong> All profile data, simulated trades, and lesson milestones are preserved strictly in your browser’s localStorage.
            </span>
          </div>
        </div>
      </div>

      {/* Dangerous Zone / Reset Demo Data */}
      <div className="fintech-card p-6 sm:p-7 border-rose-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Reset Demo Sandbox</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Reset virtual cash back to original ₹10,000, clear all simulated holdings and transaction history.
            </p>
          </div>
          <button
            id="reset-demo-data-btn"
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors shrink-0"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Legal & Educational Disclosure */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-500 text-xs leading-relaxed space-y-2">
        <div className="font-bold text-slate-700">Educational Simulator Disclosure:</div>
        <p>
          Groww Start is an independent educational product prototype and learning companion created solely for instructional purposes. It does not provide real investment advice, brokerage services, or portfolio management services. All assets, tickers, and price trajectories displayed are fictional approximations designed to demonstrate principles of asset allocation, volatility, and rupee-cost averaging.
        </p>
        <p>
          Mutual fund and equity investments are subject to market risks. Read all scheme related documents carefully before investing real capital with SEBI-registered intermediaries.
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Are you sure?</h3>
              <p className="text-xs text-slate-600 mt-2">
                This will reset your virtual cash balance to <strong>₹10,000</strong>, delete all test holdings, transactions, and reset lesson progress. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 fintech-btn-secondary py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="confirm-reset-all-btn"
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/20"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

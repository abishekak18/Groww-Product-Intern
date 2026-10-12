'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserPersona, InvestingFamiliarity } from '@/types';
import { Sparkles, GraduationCap, Briefcase, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export function OnboardingModal() {
  const { state, updateProfile } = useApp();
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(state.profile.name || 'Gen Z Explorer');
  const [persona, setPersona] = useState<UserPersona>(state.profile.persona || 'student');
  const [primaryGoal, setPrimaryGoal] = useState<string>(
    state.profile.primaryGoal || 'Build an emergency buffer & learn index funds'
  );
  const [familiarity, setFamiliarity] = useState<InvestingFamiliarity>(
    state.profile.familiarity || 'beginner'
  );

  // If already completed onboarding, do not show modal
  if (state.profile.onboardingCompleted) {
    return null;
  }

  const handleFinish = (skipped = false) => {
    if (skipped) {
      updateProfile({ onboardingCompleted: true });
    } else {
      updateProfile({
        name: name.trim() || 'Gen Z Explorer',
        persona,
        primaryGoal,
        familiarity,
        onboardingCompleted: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 relative overflow-hidden">
        {/* Top badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Personalise Your Journey • Step {step} of 3</span>
          </div>
          <button
            onClick={() => handleFinish(true)}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium underline underline-offset-2"
          >
            Skip for now
          </button>
        </div>

        {/* Step 1: Who best describes you? */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Welcome to Groww Start!
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Your zero-risk companion to master financial basics. What best describes your current stage?
              </p>
            </div>

            <div>
              <label htmlFor="user-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                What should we call you?
              </label>
              <input
                id="user-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aditi or Rahul"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-slate-700">
                Your current occupation / status:
              </label>
              {[
                {
                  id: 'student',
                  title: 'College / University Student',
                  desc: 'Learning with pocket money or part-time earnings',
                  icon: GraduationCap,
                },
                {
                  id: 'intern',
                  title: 'Intern / First-Time Earner',
                  desc: 'Managing first stipends or initial freelancing income',
                  icon: Briefcase,
                },
                {
                  id: 'professional',
                  title: 'Early Career Professional',
                  desc: 'Looking to build long-term wealth from salary',
                  icon: Award,
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = persona === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPersona(item.id as UserPersona)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full fintech-btn-primary flex items-center justify-center gap-2 py-3"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: What is your primary financial goal? */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                What is your main financial goal right now?
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Having a clear target turns abstract saving into exciting progress.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                'Build an emergency buffer & save my first ₹25,000',
                'Understand Mutual Funds, SIPs & beating inflation',
                'Save for higher studies, a course, or relocation',
                'Buy a laptop, tech gadget, or dream travel trip',
                'Learn how stock investing actually works without risking real rupees',
              ].map((goalOption) => {
                const isSelected = primaryGoal === goalOption;
                return (
                  <button
                    key={goalOption}
                    type="button"
                    onClick={() => setPrimaryGoal(goalOption)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-900">{goalOption}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="fintech-btn-secondary px-5 py-3 text-sm"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 fintech-btn-primary flex items-center justify-center gap-2 py-3 text-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Familiarity with investing */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                How familiar are you with investing?
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                We adjust lesson suggestions and terminology explanations to match your pace.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'beginner',
                  title: 'Complete Beginner',
                  desc: 'Never invested before. Words like NAV, Sensex, and Expense Ratio sound confusing.',
                },
                {
                  id: 'intermediate',
                  title: 'Somewhat Familiar',
                  desc: 'Know what mutual funds and shares are, but hesitant or unsure how to pick wisely.',
                },
                {
                  id: 'experienced',
                  title: 'Have Some Experience',
                  desc: 'Already started a small SIP or bought stocks; looking to practice allocation strategies.',
                },
              ].map((level) => {
                const isSelected = familiarity === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setFamiliarity(level.id as InvestingFamiliarity)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-900">{level.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{level.desc}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                You’ll start with <strong>₹10,000 in virtual fictional cash</strong> to practice simulated trades safely!
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="fintech-btn-secondary px-5 py-3 text-sm"
              >
                Back
              </button>
              <button
                id="onboarding-finish-btn"
                onClick={() => handleFinish(false)}
                className="flex-1 fintech-btn-primary flex items-center justify-center gap-2 py-3 text-sm"
              >
                <span>Enter Groww Start</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

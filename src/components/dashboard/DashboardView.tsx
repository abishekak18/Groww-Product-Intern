'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatINR, formatPercentage } from '@/lib/money';
import { LESSONS } from '@/data/lessons';
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  Target,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';

export function DashboardView() {
  const { state, portfolioMetrics, setActiveTab, setSelectedLesson, openBuyModal, assets } = useApp();

  const totalLessons = LESSONS.length;
  const completedCount = state.completedLessonIds.length;
  const learningPercentage = Math.round((completedCount / totalLessons) * 100);

  // Calculate overall goal progress
  const totalTargetPaise = state.goals.reduce((acc, g) => acc + g.targetAmountPaise, 0);
  const totalSavedPaise = state.goals.reduce((acc, g) => acc + g.currentSavedPaise, 0);
  const goalsPercentage =
    totalTargetPaise > 0 ? Math.min(100, Math.round((totalSavedPaise / totalTargetPaise) * 100)) : 0;

  // Determine one recommended next action
  const nextUncompletedLesson = LESSONS.find((l) => !state.completedLessonIds.includes(l.id));
  const hasMadeTrade = state.portfolio.transactions.length > 0;

  let recommendedAction = {
    title: 'Start Lesson 1: Saving vs Investing',
    subtitle: 'Learn why money in a regular bank account loses purchasing power.',
    buttonText: 'Read Lesson (3 min)',
    action: () => {
      if (nextUncompletedLesson) {
        setSelectedLesson(nextUncompletedLesson);
      }
      setActiveTab('learn');
    },
  };

  if (completedCount >= 1 && !hasMadeTrade) {
    const starterAsset = assets[0]; // Nifty 50 Index Fund
    recommendedAction = {
      title: 'Make Your First Virtual Trade',
      subtitle: `Practice buying units of ${starterAsset.name} using fictional cash.`,
      buttonText: 'Open Simulator',
      action: () => {
        openBuyModal(starterAsset);
        setActiveTab('simulator');
      },
    };
  } else if (nextUncompletedLesson) {
    recommendedAction = {
      title: `Continue: ${nextUncompletedLesson.title}`,
      subtitle: nextUncompletedLesson.shortDescription,
      buttonText: 'Read Lesson',
      action: () => {
        setSelectedLesson(nextUncompletedLesson);
        setActiveTab('learn');
      },
    };
  } else {
    recommendedAction = {
      title: 'Track a New Savings Goal',
      subtitle: 'Set a target for an emergency fund, gadget, or travel.',
      buttonText: 'View Goals',
      action: () => setActiveTab('goals'),
    };
  }

  // Beginner-friendly financial tip
  const tips = [
    {
      title: 'The 50/30/20 Rule for Indian Gen Z',
      body: 'Aim for 50% Needs (rent, food, transit), 30% Wants (dining, weekend chill), and 20% Savings/Investments right when your stipend or salary lands.',
    },
    {
      title: 'SIP beats Market Timing',
      body: 'Trying to predict when the stock market will drop or rise is almost impossible. Investing a fixed ₹500 every month averages out costs automatically.',
    },
    {
      title: 'Emergency Buffer First',
      body: 'Before putting money into volatile stocks or mutual funds, keep 3 months of basic living costs safely in a liquid bank account.',
    },
  ];
  const currentTip = tips[completedCount % tips.length];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="capitalize">{state.profile.persona} Track • Zero-Risk Sandbox</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Welcome, {state.profile.name}!
          </h1>

          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Groww Start is your safe educational playground. Practice investing with{' '}
            <strong className="text-emerald-400 font-bold">₹10,000 in virtual cash</strong>, master 8 essential financial concepts, and track personal goals without risking a single real rupee.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('learn')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Lessons</span>
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 active:scale-95 text-white font-medium text-sm transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Open Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Virtual Portfolio Balance */}
        <div className="fintech-card p-5 relative">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Virtual Balance</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(portfolioMetrics.totalPortfolioValuePaise)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-slate-500">Cash: {formatINR(portfolioMetrics.virtualCashPaise)}</span>
            <span className="text-slate-300">•</span>
            <span
              className={
                portfolioMetrics.unrealizedPnLPaise >= 0
                  ? 'text-emerald-600 font-semibold'
                  : 'text-rose-600 font-semibold'
              }
            >
              {formatINR(portfolioMetrics.unrealizedPnLPaise)} (
              {formatPercentage(portfolioMetrics.unrealizedPnLPercent, { includeSign: true })})
            </span>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="fintech-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Learning Progress</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {completedCount} of {totalLessons}
          </div>
          <div className="mt-2.5">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${learningPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500 font-medium">
              <span>{learningPercentage}% completed</span>
              <button
                onClick={() => setActiveTab('learn')}
                className="text-emerald-600 hover:text-emerald-700 font-bold"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>

        {/* Financial Goal Progress */}
        <div className="fintech-card p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Goal Progress</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatINR(totalSavedPaise)}
          </div>
          <div className="mt-2.5">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${goalsPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500 font-medium">
              <span>{goalsPercentage}% of {formatINR(totalTargetPaise)}</span>
              <button
                onClick={() => setActiveTab('goals')}
                className="text-indigo-600 hover:text-indigo-700 font-bold"
              >
                Goals →
              </button>
            </div>
          </div>
        </div>

        {/* Sandbox Safety Shield */}
        <div className="fintech-card p-5 bg-gradient-to-br from-emerald-50/60 to-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Safety Status</span>
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 mt-1">100% Risk Free</div>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            All trades and prices are simulated. Zero bank links or real money ever required.
          </p>
        </div>
      </div>

      {/* Recommended Next Action & Beginner Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Action Card (Spans 2 cols) */}
        <div className="lg:col-span-2 fintech-card p-6 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Next Step for You</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{recommendedAction.title}</h2>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              {recommendedAction.subtitle}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Paced learning for beginners</span>
            </div>
            <button
              onClick={recommendedAction.action}
              className="fintech-btn-primary flex items-center gap-2 text-sm"
            >
              <span>{recommendedAction.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Beginner Financial Tip */}
        <div className="fintech-card p-6 bg-gradient-to-br from-amber-50/50 to-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Tip of the Day</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{currentTip.title}</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{currentTip.body}</p>
          </div>
          <div className="mt-5 text-[11px] text-amber-800/80 font-medium pt-3 border-t border-amber-100">
            💡 Practical habit for Indian 20-26 year olds
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('learn')}
          className="p-5 rounded-2xl bg-white border border-slate-200 text-left hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 flex items-center justify-between">
            <span>Learn Center</span>
            <span className="text-xs text-slate-400 group-hover:text-emerald-600">8 Lessons →</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Demystify SIPs, mutual funds, inflation, and risk with Indian rupee examples.
          </p>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className="p-5 rounded-2xl bg-white border border-slate-200 text-left hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 flex items-center justify-between">
            <span>Virtual Simulator</span>
            <span className="text-xs text-slate-400 group-hover:text-blue-600">6 Assets →</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trade simulated index funds, bluechips, bonds, and gold with ₹10,000 fictional cash.
          </p>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className="p-5 rounded-2xl bg-white border border-slate-200 text-left hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 flex items-center justify-between">
            <span>Savings Goals</span>
            <span className="text-xs text-slate-400 group-hover:text-indigo-600">Track Buffer →</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build liquid emergency savings and track targets with non-judgmental feedback.
          </p>
        </button>
      </div>
    </div>
  );
}

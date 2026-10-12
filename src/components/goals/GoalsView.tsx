'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SavingsGoal } from '@/types';
import { formatINR } from '@/lib/money';
import { GoalModal } from './GoalModal';
import {
  Target,
  Plus,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export function GoalsView() {
  const { state, updateGoal, deleteGoal } = useApp();
  const [modalGoal, setModalGoal] = useState<SavingsGoal | null | undefined>(undefined);
  // undefined = closed, null = create new, SavingsGoal = edit existing

  const totalTargetPaise = state.goals.reduce((acc, g) => acc + g.targetAmountPaise, 0);
  const totalSavedPaise = state.goals.reduce((acc, g) => acc + g.currentSavedPaise, 0);
  const overallPercentage =
    totalTargetPaise > 0 ? Math.min(100, Math.round((totalSavedPaise / totalTargetPaise) * 100)) : 0;

  const handleAddSavings = (goal: SavingsGoal, deltaPaise: number) => {
    const newSaved = Math.min(goal.targetAmountPaise, goal.currentSavedPaise + deltaPaise);
    updateGoal(goal.id, { currentSavedPaise: newSaved });
  };

  const getFeedbackMessage = (percent: number) => {
    if (percent >= 100) {
      return {
        text: 'Target reached! Outstanding discipline.',
        style: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    if (percent >= 75) {
      return {
        text: 'Final stretch! You are remarkably close.',
        style: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      };
    }
    if (percent >= 50) {
      return {
        text: 'Over halfway there. Consistency is building wealth.',
        style: 'bg-blue-50 text-blue-800 border-blue-200',
      };
    }
    if (percent >= 25) {
      return {
        text: 'Strong foundation built. Keep going at your own pace.',
        style: 'bg-slate-100 text-slate-800 border-slate-200',
      };
    }
    return {
      text: 'Every rupee saved is a stress reducer. Starting is key.',
      style: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Educational Distinction Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-indigo-950 text-indigo-100 border border-indigo-900/60 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Core Principle: Savings Goals vs. Investment Portfolio</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Keep Short-Term Goals in Safe Savings
        </h1>
        <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed max-w-3xl">
          Money you need in the next 1–2 years (like semester fees, emergency hospital buffer, or a laptop) belongs in high-interest bank savings accounts or ultra-safe liquid funds—not volatile stock markets. Stocks can undergo temporary 15% drops right when you need the cash!
        </p>
      </div>

      {/* Summary Stats & Add Goal Action */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="fintech-card p-5">
          <div className="text-xs font-semibold uppercase text-slate-400">Total Saved Corpus</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatINR(totalSavedPaise)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {state.goals.length} tracked goals
          </div>
        </div>

        <div className="fintech-card p-5">
          <div className="text-xs font-semibold uppercase text-slate-400">Total Target Amount</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatINR(totalTargetPaise)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Overall {overallPercentage}% funded</div>
        </div>

        <div>
          <button
            id="create-goal-btn"
            onClick={() => setModalGoal(null)}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Savings Goal</span>
          </button>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {state.goals.length === 0 ? (
          <div className="fintech-card p-12 text-center max-w-md mx-auto space-y-3">
            <Target className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Goals Created</h3>
            <p className="text-xs text-slate-500">
              Setting specific goals helps clarify why you are saving and keeps you disciplined.
            </p>
            <button
              onClick={() => setModalGoal(null)}
              className="fintech-btn-primary text-xs font-bold px-4 py-2 mt-2"
            >
              Add First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {state.goals.map((goal) => {
              const percent = Math.min(
                100,
                Math.round((goal.currentSavedPaise / goal.targetAmountPaise) * 100)
              );
              const remainingPaise = Math.max(0, goal.targetAmountPaise - goal.currentSavedPaise);
              const feedback = getFeedbackMessage(percent);

              return (
                <div
                  key={goal.id}
                  className="fintech-card p-5 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 capitalize border border-indigo-200/60">
                        {goal.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setModalGoal(goal)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit goal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete savings goal "${goal.title}"?`)) {
                              deleteGoal(goal.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{goal.title}</h3>
                    {goal.notes && (
                      <p className="text-xs text-slate-500 mt-1 italic">{goal.notes}</p>
                    )}

                    {/* Progress Bar & Amounts */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-xl font-extrabold text-slate-900">
                            {formatINR(goal.currentSavedPaise)}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {' '}
                            of {formatINR(goal.targetAmountPaise)}
                          </span>
                        </div>
                        <span className="text-sm font-extrabold text-indigo-600">{percent}%</span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>
                          {remainingPaise > 0
                            ? `Needed: ${formatINR(remainingPaise)}`
                            : '🎉 Fully Funded!'}
                        </span>
                        {goal.targetDate && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3" />
                            <span>Target: {goal.targetDate}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Encouraging Feedback Badge */}
                    <div
                      className={`mt-3.5 p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${feedback.style}`}
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{feedback.text}</span>
                    </div>
                  </div>

                  {/* Quick Increment Actions */}
                  {remainingPaise > 0 && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold">Quick deposit simulation:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAddSavings(goal, 50000)} // +₹500
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                        >
                          +₹500
                        </button>
                        <button
                          onClick={() => handleAddSavings(goal, 100000)} // +₹1,000
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                        >
                          +₹1,000
                        </button>
                        <button
                          onClick={() => handleAddSavings(goal, 250000)} // +₹2,500
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors"
                        >
                          +₹2,500
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Modal */}
      {modalGoal !== undefined && (
        <GoalModal
          initialGoal={modalGoal || undefined}
          onClose={() => setModalGoal(undefined)}
        />
      )}
    </div>
  );
}

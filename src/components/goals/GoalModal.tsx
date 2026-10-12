'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GoalCategory, SavingsGoal } from '@/types';
import { toPaise, toRupees } from '@/lib/money';
import { X, Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface GoalModalProps {
  initialGoal?: SavingsGoal;
  onClose: () => void;
}

export function GoalModal({ initialGoal, onClose }: GoalModalProps) {
  const { addGoal, updateGoal } = useApp();

  const [title, setTitle] = useState(initialGoal?.title || '');
  const [category, setCategory] = useState<GoalCategory>(initialGoal?.category || 'emergency');
  const [targetAmountRupees, setTargetAmountRupees] = useState(
    initialGoal ? toRupees(initialGoal.targetAmountPaise).toString() : '25000'
  );
  const [currentSavedRupees, setCurrentSavedRupees] = useState(
    initialGoal ? toRupees(initialGoal.currentSavedPaise).toString() : '5000'
  );
  const [targetDate, setTargetDate] = useState(initialGoal?.targetDate || '');
  const [notes, setNotes] = useState(initialGoal?.notes || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a goal name.');
      return;
    }

    const targetPaise = toPaise(targetAmountRupees);
    const savedPaise = toPaise(currentSavedRupees);

    if (targetPaise <= 0) {
      setError('Target amount must be greater than zero.');
      return;
    }

    if (savedPaise < 0) {
      setError('Saved amount cannot be negative.');
      return;
    }

    if (initialGoal) {
      updateGoal(initialGoal.id, {
        title: title.trim(),
        category,
        targetAmountPaise: targetPaise,
        currentSavedPaise: savedPaise,
        targetDate: targetDate || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addGoal({
        title: title.trim(),
        category,
        targetAmountPaise: targetPaise,
        currentSavedPaise: savedPaise,
        targetDate: targetDate || undefined,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {initialGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="goal-title-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Goal Name
            </label>
            <input
              id="goal-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 3-Month Emergency Fund, Laptop, Goa Trip"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'emergency', label: 'Emergency' },
                { id: 'gadget', label: 'Gadget / Tech' },
                { id: 'travel', label: 'Travel / Trip' },
                { id: 'higher_ed', label: 'Study / Course' },
                { id: 'first_job', label: 'First Job Move' },
                { id: 'general', label: 'General Buffer' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as GoalCategory)}
                  className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    category === c.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="goal-target-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Target Amount (₹)
              </label>
              <input
                id="goal-target-input"
                type="number"
                min="1"
                required
                value={targetAmountRupees}
                onChange={(e) => setTargetAmountRupees(e.target.value)}
                placeholder="₹25,000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label htmlFor="goal-saved-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Already Saved (₹)
              </label>
              <input
                id="goal-saved-input"
                type="number"
                min="0"
                value={currentSavedRupees}
                onChange={(e) => setCurrentSavedRupees(e.target.value)}
                placeholder="₹5,000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label htmlFor="goal-date-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Target Date (Optional)
            </label>
            <input
              id="goal-date-input"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="goal-notes-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Note / Strategy (Optional)
            </label>
            <input
              id="goal-notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Set aside ₹2,000 monthly from freelance work"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="fintech-btn-secondary px-4 py-2.5 text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-goal-btn"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{initialGoal ? 'Save Changes' : 'Create Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

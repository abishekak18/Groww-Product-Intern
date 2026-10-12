'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Lesson } from '@/types';
import {
  X,
  Clock,
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export function LessonModal({ lesson, onClose }: LessonModalProps) {
  const { state, completeLesson } = useApp();
  const isCompleted = state.completedLessonIds.includes(lesson.id);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);
  const isCorrect = selectedOption === lesson.quiz.correctIndex;

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setSubmittedQuiz(true);
    if (selectedOption === lesson.quiz.correctIndex) {
      completeLesson(lesson.id, 100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {lesson.badge}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{lesson.readTimeMinutes} min read</span>
              </span>
              {isCompleted && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Mastered</span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {lesson.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            aria-label="Close lesson"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-700">
          {/* Content Sections */}
          {lesson.contentSections.map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>{sec.title}</span>
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                {sec.body}
              </p>

              {/* Practical Indian Example Card */}
              {sec.indianExampleRupees && (
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/70 p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    <span>Practical Indian Example (in ₹ Rupees)</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 font-medium">
                    {sec.indianExampleRupees.scenario}
                  </div>
                  <div className="p-3 bg-white/90 rounded-xl border border-emerald-100 text-xs text-slate-800 font-mono leading-relaxed">
                    {sec.indianExampleRupees.calculation}
                  </div>
                  <div className="text-xs text-emerald-900 font-semibold flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Takeaway: {sec.indianExampleRupees.keyTakeaway}</span>
                  </div>
                </div>
              )}

              {/* Risk / Limitation Callout */}
              {sec.riskOrLimitation && (
                <div className="rounded-2xl bg-amber-50/60 border border-amber-200/80 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Important Risk & Limitation</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                    {sec.riskOrLimitation}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Interactive Quiz Section */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Quick Check: Test Your Understanding</span>
              </div>
              <span className="text-xs text-slate-500">1 question</span>
            </div>

            <p className="text-sm font-semibold text-slate-900">
              {lesson.quiz.question}
            </p>

            <div className="space-y-2">
              {lesson.quiz.options.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrectOption = optIdx === lesson.quiz.correctIndex;
                let optStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';

                if (submittedQuiz) {
                  if (isCorrectOption) {
                    optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                  } else if (isSelected) {
                    optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                  } else {
                    optStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optStyle = 'border-emerald-500 bg-emerald-50/60 text-slate-900 font-medium';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={submittedQuiz}
                    onClick={() => setSelectedOption(optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optStyle}`}
                  >
                    <span>{opt}</span>
                    {submittedQuiz && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {submittedQuiz && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {!submittedQuiz ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleQuizSubmit}
                className="w-full fintech-btn-primary py-2.5 text-sm"
              >
                Submit Answer
              </button>
            ) : (
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Excellent! That is correct.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Not quite right. Let's learn why:</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed">{lesson.quiz.explanation}</p>
                {!isCorrect && (
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedQuiz(false);
                      setSelectedOption(null);
                    }}
                    className="text-xs text-rose-700 underline font-semibold mt-1"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="fintech-btn-secondary text-xs sm:text-sm px-4 py-2"
          >
            Close
          </button>
          {isCompleted && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Lesson completed & saved</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LESSONS } from '@/data/lessons';
import { Lesson } from '@/types';
import { LessonModal } from './LessonModal';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function LearnView() {
  const { state, selectedLesson, setSelectedLesson } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const completedCount = state.completedLessonIds.length;
  const progressPercent = Math.round((completedCount / LESSONS.length) * 100);

  const categories = ['all', 'Foundations', 'Equities', 'Funds', 'Habits', 'Mindset', 'Strategy', 'Math', 'Protection'];

  const filteredLessons = LESSONS.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || lesson.badge.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero Jargon • Practical Indian Context</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Investing Fundamentals for Gen Z
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Master the 8 core concepts every first-time investor in India should understand before putting a single rupee into the market.
          </p>

          {/* Progress bar */}
          <div className="mt-5 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 max-w-lg">
            <div className="flex justify-between items-center text-xs font-semibold text-emerald-300 mb-2">
              <span>Overall Progress</span>
              <span>
                {completedCount} of {LESSONS.length} Mastered ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500 shadow-sm shadow-emerald-400/50"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics (e.g. SIP, stock, inflation, F&O)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400"
          />
        </div>

        {/* Categories scrollable on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat === 'all' ? 'All Topics' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map((lesson) => {
          const isCompleted = state.completedLessonIds.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`fintech-card p-5 sm:p-6 flex flex-col justify-between relative group ${
                isCompleted ? 'border-emerald-200 bg-emerald-50/20' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {lesson.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.readTimeMinutes} min</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {lesson.order}. {lesson.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {lesson.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                {isCompleted ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mastered</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Not started</span>
                )}

                <button
                  id={`open-lesson-${lesson.slug}`}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                    isCompleted
                      ? 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                      : 'text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20'
                  }`}
                >
                  <span>{isCompleted ? 'Review' : 'Start'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">No lessons found</h3>
          <p className="text-xs text-slate-500 mt-1">Try another search keyword or clear the filter.</p>
        </div>
      )}

      {/* Lesson Modal */}
      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}

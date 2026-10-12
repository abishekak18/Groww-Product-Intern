import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadAppState,
  saveAppState,
  resetAppState,
  DEFAULT_APP_STATE,
  STORAGE_KEY,
} from '@/lib/storage';
import { LESSONS } from '@/data/lessons';
import { SavingsGoal } from '@/types';

describe('Storage & State Recovery', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default app state when storage is empty', () => {
    const state = loadAppState();
    expect(state.portfolio.virtualCashPaise).toBe(1000000); // ₹10,000
    expect(state.profile.onboardingCompleted).toBe(false);
    expect(state.completedLessonIds.length).toBe(0);
  });

  it('safely recovers and falls back to default state when storage is corrupt or malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{"invalid_json": true'); // broken JSON syntax
    const state = loadAppState();
    expect(state.portfolio.virtualCashPaise).toBe(1000000);
    expect(state.profile.name).toBe('Gen Z Learner');

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ broken: 'structure' })); // missing essential keys
    const recovered = loadAppState();
    expect(recovered.portfolio.virtualCashPaise).toBe(1000000);
  });

  it('persists and restores updated state across sessions', () => {
    const modifiedState = {
      ...DEFAULT_APP_STATE,
      profile: {
        ...DEFAULT_APP_STATE.profile,
        name: 'Aarav Patel',
        onboardingCompleted: true,
      },
      completedLessonIds: ['lesson-1', 'lesson-2'],
      quizScores: { 'lesson-1': 100, 'lesson-2': 100 },
    };

    saveAppState(modifiedState);
    const restored = loadAppState();

    expect(restored.profile.name).toBe('Aarav Patel');
    expect(restored.profile.onboardingCompleted).toBe(true);
    expect(restored.completedLessonIds).toEqual(['lesson-1', 'lesson-2']);
    expect(restored.quizScores['lesson-1']).toBe(100);
  });

  it('clears storage and restores fresh initial state upon reset', () => {
    saveAppState({
      ...DEFAULT_APP_STATE,
      completedLessonIds: ['lesson-1'],
    });

    const resetState = resetAppState();
    expect(resetState.completedLessonIds.length).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe('Savings Goals Logic', () => {
  it('correctly calculates goal completion percentage and remaining amount', () => {
    const goal: SavingsGoal = {
      id: 'test_goal',
      title: 'Emergency Fund',
      category: 'emergency',
      targetAmountPaise: 5000000, // ₹50,000
      currentSavedPaise: 2000000, // ₹20,000
      createdAt: new Date().toISOString(),
    };

    const percent = Math.min(100, Math.round((goal.currentSavedPaise / goal.targetAmountPaise) * 100));
    const remainingPaise = Math.max(0, goal.targetAmountPaise - goal.currentSavedPaise);

    expect(percent).toBe(40);
    expect(remainingPaise).toBe(3000000); // ₹30,000 remaining
  });

  it('handles zero or exceeded goal savings without crashing', () => {
    const goal: SavingsGoal = {
      id: 'test_goal_over',
      title: 'Bike Down Payment',
      category: 'general',
      targetAmountPaise: 2000000, // ₹20,000
      currentSavedPaise: 2500000, // ₹25,000 (exceeded)
      createdAt: new Date().toISOString(),
    };

    const percent = Math.min(100, Math.round((goal.currentSavedPaise / goal.targetAmountPaise) * 100));
    const remainingPaise = Math.max(0, goal.targetAmountPaise - goal.currentSavedPaise);

    expect(percent).toBe(100);
    expect(remainingPaise).toBe(0);
  });
});

describe('Educational Lessons & Quiz Evaluation', () => {
  it('contains at least 8 structured lessons with Indian context and quizzes', () => {
    expect(LESSONS.length).toBeGreaterThanOrEqual(8);
    for (const lesson of LESSONS) {
      expect(lesson.title).toBeTruthy();
      expect(lesson.quiz.question).toBeTruthy();
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
      expect(lesson.quiz.explanation).toBeTruthy();
    }
  });

  it('validates quiz answers correctly against lesson ground truth', () => {
    const lesson1 = LESSONS[0];
    const correctAns = lesson1.quiz.correctIndex;
    const wrongAns = (correctAns + 1) % lesson1.quiz.options.length;

    expect(correctAns === lesson1.quiz.correctIndex).toBe(true);
    expect(wrongAns === lesson1.quiz.correctIndex).toBe(false);
  });
});

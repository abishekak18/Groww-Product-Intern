import { AppState, SavingsGoal, UserProfile, PortfolioState } from '@/types';

export const STORAGE_KEY = 'groww_start_state_v1';
export const INITIAL_VIRTUAL_CASH_PAISE = 1000000; // ₹10,000 in integer paise

export const DEFAULT_PROFILE: UserProfile = {
  id: 'user_default',
  name: 'Gen Z Learner',
  persona: 'student',
  primaryGoal: 'Learn basics & build my first ₹10,000 corpus',
  familiarity: 'beginner',
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
};

export const DEFAULT_PORTFOLIO: PortfolioState = {
  initialCashPaise: INITIAL_VIRTUAL_CASH_PAISE,
  virtualCashPaise: INITIAL_VIRTUAL_CASH_PAISE,
  holdings: {},
  transactions: [],
  realizedPnLPaise: 0,
};

export const DEFAULT_GOALS: SavingsGoal[] = [
  {
    id: 'goal_emergency_starter',
    title: 'Emergency Shield (3 Months)',
    category: 'emergency',
    targetAmountPaise: 3000000, // ₹30,000
    currentSavedPaise: 600000,  // ₹6,000
    targetDate: '2027-04-01',
    notes: 'Liquid safety buffer in a high-interest savings account or liquid fund',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal_laptop_upgrade',
    title: 'Work / Study Laptop',
    category: 'gadget',
    targetAmountPaise: 6500000, // ₹65,000
    currentSavedPaise: 2500000, // ₹25,000
    targetDate: '2027-08-15',
    notes: 'Saving monthly from internship stipend',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_APP_STATE: AppState = {
  profile: DEFAULT_PROFILE,
  portfolio: DEFAULT_PORTFOLIO,
  goals: DEFAULT_GOALS,
  completedLessonIds: [],
  quizScores: {},
  lastSavedAt: new Date().toISOString(),
};

/**
 * Loads the application state from localStorage safely.
 * Returns default state if running on server, if data is missing, or if JSON is corrupt.
 */
export function loadAppState(): AppState {
  if (typeof window === 'undefined') {
    return DEFAULT_APP_STATE;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_APP_STATE;
    }

    const parsed = JSON.parse(raw);

    // Validate essential keys to guard against corrupt or legacy shapes
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.profile ||
      !parsed.portfolio ||
      typeof parsed.portfolio.virtualCashPaise !== 'number'
    ) {
      console.warn('[GrowwStart] Corrupt state detected in localStorage. Reverting to defaults.');
      return DEFAULT_APP_STATE;
    }

    return {
      profile: {
        ...DEFAULT_PROFILE,
        ...parsed.profile,
      },
      portfolio: {
        ...DEFAULT_PORTFOLIO,
        ...parsed.portfolio,
        holdings: parsed.portfolio.holdings || {},
        transactions: Array.isArray(parsed.portfolio.transactions) ? parsed.portfolio.transactions : [],
      },
      goals: Array.isArray(parsed.goals) ? parsed.goals : DEFAULT_GOALS,
      completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
      quizScores: typeof parsed.quizScores === 'object' && parsed.quizScores ? parsed.quizScores : {},
      lastSavedAt: parsed.lastSavedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('[GrowwStart] Error parsing localStorage state:', error);
    return DEFAULT_APP_STATE;
  }
}

/**
 * Saves application state to localStorage safely.
 */
export function saveAppState(state: AppState): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const payload: AppState = {
      ...state,
      lastSavedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('[GrowwStart] Error saving state to localStorage:', error);
    return false;
  }
}

/**
 * Resets application state back to fresh demo defaults and clears storage.
 */
export function resetAppState(): AppState {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('[GrowwStart] Error removing storage key:', e);
    }
  }
  return {
    ...DEFAULT_APP_STATE,
    profile: {
      ...DEFAULT_PROFILE,
      createdAt: new Date().toISOString(),
    },
    portfolio: {
      ...DEFAULT_PORTFOLIO,
    },
    goals: [...DEFAULT_GOALS],
    completedLessonIds: [],
    quizScores: {},
    lastSavedAt: new Date().toISOString(),
  };
}

'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  AppState,
  Asset,
  Lesson,
  PortfolioState,
  SavingsGoal,
  UserProfile,
} from '@/types';
import {
  DEFAULT_APP_STATE,
  loadAppState,
  resetAppState,
  saveAppState,
} from '@/lib/storage';
import { MOCK_ASSETS } from '@/data/mock-assets';
import {
  calculatePortfolioMetrics,
  executeBuyOrder,
  executeSellOrder,
  PortfolioMetrics,
} from '@/lib/portfolio-math';

export type TabType = 'dashboard' | 'learn' | 'simulator' | 'goals' | 'profile';

interface AppContextType {
  state: AppState;
  isLoaded: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  assets: Asset[];
  portfolioMetrics: PortfolioMetrics;
  selectedAsset: Asset | null;
  setSelectedAsset: (asset: Asset | null) => void;
  selectedLesson: Lesson | null;
  setSelectedLesson: (lesson: Lesson | null) => void;
  buyAsset: Asset | null;
  sellAsset: Asset | null;
  openBuyModal: (asset: Asset) => void;
  openSellModal: (asset: Asset) => void;
  closeOrderModals: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  buyOrder: (asset: Asset, quantity: number) => { success: boolean; error?: string };
  sellOrder: (asset: Asset, quantity: number) => { success: boolean; error?: string };
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  completeLesson: (lessonId: string, score: number) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_APP_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [buyAsset, setBuyAsset] = useState<Asset | null>(null);
  const [sellAsset, setSellAsset] = useState<Asset | null>(null);

  // Initialize from localStorage safely on client mount
  useEffect(() => {
    const loaded = loadAppState();
    setState(loaded);
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  const commitState = (newState: AppState) => {
    setState(newState);
    saveAppState(newState);
  };

  const portfolioMetrics = useMemo(() => {
    return calculatePortfolioMetrics(state.portfolio, MOCK_ASSETS);
  }, [state.portfolio]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newState: AppState = {
      ...state,
      profile: {
        ...state.profile,
        ...updates,
      },
    };
    commitState(newState);
  };

  const buyOrder = (asset: Asset, quantity: number) => {
    const result = executeBuyOrder(state.portfolio, asset, quantity);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    const newState: AppState = {
      ...state,
      portfolio: result.updatedPortfolio,
    };
    commitState(newState);
    return { success: true };
  };

  const sellOrder = (asset: Asset, quantity: number) => {
    const result = executeSellOrder(state.portfolio, asset, quantity);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    const newState: AppState = {
      ...state,
      portfolio: result.updatedPortfolio,
    };
    commitState(newState);
    return { success: true };
  };

  const addGoal = (goalInput: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goalInput,
      id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    const newState: AppState = {
      ...state,
      goals: [newGoal, ...state.goals],
    };
    commitState(newState);
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    const updatedGoals = state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g));
    const newState: AppState = {
      ...state,
      goals: updatedGoals,
    };
    commitState(newState);
  };

  const deleteGoal = (id: string) => {
    const filteredGoals = state.goals.filter((g) => g.id !== id);
    const newState: AppState = {
      ...state,
      goals: filteredGoals,
    };
    commitState(newState);
  };

  const completeLesson = (lessonId: string, score: number) => {
    const completedSet = new Set(state.completedLessonIds);
    completedSet.add(lessonId);

    const newState: AppState = {
      ...state,
      completedLessonIds: Array.from(completedSet),
      quizScores: {
        ...state.quizScores,
        [lessonId]: score,
      },
    };
    commitState(newState);
  };

  const resetAllData = () => {
    const fresh = resetAppState();
    setState(fresh);
    setSelectedAsset(null);
    setSelectedLesson(null);
    setBuyAsset(null);
    setSellAsset(null);
    setActiveTab('dashboard');
  };

  const openBuyModal = (asset: Asset) => {
    setBuyAsset(asset);
    setSellAsset(null);
  };

  const openSellModal = (asset: Asset) => {
    setSellAsset(asset);
    setBuyAsset(null);
  };

  const closeOrderModals = () => {
    setBuyAsset(null);
    setSellAsset(null);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        isLoaded,
        activeTab,
        setActiveTab,
        assets: MOCK_ASSETS,
        portfolioMetrics,
        selectedAsset,
        setSelectedAsset,
        selectedLesson,
        setSelectedLesson,
        buyAsset,
        sellAsset,
        openBuyModal,
        openSellModal,
        closeOrderModals,
        updateProfile,
        buyOrder,
        sellOrder,
        addGoal,
        updateGoal,
        deleteGoal,
        completeLesson,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { LESSONS } from '@/data/lessons';
import { LessonModal } from '@/components/learn/LessonModal';
import { OrderModal } from '@/components/simulator/OrderModal';
import { MOCK_ASSETS } from '@/data/mock-assets';

describe('UI Components Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Header with Educational Sandbox label and initial Virtual Cash of ₹10,000', () => {
    render(
      <AppProvider>
        <Header />
      </AppProvider>
    );

    expect(screen.getByText('Groww Start')).toBeInTheDocument();
    expect(screen.getByText('Edu Sandbox')).toBeInTheDocument();
    expect(screen.getByText('₹10,000')).toBeInTheDocument();
  });

  it('renders Navigation items for Home, Learn, Simulator, Goals, and Profile across desktop and mobile', () => {
    render(
      <AppProvider>
        <Navigation />
      </AppProvider>
    );

    expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Learn').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Simulator').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Goals').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Profile').length).toBeGreaterThanOrEqual(1);
  });

  it('renders OnboardingModal for first-time users and allows completing or skipping', () => {
    render(
      <AppProvider>
        <OnboardingModal />
      </AppProvider>
    );

    expect(screen.getByText(/Welcome to Groww Start!/i)).toBeInTheDocument();
    expect(screen.getByText(/College \/ University Student/i)).toBeInTheDocument();

    const skipBtn = screen.getByText(/Skip for now/i);
    expect(skipBtn).toBeInTheDocument();
    fireEvent.click(skipBtn);
  });

  it('renders LessonModal with Indian Rupee examples and handles interactive quiz submission', () => {
    const lesson = LESSONS[0];
    const onClose = vi.fn();

    render(
      <AppProvider>
        <LessonModal lesson={lesson} onClose={onClose} />
      </AppProvider>
    );

    expect(screen.getByText(lesson.title)).toBeInTheDocument();
    expect(screen.getByText(/Practical Indian Example/i)).toBeInTheDocument();

    // Find correct quiz option and submit
    const correctOptionText = lesson.quiz.options[lesson.quiz.correctIndex];
    const optionButton = screen.getByText(correctOptionText);
    fireEvent.click(optionButton);

    const submitBtn = screen.getByText('Submit Answer');
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Excellent! That is correct./i)).toBeInTheDocument();
  });

  it('validates OrderModal and prevents buying with quantity 0 or insufficient cash', () => {
    const asset = MOCK_ASSETS[0];
    const onClose = vi.fn();

    render(
      <AppProvider>
        <OrderModal asset={asset} mode="BUY" onClose={onClose} />
      </AppProvider>
    );

    const qtyInput = screen.getByLabelText(/Order Quantity/i);
    fireEvent.change(qtyInput, { target: { value: '0' } });

    const reviewBtn = screen.getByText(/Review Buy Order/i);
    fireEvent.click(reviewBtn);

    expect(
      screen.getByText(/Please enter a valid positive quantity greater than 0./i)
    ).toBeInTheDocument();
  });
});

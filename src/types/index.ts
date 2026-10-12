export type UserPersona = 'student' | 'intern' | 'professional';
export type InvestingFamiliarity = 'beginner' | 'intermediate' | 'experienced';

export interface UserProfile {
  id: string;
  name: string;
  persona: UserPersona;
  primaryGoal: string;
  familiarity: InvestingFamiliarity;
  onboardingCompleted: boolean;
  createdAt: string;
}

export type AssetCategory = 
  | 'index_fund' 
  | 'large_cap' 
  | 'flexi_cap' 
  | 'gold' 
  | 'govt_bond' 
  | 'hybrid_fund';

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface PricePoint {
  date: string;
  pricePaise: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  categoryLabel: string;
  riskLevel: RiskLevel;
  currentPricePaise: number;
  previousClosePaise: number;
  changePaise: number;
  changePercent: number;
  description: string;
  expenseRatioPercent?: number;
  minVirtualSipAmountPaise?: number;
  historicalPrices: {
    '7D': PricePoint[];
    '1M': PricePoint[];
    '6M': PricePoint[];
    '1Y': PricePoint[];
  };
  whyBeginnersChooseThis: string;
  keyRiskOrLimitation: string;
}

export interface PortfolioHolding {
  assetId: string;
  assetSymbol: string;
  assetName: string;
  quantity: number;
  averageBuyPricePaise: number;
  totalCostBasisPaise: number;
}

export type TransactionType = 'BUY' | 'SELL';

export interface Transaction {
  id: string;
  timestamp: string;
  type: TransactionType;
  assetId: string;
  assetSymbol: string;
  assetName: string;
  quantity: number;
  pricePaise: number;
  totalAmountPaise: number;
}

export interface PortfolioState {
  initialCashPaise: number;
  virtualCashPaise: number;
  holdings: Record<string, PortfolioHolding>;
  transactions: Transaction[];
  realizedPnLPaise: number;
}

export type GoalCategory = 'emergency' | 'gadget' | 'travel' | 'higher_ed' | 'first_job' | 'general';

export interface SavingsGoal {
  id: string;
  title: string;
  category: GoalCategory;
  targetAmountPaise: number;
  currentSavedPaise: number;
  targetDate?: string;
  notes?: string;
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonContentSection {
  title: string;
  body: string;
  indianExampleRupees?: {
    scenario: string;
    calculation: string;
    keyTakeaway: string;
  };
  riskOrLimitation?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  order: number;
  title: string;
  shortDescription: string;
  readTimeMinutes: number;
  badge: string;
  contentSections: LessonContentSection[];
  quiz: QuizQuestion;
}

export interface AppState {
  profile: UserProfile;
  portfolio: PortfolioState;
  goals: SavingsGoal[];
  completedLessonIds: string[];
  quizScores: Record<string, number>;
  lastSavedAt: string;
}

import { describe, it, expect } from 'vitest';
import {
  executeBuyOrder,
  executeSellOrder,
  calculatePortfolioMetrics,
  validateBuyOrder,
  validateSellOrder,
} from '@/lib/portfolio-math';
import { toPaise, toRupees, formatINR, formatPercentage } from '@/lib/money';
import { Asset, PortfolioState } from '@/types';

const mockAsset: Asset = {
  id: 'test_asset',
  symbol: 'TEST-F',
  name: 'Test Fund',
  category: 'index_fund',
  categoryLabel: 'Index Mutual Fund',
  riskLevel: 'moderate',
  currentPricePaise: 20000, // ₹200.00
  previousClosePaise: 19000,
  changePaise: 1000,
  changePercent: 5.26,
  description: 'Test description',
  whyBeginnersChooseThis: 'Test why',
  keyRiskOrLimitation: 'Test risk',
  historicalPrices: {
    '7D': [],
    '1M': [],
    '6M': [],
    '1Y': [],
  },
};

const createInitialPortfolio = (): PortfolioState => ({
  initialCashPaise: 1000000, // ₹10,000
  virtualCashPaise: 1000000,
  holdings: {},
  transactions: [],
  realizedPnLPaise: 0,
});

describe('Money Utilities', () => {
  it('correctly converts rupees to integer paise and vice versa', () => {
    expect(toPaise(100)).toBe(10000);
    expect(toPaise('245.50')).toBe(24550);
    expect(toPaise(0)).toBe(0);
    expect(toPaise(-50)).toBe(-5000);
    expect(toRupees(24550)).toBe(245.5);
    expect(toRupees(1000000)).toBe(10000);
  });

  it('formats Indian Rupee amounts with standard numbering formatting', () => {
    expect(formatINR(1000000, { isPaise: true })).toBe('₹10,000');
    expect(formatINR(24550, { isPaise: true })).toBe('₹245.50');
    expect(formatINR(10000000, { isPaise: true })).toBe('₹1,00,000');
    expect(formatINR(-50000, { isPaise: true })).toBe('-₹500');
  });

  it('formats percentages with proper sign handling', () => {
    expect(formatPercentage(5.26)).toBe('5.26%');
    expect(formatPercentage(5.26, { includeSign: true })).toBe('+5.26%');
    expect(formatPercentage(-3.1, { includeSign: true })).toBe('-3.10%');
  });
});

describe('Portfolio Order Validations & Math', () => {
  it('initializes with exactly ₹10,000 virtual cash and zero holdings', () => {
    const portfolio = createInitialPortfolio();
    expect(portfolio.virtualCashPaise).toBe(1000000);
    expect(Object.keys(portfolio.holdings).length).toBe(0);
    expect(portfolio.transactions.length).toBe(0);

    const metrics = calculatePortfolioMetrics(portfolio, [mockAsset]);
    expect(metrics.virtualCashPaise).toBe(1000000);
    expect(metrics.totalInvestedPaise).toBe(0);
    expect(metrics.currentHoldingsValuePaise).toBe(0);
    expect(metrics.unrealizedPnLPaise).toBe(0);
    expect(metrics.totalPortfolioValuePaise).toBe(1000000);
    expect(metrics.totalReturnPaise).toBe(0);
  });

  it('rejects invalid, negative, or zero quantities on buy orders', () => {
    const portfolio = createInitialPortfolio();
    expect(validateBuyOrder(portfolio, mockAsset, 0).isValid).toBe(false);
    expect(validateBuyOrder(portfolio, mockAsset, -5).isValid).toBe(false);
    expect(validateBuyOrder(portfolio, mockAsset, NaN).isValid).toBe(false);
    expect(validateBuyOrder(portfolio, mockAsset, Infinity).isValid).toBe(false);
  });

  it('rejects purchases exceeding available virtual cash', () => {
    const portfolio = createInitialPortfolio(); // has ₹10,000 (1,000,000 paise)
    // mockAsset is ₹200 (20,000 paise). 60 units cost ₹12,000 > ₹10,000
    const result = validateBuyOrder(portfolio, mockAsset, 60);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Insufficient virtual cash');

    const execution = executeBuyOrder(portfolio, mockAsset, 60);
    expect(execution.success).toBe(false);
    expect(execution.updatedPortfolio.virtualCashPaise).toBe(1000000); // Unchanged!
  });

  it('successfully executes valid purchase and calculates average cost basis', () => {
    const portfolio = createInitialPortfolio();
    // Buy 10 units at ₹200 = ₹2,000 (200,000 paise)
    const buy1 = executeBuyOrder(portfolio, mockAsset, 10);
    expect(buy1.success).toBe(true);
    expect(buy1.updatedPortfolio.virtualCashPaise).toBe(800000); // ₹8,000 left
    expect(buy1.updatedPortfolio.holdings[mockAsset.id].quantity).toBe(10);
    expect(buy1.updatedPortfolio.holdings[mockAsset.id].averageBuyPricePaise).toBe(20000);
    expect(buy1.updatedPortfolio.holdings[mockAsset.id].totalCostBasisPaise).toBe(200000);
    expect(buy1.updatedPortfolio.transactions.length).toBe(1);
    expect(buy1.updatedPortfolio.transactions[0].type).toBe('BUY');

    // Second purchase: Asset price increases to ₹250 (25,000 paise)
    const updatedAsset = { ...mockAsset, currentPricePaise: 25000 };
    // Buy 10 more units at ₹250 = ₹2,500 (250,000 paise)
    const buy2 = executeBuyOrder(buy1.updatedPortfolio, updatedAsset, 10);
    expect(buy2.success).toBe(true);
    expect(buy2.updatedPortfolio.virtualCashPaise).toBe(550000); // ₹5,500 left
    expect(buy2.updatedPortfolio.holdings[mockAsset.id].quantity).toBe(20);
    // Total cost basis: 200,000 + 250,000 = 450,000 paise.
    // Average buy price = 450,000 / 20 = 22,500 paise (₹225.00)
    expect(buy2.updatedPortfolio.holdings[mockAsset.id].averageBuyPricePaise).toBe(22500);
    expect(buy2.updatedPortfolio.holdings[mockAsset.id].totalCostBasisPaise).toBe(450000);
  });

  it('rejects selling more units than currently held or selling unowned assets', () => {
    const portfolio = createInitialPortfolio();
    // Selling unowned asset
    const validation1 = validateSellOrder(portfolio, mockAsset, 1);
    expect(validation1.isValid).toBe(false);
    expect(validation1.error).toContain('You do not own any units');

    // Buy 5 units first
    const buy = executeBuyOrder(portfolio, mockAsset, 5);
    expect(buy.success).toBe(true);

    // Try selling 6 units
    const validation2 = validateSellOrder(buy.updatedPortfolio, mockAsset, 6);
    expect(validation2.isValid).toBe(false);
    expect(validation2.error).toContain('You currently own only 5 units');
  });

  it('executes sell orders with accurate realized profit/loss calculations', () => {
    const initial = createInitialPortfolio();
    // Buy 10 units at ₹200 (Total ₹2,000)
    const bought = executeBuyOrder(initial, mockAsset, 10);
    expect(bought.success).toBe(true);

    // Asset price rises to ₹300 (30,000 paise)
    const higherAsset = { ...mockAsset, currentPricePaise: 30000 };
    // Sell 4 units at ₹300 = proceeds ₹1,200 (120,000 paise)
    // Cost basis of 4 units = 4 * ₹200 = ₹800 (80,000 paise)
    // Realized profit = ₹1,200 - ₹800 = ₹400 (40,000 paise)
    const sold = executeSellOrder(bought.updatedPortfolio, higherAsset, 4);
    expect(sold.success).toBe(true);
    expect(sold.updatedPortfolio.virtualCashPaise).toBe(800000 + 120000); // 920,000 paise (₹9,200)
    expect(sold.updatedPortfolio.holdings[mockAsset.id].quantity).toBe(6);
    expect(sold.updatedPortfolio.realizedPnLPaise).toBe(40000); // ₹400 profit

    // Sell remaining 6 units
    const soldAll = executeSellOrder(sold.updatedPortfolio, higherAsset, 6);
    expect(soldAll.success).toBe(true);
    expect(soldAll.updatedPortfolio.holdings[mockAsset.id]).toBeUndefined(); // Holding removed when 0
    expect(soldAll.updatedPortfolio.virtualCashPaise).toBe(920000 + 180000); // 1,100,000 paise (₹11,000)
    expect(soldAll.updatedPortfolio.realizedPnLPaise).toBe(100000); // Total ₹1,000 profit
  });

  it('correctly calculates portfolio valuation and unrealized returns', () => {
    const initial = createInitialPortfolio();
    const bought = executeBuyOrder(initial, mockAsset, 10); // Spent ₹2,000 at ₹200

    // Price drops to ₹180 (18,000 paise)
    const droppedAsset = { ...mockAsset, currentPricePaise: 18000 };
    const metrics = calculatePortfolioMetrics(bought.updatedPortfolio, [droppedAsset]);

    expect(metrics.totalInvestedPaise).toBe(200000); // ₹2,000 invested
    expect(metrics.currentHoldingsValuePaise).toBe(180000); // 10 * ₹180 = ₹1,800
    expect(metrics.unrealizedPnLPaise).toBe(-20000); // -₹200 loss
    expect(metrics.unrealizedPnLPercent).toBe(-10); // -10%
    expect(metrics.totalPortfolioValuePaise).toBe(800000 + 180000); // ₹9,800 total value
    expect(metrics.totalReturnPaise).toBe(-20000);
    expect(metrics.totalReturnPercent).toBe(-2);
  });
});

import { Asset } from '@/types';

// Helper to generate deterministic price points
function generateHistory(basePricePaise: number, days: number, volatility: number, trend: number) {
  const points = [];
  const now = new Date('2026-10-10T09:15:00Z');
  let current = basePricePaise;

  for (let i = days; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    // Deterministic pseudo-randomness based on day index
    const pseudoRandom = Math.sin(i * 13.37 + days * 0.1) * volatility + trend;
    current = Math.round(current * (1 + pseudoRandom));
    points.push({
      date: dateStr,
      pricePaise: Math.max(100, current),
    });
  }
  return points;
}

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'nifty50_index',
    symbol: 'NIFTY50-F',
    name: 'Nifty 50 Fictional Index Fund',
    category: 'index_fund',
    categoryLabel: 'Index Mutual Fund',
    riskLevel: 'moderate',
    currentPricePaise: 24550, // ₹245.50
    previousClosePaise: 24200, // ₹242.00
    changePaise: 350,
    changePercent: 1.45,
    expenseRatioPercent: 0.15,
    minVirtualSipAmountPaise: 50000, // ₹500
    description:
      'A simulated index fund mirroring India’s top 50 bluechip companies across banking, IT, energy, and FMCG.',
    whyBeginnersChooseThis:
      'Offers instant diversification across the 50 largest Indian companies at a low expense ratio without needing to pick single stocks.',
    keyRiskOrLimitation:
      'Subject to overall equity market swings. If the Indian stock market declines 15%, this fund will experience a similar drop.',
    historicalPrices: {
      '7D': generateHistory(24200, 7, 0.006, 0.002),
      '1M': generateHistory(23500, 30, 0.008, 0.0015),
      '6M': generateHistory(21800, 180, 0.012, 0.001),
      '1Y': generateHistory(19800, 365, 0.014, 0.0008),
    },
  },
  {
    id: 'bharat_bluechip',
    symbol: 'BTITAN-F',
    name: 'Bharat Titans Bluechip Fictional Fund',
    category: 'large_cap',
    categoryLabel: 'Large-Cap Equity',
    riskLevel: 'moderate',
    currentPricePaise: 18220, // ₹182.20
    previousClosePaise: 18450,
    changePaise: -230,
    changePercent: -1.25,
    expenseRatioPercent: 0.72,
    minVirtualSipAmountPaise: 50000,
    description:
      'An actively managed large-cap fund focusing on established market leaders with solid balance sheets.',
    whyBeginnersChooseThis:
      'Large caps are seasoned businesses with long operating records, generally more resilient during market corrections than smaller companies.',
    keyRiskOrLimitation:
      'Higher fund manager fees (expense ratio) compared to passive index funds, and no guarantee it will outperform index funds over 5+ years.',
    historicalPrices: {
      '7D': generateHistory(18350, 7, 0.007, -0.001),
      '1M': generateHistory(17900, 30, 0.009, 0.001),
      '6M': generateHistory(16400, 180, 0.013, 0.0009),
      '1Y': generateHistory(15200, 365, 0.015, 0.0007),
    },
  },
  {
    id: 'apex_flexicap',
    symbol: 'APEXFLEX-F',
    name: 'Apex Multi-Cap Fictional Fund',
    category: 'flexi_cap',
    categoryLabel: 'Flexi-Cap Equity',
    riskLevel: 'high',
    currentPricePaise: 31040, // ₹310.40
    previousClosePaise: 30500,
    changePaise: 540,
    changePercent: 1.77,
    expenseRatioPercent: 0.85,
    minVirtualSipAmountPaise: 50000,
    description:
      'Flexibly allocates across large, mid, and small Indian enterprises depending on growth opportunities.',
    whyBeginnersChooseThis:
      'Gives exposure to dynamic mid-sized companies with higher expansion potential alongside stable giants.',
    keyRiskOrLimitation:
      'Higher volatility due to mid and small-cap exposure. Can drop significantly during economic slowdowns.',
    historicalPrices: {
      '7D': generateHistory(30400, 7, 0.01, 0.003),
      '1M': generateHistory(29200, 30, 0.012, 0.002),
      '6M': generateHistory(25800, 180, 0.018, 0.0013),
      '1Y': generateHistory(22400, 365, 0.02, 0.0011),
    },
  },
  {
    id: 'inno_tech_stock',
    symbol: 'INNOTECH-F',
    name: 'Indus Cloud & AI Tech Fictional Stock',
    category: 'large_cap',
    categoryLabel: 'Single Stock (Fictional)',
    riskLevel: 'high',
    currentPricePaise: 142000, // ₹1,420.00
    previousClosePaise: 138500,
    changePaise: 3500,
    changePercent: 2.53,
    minVirtualSipAmountPaise: 142000,
    description:
      'Simulated single equity representing a fast-growing Indian enterprise software and cloud provider.',
    whyBeginnersChooseThis:
      'Allows experiencing the dynamics, earnings announcements, and price sensitivity of an individual company stock.',
    keyRiskOrLimitation:
      'Concentration risk: Unlike mutual funds with 50+ companies, if one single company stumbles, your capital is directly at risk.',
    historicalPrices: {
      '7D': generateHistory(137000, 7, 0.015, 0.005),
      '1M': generateHistory(128000, 30, 0.02, 0.003),
      '6M': generateHistory(109000, 180, 0.025, 0.0018),
      '1Y': generateHistory(92000, 365, 0.028, 0.0015),
    },
  },
  {
    id: 'digital_gold',
    symbol: 'DGOLD-F',
    name: 'Digital Gold 24K Fictional Trust',
    category: 'gold',
    categoryLabel: 'Gold / Commodity',
    riskLevel: 'moderate',
    currentPricePaise: 7280, // ₹72.80 per 0.01 gram unit
    previousClosePaise: 7250,
    changePaise: 30,
    changePercent: 0.41,
    minVirtualSipAmountPaise: 10000, // ₹100
    description:
      'Fictional gold trust tracking pure 24 Karat gold prices backed by physical gold vaulting simulation.',
    whyBeginnersChooseThis:
      'Traditional store of value in India; acts as an inflation hedge and counter-balance when equity markets fall.',
    keyRiskOrLimitation:
      'Gold generates no business revenue, dividends, or interest. Returns depend solely on macro price movements.',
    historicalPrices: {
      '7D': generateHistory(7240, 7, 0.003, 0.0006),
      '1M': generateHistory(7120, 30, 0.005, 0.0008),
      '6M': generateHistory(6800, 180, 0.007, 0.0005),
      '1Y': generateHistory(6300, 365, 0.009, 0.0004),
    },
  },
  {
    id: 'sovereign_green_bond',
    symbol: 'SGRNBOND-F',
    name: 'Sovereign Green Bond Fictional Trust',
    category: 'govt_bond',
    categoryLabel: 'Government Debt / Bond',
    riskLevel: 'low',
    currentPricePaise: 101000, // ₹1,010.00
    previousClosePaise: 100900,
    changePaise: 100,
    changePercent: 0.1,
    expenseRatioPercent: 0.08,
    minVirtualSipAmountPaise: 101000,
    description:
      'Simulated debt fund holding AAA-rated Indian sovereign green bonds supporting renewable solar and rail projects.',
    whyBeginnersChooseThis:
      'Lowest volatility asset in the catalog; ideal for understanding predictable bond yields and capital preservation.',
    keyRiskOrLimitation:
      'Modest return potential that may barely beat inflation. Bond prices also fluctuate inversely with RBI repo interest rate changes.',
    historicalPrices: {
      '7D': generateHistory(100800, 7, 0.0008, 0.0002),
      '1M': generateHistory(100400, 30, 0.001, 0.0002),
      '6M': generateHistory(98500, 180, 0.0015, 0.00015),
      '1Y': generateHistory(95500, 365, 0.002, 0.00016),
    },
  },
];

import { Asset, PortfolioHolding, PortfolioState, Transaction } from '@/types';

export interface PortfolioMetrics {
  totalInvestedPaise: number;
  currentHoldingsValuePaise: number;
  unrealizedPnLPaise: number;
  unrealizedPnLPercent: number;
  realizedPnLPaise: number;
  virtualCashPaise: number;
  totalPortfolioValuePaise: number;
  totalReturnPaise: number;
  totalReturnPercent: number;
  holdingsCount: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface OrderExecutionResult {
  success: boolean;
  updatedPortfolio: PortfolioState;
  transaction?: Transaction;
  error?: string;
}

/**
 * Validates a simulated buy order request.
 */
export function validateBuyOrder(
  portfolio: PortfolioState,
  asset: Asset,
  quantity: number
): ValidationResult {
  if (!Number.isFinite(quantity) || isNaN(quantity)) {
    return { isValid: false, error: 'Quantity must be a valid number.' };
  }

  if (quantity <= 0) {
    return { isValid: false, error: 'Quantity must be greater than zero.' };
  }

  // Fractional shares: allow up to 4 decimal places for mutual funds/gold, or integers
  const roundedQty = Number(quantity.toFixed(4));
  if (roundedQty <= 0) {
    return { isValid: false, error: 'Quantity is too small.' };
  }

  const totalCostPaise = Math.round(asset.currentPricePaise * roundedQty);

  if (totalCostPaise <= 0) {
    return { isValid: false, error: 'Total order value must be greater than zero.' };
  }

  if (totalCostPaise > portfolio.virtualCashPaise) {
    return {
      isValid: false,
      error: `Insufficient virtual cash. Needed ₹${(totalCostPaise / 100).toFixed(2)}, available ₹${(portfolio.virtualCashPaise / 100).toFixed(2)}.`,
    };
  }

  return { isValid: true };
}

/**
 * Executes a simulated buy order.
 * Follows an average cost basis accounting model.
 */
export function executeBuyOrder(
  portfolio: PortfolioState,
  asset: Asset,
  quantity: number
): OrderExecutionResult {
  const validation = validateBuyOrder(portfolio, asset, quantity);
  if (!validation.isValid) {
    return { success: false, updatedPortfolio: portfolio, error: validation.error };
  }

  const cleanQty = Number(quantity.toFixed(4));
  const totalCostPaise = Math.round(asset.currentPricePaise * cleanQty);

  const existingHolding = portfolio.holdings[asset.id];
  let updatedHolding: PortfolioHolding;

  if (existingHolding) {
    const newQty = Number((existingHolding.quantity + cleanQty).toFixed(4));
    const newCostBasis = existingHolding.totalCostBasisPaise + totalCostPaise;
    const newAvgPrice = Math.round(newCostBasis / newQty);

    updatedHolding = {
      assetId: asset.id,
      assetSymbol: asset.symbol,
      assetName: asset.name,
      quantity: newQty,
      averageBuyPricePaise: newAvgPrice,
      totalCostBasisPaise: newCostBasis,
    };
  } else {
    updatedHolding = {
      assetId: asset.id,
      assetSymbol: asset.symbol,
      assetName: asset.name,
      quantity: cleanQty,
      averageBuyPricePaise: asset.currentPricePaise,
      totalCostBasisPaise: totalCostPaise,
    };
  }

  const transaction: Transaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    type: 'BUY',
    assetId: asset.id,
    assetSymbol: asset.symbol,
    assetName: asset.name,
    quantity: cleanQty,
    pricePaise: asset.currentPricePaise,
    totalAmountPaise: totalCostPaise,
  };

  const updatedPortfolio: PortfolioState = {
    ...portfolio,
    virtualCashPaise: portfolio.virtualCashPaise - totalCostPaise,
    holdings: {
      ...portfolio.holdings,
      [asset.id]: updatedHolding,
    },
    transactions: [transaction, ...portfolio.transactions],
  };

  return {
    success: true,
    updatedPortfolio,
    transaction,
  };
}

/**
 * Validates a simulated sell order request.
 */
export function validateSellOrder(
  portfolio: PortfolioState,
  asset: Asset,
  quantity: number
): ValidationResult {
  if (!Number.isFinite(quantity) || isNaN(quantity)) {
    return { isValid: false, error: 'Quantity must be a valid number.' };
  }

  if (quantity <= 0) {
    return { isValid: false, error: 'Quantity must be greater than zero.' };
  }

  const cleanQty = Number(quantity.toFixed(4));
  const existingHolding = portfolio.holdings[asset.id];

  if (!existingHolding || existingHolding.quantity <= 0) {
    return { isValid: false, error: `You do not own any units of ${asset.symbol}.` };
  }

  if (cleanQty > existingHolding.quantity + 0.00001) {
    return {
      isValid: false,
      error: `Cannot sell ${cleanQty} units. You currently own only ${existingHolding.quantity} units.`,
    };
  }

  return { isValid: true };
}

/**
 * Executes a simulated sell order.
 * Computes realized PnL based on average buy price.
 */
export function executeSellOrder(
  portfolio: PortfolioState,
  asset: Asset,
  quantity: number
): OrderExecutionResult {
  const validation = validateSellOrder(portfolio, asset, quantity);
  if (!validation.isValid) {
    return { success: false, updatedPortfolio: portfolio, error: validation.error };
  }

  const existingHolding = portfolio.holdings[asset.id]!;
  // Cap at actual owned quantity to prevent micro-fractional float leftovers
  const cleanQty = Math.min(Number(quantity.toFixed(4)), existingHolding.quantity);
  const proceedsPaise = Math.round(asset.currentPricePaise * cleanQty);

  // Realized profit/loss on this sale batch
  const costBasisOfSoldUnitsPaise = Math.round(existingHolding.averageBuyPricePaise * cleanQty);
  const orderRealizedPnLPaise = proceedsPaise - costBasisOfSoldUnitsPaise;

  const remainingQty = Number((existingHolding.quantity - cleanQty).toFixed(4));
  const updatedHoldings = { ...portfolio.holdings };

  if (remainingQty <= 0.0001) {
    delete updatedHoldings[asset.id];
  } else {
    const remainingCostBasis = Math.max(0, existingHolding.totalCostBasisPaise - costBasisOfSoldUnitsPaise);
    updatedHoldings[asset.id] = {
      ...existingHolding,
      quantity: remainingQty,
      totalCostBasisPaise: remainingCostBasis,
      // Average buy price remains unchanged on sale
    };
  }

  const transaction: Transaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    type: 'SELL',
    assetId: asset.id,
    assetSymbol: asset.symbol,
    assetName: asset.name,
    quantity: cleanQty,
    pricePaise: asset.currentPricePaise,
    totalAmountPaise: proceedsPaise,
  };

  const updatedPortfolio: PortfolioState = {
    ...portfolio,
    virtualCashPaise: portfolio.virtualCashPaise + proceedsPaise,
    holdings: updatedHoldings,
    realizedPnLPaise: portfolio.realizedPnLPaise + orderRealizedPnLPaise,
    transactions: [transaction, ...portfolio.transactions],
  };

  return {
    success: true,
    updatedPortfolio,
    transaction,
  };
}

/**
 * Computes live portfolio metrics given the current asset prices.
 */
export function calculatePortfolioMetrics(
  portfolio: PortfolioState,
  assets: Asset[]
): PortfolioMetrics {
  const assetMap = new Map<string, Asset>(assets.map((a) => [a.id, a]));

  let totalInvestedPaise = 0;
  let currentHoldingsValuePaise = 0;
  let holdingsCount = 0;

  for (const holding of Object.values(portfolio.holdings)) {
    if (holding.quantity > 0) {
      holdingsCount++;
      totalInvestedPaise += holding.totalCostBasisPaise;
      const asset = assetMap.get(holding.assetId);
      const currentPrice = asset ? asset.currentPricePaise : holding.averageBuyPricePaise;
      currentHoldingsValuePaise += Math.round(currentPrice * holding.quantity);
    }
  }

  const unrealizedPnLPaise = currentHoldingsValuePaise - totalInvestedPaise;
  const unrealizedPnLPercent =
    totalInvestedPaise > 0 ? (unrealizedPnLPaise / totalInvestedPaise) * 100 : 0;

  const totalPortfolioValuePaise = portfolio.virtualCashPaise + currentHoldingsValuePaise;
  const totalReturnPaise = totalPortfolioValuePaise - portfolio.initialCashPaise;
  const totalReturnPercent =
    portfolio.initialCashPaise > 0 ? (totalReturnPaise / portfolio.initialCashPaise) * 100 : 0;

  return {
    totalInvestedPaise,
    currentHoldingsValuePaise,
    unrealizedPnLPaise,
    unrealizedPnLPercent,
    realizedPnLPaise: portfolio.realizedPnLPaise,
    virtualCashPaise: portfolio.virtualCashPaise,
    totalPortfolioValuePaise,
    totalReturnPaise,
    totalReturnPercent,
    holdingsCount,
  };
}

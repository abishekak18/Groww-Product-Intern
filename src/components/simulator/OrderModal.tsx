'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Asset } from '@/types';
import { formatINR, toPaise, toRupees } from '@/lib/money';
import {
  X,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Wallet,
  ShoppingBag,
} from 'lucide-react';

interface OrderModalProps {
  asset: Asset;
  mode: 'BUY' | 'SELL';
  onClose: () => void;
}

export function OrderModal({ asset, mode: initialMode, onClose }: OrderModalProps) {
  const { state, portfolioMetrics, buyOrder, sellOrder } = useApp();
  const [mode, setMode] = useState<'BUY' | 'SELL'>(initialMode);
  const [inputMode, setInputMode] = useState<'quantity' | 'amount'>('quantity');
  const [quantityInput, setQuantityInput] = useState<string>('1');
  const [amountInput, setAmountInput] = useState<string>(
    (asset.currentPricePaise / 100).toFixed(2)
  );
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const existingHolding = state.portfolio.holdings[asset.id];
  const ownedUnits = existingHolding ? existingHolding.quantity : 0;
  const availableCashRupees = toRupees(state.portfolio.virtualCashPaise);

  // Parse numerical quantity
  const parsedQty = parseFloat(quantityInput);
  const validQty = Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 0;
  const totalCostPaise = Math.round(asset.currentPricePaise * validQty);
  const totalCostRupees = toRupees(totalCostPaise);

  const handleQuantityChange = (val: string) => {
    setQuantityInput(val);
    setErrorMessage(null);
    const q = parseFloat(val);
    if (Number.isFinite(q) && q >= 0) {
      setAmountInput((q * (asset.currentPricePaise / 100)).toFixed(2));
    }
  };

  const handleAmountChange = (val: string) => {
    setAmountInput(val);
    setErrorMessage(null);
    const amt = parseFloat(val);
    if (Number.isFinite(amt) && amt >= 0 && asset.currentPricePaise > 0) {
      const q = amt / (asset.currentPricePaise / 100);
      setQuantityInput(q.toFixed(2));
    }
  };

  const handleValidateAndReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!Number.isFinite(validQty) || validQty <= 0) {
      setErrorMessage('Please enter a valid positive quantity greater than 0.');
      return;
    }

    if (mode === 'BUY') {
      if (totalCostPaise > state.portfolio.virtualCashPaise) {
        setErrorMessage(
          `Insufficient virtual cash. Needed ${formatINR(totalCostPaise)}, available ${formatINR(
            state.portfolio.virtualCashPaise
          )}.`
        );
        return;
      }
    } else {
      if (ownedUnits <= 0) {
        setErrorMessage(`You do not currently own any units of ${asset.symbol}.`);
        return;
      }
      if (validQty > ownedUnits + 0.0001) {
        setErrorMessage(
          `Cannot sell ${validQty} units. You currently own only ${ownedUnits} units.`
        );
        return;
      }
    }

    setIsReviewing(true);
  };

  const handleConfirmOrder = () => {
    setErrorMessage(null);

    if (mode === 'BUY') {
      const result = buyOrder(asset, validQty);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to execute simulated buy.');
        setIsReviewing(false);
        return;
      }
      setSuccessMessage(
        `Successfully simulated purchase of ${validQty} units of ${asset.symbol} for ${formatINR(
          totalCostPaise
        )}!`
      );
    } else {
      const result = sellOrder(asset, validQty);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to execute simulated sale.');
        setIsReviewing(false);
        return;
      }
      setSuccessMessage(
        `Successfully simulated sale of ${validQty} units of ${asset.symbol} for ${formatINR(
          totalCostPaise
        )}!`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg sm:text-xl">{asset.name}</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                {asset.symbol}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Current Simulated Price: <strong className="text-slate-900">{formatINR(asset.currentPricePaise)}</strong>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {successMessage ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Virtual Order Executed!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">{successMessage}</p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="fintech-btn-primary px-6 py-2.5 text-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {/* Mode Selector (BUY / SELL) */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMode('BUY');
                  setIsReviewing(false);
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  mode === 'BUY'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buy (Simulated)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('SELL');
                  setIsReviewing(false);
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  mode === 'SELL'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sell (Simulated)
              </button>
            </div>

            {/* Balances Context */}
            <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Available Cash:</span>
                <strong className="text-slate-900">
                  {formatINR(state.portfolio.virtualCashPaise)}
                </strong>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                <span>You Own:</span>
                <strong className="text-slate-900">{ownedUnits} units</strong>
              </div>
            </div>

            {!isReviewing ? (
              <form onSubmit={handleValidateAndReview} className="space-y-4">
                {/* Input Toggle (Quantity vs Amount) */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <label htmlFor="order-quantity-input">Order Quantity</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInputMode('quantity')}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        inputMode === 'quantity'
                          ? 'bg-slate-800 text-white font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Units
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('amount')}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        inputMode === 'amount'
                          ? 'bg-slate-800 text-white font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Rupees (₹)
                    </button>
                  </div>
                </div>

                {inputMode === 'quantity' ? (
                  <div>
                    <div className="relative">
                      <input
                        id="order-quantity-input"
                        type="number"
                        step="any"
                        min="0"
                        value={quantityInput}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        placeholder="Enter number of units"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base font-semibold"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                        UNITS
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 mt-1.5 px-1">
                      <span>Estimated Value: {formatINR(totalCostPaise)}</span>
                      {mode === 'SELL' && ownedUnits > 0 && (
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(ownedUnits.toString())}
                          className="text-rose-600 hover:underline font-semibold"
                        >
                          Sell All ({ownedUnits})
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                        ₹
                      </span>
                      <input
                        id="order-amount-input"
                        type="number"
                        step="any"
                        min="0"
                        value={amountInput}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="Enter amount in ₹"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base font-semibold"
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 mt-1.5 px-1">
                      <span>Approx. Units: {validQty}</span>
                      {mode === 'BUY' && (
                        <button
                          type="button"
                          onClick={() => handleAmountChange(availableCashRupees.toFixed(2))}
                          className="text-emerald-600 hover:underline font-semibold"
                        >
                          Use Max Cash ({formatINR(state.portfolio.virtualCashPaise)})
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  id="review-order-btn"
                  className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                    mode === 'BUY'
                      ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                      : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                  }`}
                >
                  <span>Review {mode === 'BUY' ? 'Buy' : 'Sell'} Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Confirmation / Review Step */
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Simulated Order Summary
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Action</span>
                    <span
                      className={`font-bold ${mode === 'BUY' ? 'text-emerald-600' : 'text-rose-600'}`}
                    >
                      {mode === 'BUY' ? 'BUY' : 'SELL'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Quantity</span>
                    <span className="font-bold text-slate-900">{validQty} units</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Execution Price</span>
                    <span className="font-bold text-slate-900">
                      {formatINR(asset.currentPricePaise)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 font-bold pt-1">
                    <span className="text-slate-900">
                      {mode === 'BUY' ? 'Total Virtual Cost' : 'Total Virtual Proceeds'}
                    </span>
                    <span
                      className={`text-base ${
                        mode === 'BUY' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {formatINR(totalCostPaise)}
                    </span>
                  </div>
                </div>

                {/* Explicit Sandbox Warning */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Educational Paper Trade:</strong> No real exchange order will be sent. Virtual cash and holdings update locally for practice.
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewing(false)}
                    className="fintech-btn-secondary px-5 py-3 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    id="confirm-simulated-order-btn"
                    onClick={handleConfirmOrder}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                      mode === 'BUY'
                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                        : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Simulated {mode}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

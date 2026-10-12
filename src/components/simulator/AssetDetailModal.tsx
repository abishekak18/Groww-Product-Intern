'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Asset } from '@/types';
import { formatINR, formatPercentage } from '@/lib/money';
import {
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Shield,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface AssetDetailModalProps {
  asset: Asset;
  onClose: () => void;
}

export function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
  const { openBuyModal, openSellModal, state } = useApp();
  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '6M' | '1Y'>('1M');

  const history = asset.historicalPrices[timeframe];
  const chartData = history.map((pt) => ({
    date: pt.date.slice(5), // MM-DD
    price: pt.pricePaise / 100,
  }));

  const existingHolding = state.portfolio.holdings[asset.id];
  const ownedUnits = existingHolding ? existingHolding.quantity : 0;

  const isPositive = asset.changePercent >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800 font-mono">
                {asset.symbol}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {asset.categoryLabel}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  asset.riskLevel === 'low'
                    ? 'bg-blue-50 text-blue-700'
                    : asset.riskLevel === 'moderate'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {asset.riskLevel} Risk
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {asset.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Price & Change Banner */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div>
              <div className="text-xs text-slate-500 font-medium">Current Simulated Price</div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {formatINR(asset.currentPricePaise)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold ${
                  isPositive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {formatINR(asset.changePaise)} ({formatPercentage(asset.changePercent, { includeSign: true })})
                </span>
              </span>
            </div>
          </div>

          {/* Chart Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Simulated Price Performance
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['7D', '1M', '6M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      timeframe === tf
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    formatter={(val: number) => [`₹${val.toFixed(2)}`, 'Price']}
                    labelFormatter={(l) => `Date: ${l}`}
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? '#10B981' : '#F43F5E'}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 italic text-center">
              Deterministic sample chart for educational practice. Does not imply or predict real market performance.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Expense Ratio</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {asset.expenseRatioPercent ? `${asset.expenseRatioPercent}%` : 'N/A (Stock/Bond)'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Min. Virtual SIP</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {asset.minVirtualSipAmountPaise ? formatINR(asset.minVirtualSipAmountPaise) : '₹500'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Asset Class</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                {asset.categoryLabel}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-500 font-medium">Your Holdings</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {ownedUnits} units
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{asset.description}</p>
          </div>

          {/* Why Beginners Choose This */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              <span>Why Beginners Look at This</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              {asset.whyBeginnersChooseThis}
            </p>
          </div>

          {/* Key Risk or Limitation */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Key Risk / Limitation</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              {asset.keyRiskOrLimitation}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="fintech-btn-secondary text-xs sm:text-sm px-4 py-2.5"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            {ownedUnits > 0 && (
              <button
                onClick={() => {
                  onClose();
                  openSellModal(asset);
                }}
                className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all"
              >
                Sell ({ownedUnits} owned)
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                openBuyModal(asset);
              }}
              className="fintech-btn-primary px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20"
            >
              Simulate Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Asset } from '@/types';
import { formatINR, formatPercentage } from '@/lib/money';
import { AssetDetailModal } from './AssetDetailModal';
import { OrderModal } from './OrderModal';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  RefreshCw,
  ShoppingBag,
  History,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export function SimulatorView() {
  const {
    state,
    assets,
    portfolioMetrics,
    selectedAsset,
    setSelectedAsset,
    buyAsset,
    sellAsset,
    openBuyModal,
    openSellModal,
    closeOrderModals,
    resetAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'assets' | 'holdings' | 'history'>('assets');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const holdingsList = Object.values(state.portfolio.holdings).filter((h) => h.quantity > 0);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || asset.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Portfolio Top Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Virtual Portfolio Dashboard
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  ₹10,000 Sandbox
                </span>
              </div>
              <div className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                {formatINR(portfolioMetrics.totalPortfolioValuePaise)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Reset your virtual simulator balance back to initial ₹10,000 and clear all test holdings?'
                    )
                  ) {
                    resetAllData();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 transition-all flex items-center gap-1.5"
                title="Reset virtual portfolio to ₹10,000"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Sandbox</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
            <div>
              <div className="text-xs text-slate-400 font-medium">Virtual Cash</div>
              <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {formatINR(portfolioMetrics.virtualCashPaise)}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-medium">Invested Value</div>
              <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {formatINR(portfolioMetrics.totalInvestedPaise)}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-medium">Holdings Value</div>
              <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {formatINR(portfolioMetrics.currentHoldingsValuePaise)}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-medium">Unrealized P&L</div>
              <div
                className={`text-lg sm:text-xl font-bold mt-0.5 flex items-center gap-1 ${
                  portfolioMetrics.unrealizedPnLPaise >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                <span>{formatINR(portfolioMetrics.unrealizedPnLPaise)}</span>
                <span className="text-xs font-normal">
                  ({formatPercentage(portfolioMetrics.unrealizedPnLPercent, { includeSign: true })})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Inner Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          id="sim-tab-assets"
          onClick={() => setActiveTab('assets')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'assets'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Explore Fictional Assets ({assets.length})</span>
        </button>

        <button
          id="sim-tab-holdings"
          onClick={() => setActiveTab('holdings')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'holdings'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Holdings ({holdingsList.length})</span>
        </button>

        <button
          id="sim-tab-history"
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Transactions ({state.portfolio.transactions.length})</span>
        </button>
      </div>

      {/* Tab 1: Explore Fictional Assets */}
      {activeTab === 'assets' && (
        <div className="space-y-5">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-assets-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets (e.g. Nifty, Green Bond, Gold)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'index_fund', label: 'Index Funds' },
                { id: 'large_cap', label: 'Large Cap / Stocks' },
                { id: 'flexi_cap', label: 'Flexi Cap' },
                { id: 'gold', label: 'Gold' },
                { id: 'govt_bond', label: 'Govt Bonds' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    categoryFilter === c.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssets.map((asset) => {
              const holding = state.portfolio.holdings[asset.id];
              const ownedQty = holding ? holding.quantity : 0;
              const isPositive = asset.changePercent >= 0;

              return (
                <div
                  key={asset.id}
                  className="fintech-card p-5 sm:p-6 flex flex-col justify-between group hover:border-emerald-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {asset.symbol}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
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

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {asset.description}
                    </p>

                    <div className="mt-4 flex items-baseline justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">
                          Simulated Price
                        </div>
                        <div className="text-lg font-extrabold text-slate-900">
                          {formatINR(asset.currentPricePaise)}
                        </div>
                      </div>
                      <span
                        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {formatPercentage(asset.changePercent, { includeSign: true })}
                        </span>
                      </span>
                    </div>

                    {ownedQty > 0 && (
                      <div className="mt-2 text-xs text-slate-500 font-medium px-1">
                        You own: <strong className="text-slate-900">{ownedQty} units</strong>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedAsset(asset)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all"
                    >
                      Charts & Info
                    </button>

                    <div className="flex items-center gap-1.5">
                      {ownedQty > 0 && (
                        <button
                          onClick={() => openSellModal(asset)}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all"
                        >
                          Sell
                        </button>
                      )}
                      <button
                        id={`buy-btn-${asset.symbol.toLowerCase()}`}
                        onClick={() => openBuyModal(asset)}
                        className="fintech-btn-primary text-xs font-bold px-4 py-2"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Holdings */}
      {activeTab === 'holdings' && (
        <div className="space-y-4">
          {holdingsList.length === 0 ? (
            <div className="fintech-card p-12 text-center max-w-md mx-auto space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Holdings Yet</h3>
              <p className="text-xs text-slate-500">
                You currently have ₹10,000 in virtual cash ready to deploy. Explore fictional assets to make your first practice purchase!
              </p>
              <button
                onClick={() => setActiveTab('assets')}
                className="fintech-btn-primary text-xs font-bold px-4 py-2.5 mt-2"
              >
                Browse Assets
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Asset</th>
                    <th className="p-4 text-right">Units</th>
                    <th className="p-4 text-right">Avg. Price</th>
                    <th className="p-4 text-right">Current Price</th>
                    <th className="p-4 text-right">Current Value</th>
                    <th className="p-4 text-right">Unrealized P&L</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {holdingsList.map((holding) => {
                    const asset = assets.find((a) => a.id === holding.assetId);
                    const currentPrice = asset
                      ? asset.currentPricePaise
                      : holding.averageBuyPricePaise;
                    const currentValuePaise = Math.round(currentPrice * holding.quantity);
                    const pnlPaise = currentValuePaise - holding.totalCostBasisPaise;
                    const pnlPercent =
                      holding.totalCostBasisPaise > 0
                        ? (pnlPaise / holding.totalCostBasisPaise) * 100
                        : 0;

                    return (
                      <tr key={holding.assetId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{holding.assetName}</div>
                          <div className="text-xs font-mono text-slate-500">
                            {holding.assetSymbol}
                          </div>
                        </td>
                        <td className="p-4 text-right font-semibold text-slate-900">
                          {holding.quantity}
                        </td>
                        <td className="p-4 text-right text-slate-600">
                          {formatINR(holding.averageBuyPricePaise)}
                        </td>
                        <td className="p-4 text-right font-medium text-slate-900">
                          {formatINR(currentPrice)}
                        </td>
                        <td className="p-4 text-right font-bold text-slate-900">
                          {formatINR(currentValuePaise)}
                        </td>
                        <td className="p-4 text-right">
                          <span
                            className={`font-bold ${
                              pnlPaise >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {formatINR(pnlPaise)} (
                            {formatPercentage(pnlPercent, { includeSign: true })})
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {asset && (
                              <>
                                <button
                                  onClick={() => openBuyModal(asset)}
                                  className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-all"
                                >
                                  Buy
                                </button>
                                <button
                                  onClick={() => openSellModal(asset)}
                                  className="px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200 transition-all"
                                >
                                  Sell
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Transactions */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {state.portfolio.transactions.length === 0 ? (
            <div className="fintech-card p-12 text-center max-w-md mx-auto space-y-3">
              <History className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Transactions Yet</h3>
              <p className="text-xs text-slate-500">
                Your simulated buy and sell orders will appear here chronologically with price and cost basis logs.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Type</th>
                    <th className="p-4">Asset</th>
                    <th className="p-4 text-right">Units</th>
                    <th className="p-4 text-right">Execution Price</th>
                    <th className="p-4 text-right">Total Amount</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {state.portfolio.transactions.map((txn) => {
                    const isBuy = txn.type === 'BUY';
                    const dateFormatted = new Date(txn.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    });

                    return (
                      <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isBuy
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isBuy ? (
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            )}
                            <span>{txn.type}</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{txn.assetName}</div>
                          <div className="text-xs font-mono text-slate-500">{txn.assetSymbol}</div>
                        </td>
                        <td className="p-4 text-right font-semibold text-slate-900">
                          {txn.quantity}
                        </td>
                        <td className="p-4 text-right text-slate-700">
                          {formatINR(txn.pricePaise)}
                        </td>
                        <td className="p-4 text-right font-bold text-slate-900">
                          {formatINR(txn.totalAmountPaise)}
                        </td>
                        <td className="p-4 text-right text-xs text-slate-500">
                          {dateFormatted}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}

      {/* Buy Order Modal */}
      {buyAsset && (
        <OrderModal
          asset={buyAsset}
          mode="BUY"
          onClose={closeOrderModals}
        />
      )}

      {/* Sell Order Modal */}
      {sellAsset && (
        <OrderModal
          asset={sellAsset}
          mode="SELL"
          onClose={closeOrderModals}
        />
      )}
    </div>
  );
}

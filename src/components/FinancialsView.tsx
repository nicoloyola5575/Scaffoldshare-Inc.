import React, { useState } from 'react';
import { DollarSign, TrendingUp, FileSpreadsheet, PieChart, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export const FinancialsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pnl' | 'balance' | 'cashflow' | 'opex'>('pnl');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Financial Statements & Accounting
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time P&L (Income Statement), Balance Sheet, Cash Flow statement, OPEX tracking & Depreciation engine.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <button
          onClick={() => setActiveTab('pnl')}
          className={`border-b-2 py-2.5 px-4 ${
            activeTab === 'pnl'
              ? 'border-orange-600 text-orange-600 dark:text-orange-400'
              : 'border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Income Statement (P&L)
        </button>
        <button
          onClick={() => setActiveTab('balance')}
          className={`border-b-2 py-2.5 px-4 ${
            activeTab === 'balance'
              ? 'border-orange-600 text-orange-600 dark:text-orange-400'
              : 'border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Balance Sheet
        </button>
        <button
          onClick={() => setActiveTab('cashflow')}
          className={`border-b-2 py-2.5 px-4 ${
            activeTab === 'cashflow'
              ? 'border-orange-600 text-orange-600 dark:text-orange-400'
              : 'border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Cash Flow Statement
        </button>
        <button
          onClick={() => setActiveTab('opex')}
          className={`border-b-2 py-2.5 px-4 ${
            activeTab === 'opex'
              ? 'border-orange-600 text-orange-600 dark:text-orange-400'
              : 'border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          OPEX Breakdown
        </button>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {activeTab === 'pnl' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              ScaffoldShare Inc. — Consolidated Income Statement (YTD 2026)
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm bg-slate-50 p-2.5 rounded-xl dark:bg-slate-800/60">
                <span>Gross Equipment Rental Revenue</span>
                <span className="text-emerald-600 dark:text-emerald-400">₱4,250,000</span>
              </div>

              <div className="pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Less: Partner Revenue Share Payouts (40%)</span>
                  <span className="text-red-600">-₱1,700,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                  <span>Net ScaffoldShare Revenue (60%)</span>
                  <span>₱2,550,000</span>
                </div>
              </div>

              <div className="pt-3 font-bold text-slate-900 dark:text-white text-sm bg-slate-50 p-2.5 rounded-xl dark:bg-slate-800/60">
                <span>Operating Expenses (OPEX)</span>
              </div>

              <div className="pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Yard Operations & Logistics Trucking</span>
                  <span>₱480,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Maintenance, Welding Repairs & Refurbishment</span>
                  <span>₱185,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Salaries, Field Safety & Engineering Staff</span>
                  <span>₱620,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Insurance & Safety Compliance Certifications</span>
                  <span>₱95,000</span>
                </div>
              </div>

              <div className="flex justify-between font-black text-slate-900 dark:text-white text-base bg-orange-50 p-3 rounded-xl border border-orange-200 dark:bg-orange-950/40 dark:border-orange-900 mt-4">
                <span className="text-orange-700 dark:text-orange-300">NET OPERATING PROFIT (EBITDA)</span>
                <span className="text-orange-600 dark:text-orange-400">₱1,170,000</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'balance' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Consolidated Balance Sheet
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assets */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm bg-slate-50 p-2 rounded-lg dark:bg-slate-800">
                  ASSETS
                </h4>
                <div className="flex justify-between py-1 border-b">
                  <span>Cash & Bank Equivalents</span>
                  <span className="font-bold">₱3,450,000</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Accounts Receivable (Outstanding Rentals)</span>
                  <span className="font-bold">₱1,880,000</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Scaffolding Equipment Fleet (At Cost)</span>
                  <span className="font-bold">₱18,500,000</span>
                </div>
                <div className="flex justify-between py-1 border-b text-red-600">
                  <span>Less: Accumulated Depreciation</span>
                  <span className="font-bold">-₱2,200,000</span>
                </div>
                <div className="flex justify-between py-2 font-black text-slate-900 dark:text-white text-sm border-t-2">
                  <span>TOTAL ASSETS</span>
                  <span className="text-emerald-600">₱21,630,000</span>
                </div>
              </div>

              {/* Liabilities & Equity */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm bg-slate-50 p-2 rounded-lg dark:bg-slate-800">
                  LIABILITIES & EQUITY
                </h4>
                <div className="flex justify-between py-1 border-b">
                  <span>Accounts Payable (Partner Settlements Due)</span>
                  <span className="font-bold">₱680,000</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Security Deposits Held</span>
                  <span className="font-bold">₱420,000</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Retained Earnings</span>
                  <span className="font-bold">₱12,530,000</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Paid-in Capital</span>
                  <span className="font-bold">₱8,000,000</span>
                </div>
                <div className="flex justify-between py-2 font-black text-slate-900 dark:text-white text-sm border-t-2">
                  <span>TOTAL LIABILITIES & EQUITY</span>
                  <span className="text-emerald-600">₱21,630,000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cashflow' && (
          <div className="space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Cash Flow Statement
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b font-bold">
                <span>Net Cash from Operating Activities</span>
                <span className="text-emerald-600">₱1,450,000</span>
              </div>
              <div className="flex justify-between py-1.5 border-b font-bold">
                <span>Net Cash Used in Equipment Capital Purchases</span>
                <span className="text-red-600">-₱820,000</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 font-black text-sm text-slate-900 dark:text-white">
                <span>NET INCREASE IN CASH</span>
                <span className="text-orange-600">₱630,000</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'opex' && (
          <div className="space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Operating Expense (OPEX) Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Logistics & Freight</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">₱480,000</p>
              </div>
              <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Repairs & Refurbishment</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">₱185,000</p>
              </div>
              <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Salaries & Labor</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">₱620,000</p>
              </div>
              <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Safety & Insurance</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">₱95,000</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

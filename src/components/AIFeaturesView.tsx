import React, { useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, AlertTriangle, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export const AIFeaturesView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('NCR - Metro Manila');
  const [equipmentType, setEquipmentType] = useState('Scaffold Frame');
  const [aiAnalysis, setAiAnalysis] = useState<any>({
    predictedDemand: 'High Surge (+34% Expected Next Quarter)',
    recommendedDailyRate: 52,
    recommendedMonthlyRate: 1050,
    optimalFleetAllocation: 'Reallocate 80 units from Davao Yard to Quezon City Yard for LRT-1 Extension demand.',
    maintenanceRiskScore: 'Low (2.4/10 Risk Index)',
    revenueGrowthForecast: '₱1,850,000 projected monthly rental volume.',
  });

  const handleRunAiForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region,
          equipmentType,
          currentUtilization: 88,
          activeProjectsCount: 14,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">AI Operational Intelligence Engine</h1>
            <p className="mt-0.5 text-xs text-orange-100">
              Powered by Google Gemini 2.5 Server-Side API • Real-Time Scaffolding Demand Forecasting & Dynamic Rental Rates
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">
          Configure Predictive Intelligence Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300">Target Metro Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              <option value="NCR - Metro Manila">NCR - Metro Manila</option>
              <option value="Region IV-A (CALABARZON)">Region IV-A (CALABARZON)</option>
              <option value="Region VII (Metro Cebu)">Region VII (Metro Cebu)</option>
              <option value="Region XI (Davao)">Region XI (Davao)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300">Equipment Class</label>
            <select
              value={equipmentType}
              onChange={(e) => setEquipmentType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              <option value="Scaffold Frame">Scaffold Frame</option>
              <option value="Cross Brace">Cross Brace</option>
              <option value="Catwalk">Catwalk</option>
              <option value="Base Jack">Base Jack</option>
              <option value="Shoring Frame">Shoring Frame</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunAiForecast}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 p-2.5 font-bold text-white shadow hover:bg-orange-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Running Gemini AI Model...' : 'Run Operational Forecast'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Analysis Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Demand Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center gap-2 text-orange-600 font-bold">
            <TrendingUp className="h-5 w-5" />
            <h4 className="text-sm text-slate-900 dark:text-white">Predicted Equipment Demand</h4>
          </div>
          <p className="text-base font-black text-slate-900 dark:text-white">{aiAnalysis.predictedDemand}</p>
          <p className="text-slate-500 text-[11px]">
            Based on active infrastructure contracts (Datem, Megaworld, Megawide) in {region}.
          </p>
        </div>

        {/* Dynamic Pricing Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <DollarSign className="h-5 w-5" />
            <h4 className="text-sm text-slate-900 dark:text-white">Gemini Dynamic Rate Recommendation</h4>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              ₱{aiAnalysis.recommendedDailyRate}/day
            </span>
            <span className="text-xs font-bold text-slate-500">
              ₱{aiAnalysis.recommendedMonthlyRate}/mo
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Optimized for maximum partner revenue share yield without losing competitiveness.
          </p>
        </div>

        {/* Reallocation Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Layers className="h-5 w-5" />
            <h4 className="text-sm text-slate-900 dark:text-white">Optimal Yard Reallocation</h4>
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{aiAnalysis.optimalFleetAllocation}</p>
        </div>
      </div>
    </div>
  );
};

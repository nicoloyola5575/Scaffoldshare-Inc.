import React from 'react';
import { Building2, TrendingUp, DollarSign, Boxes, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { InventoryAsset, SettlementStatement, Partner } from '../types';

interface PartnerPortalViewProps {
  partner: Partner;
  assets: InventoryAsset[];
  settlements: SettlementStatement[];
}

export const PartnerPortalView: React.FC<PartnerPortalViewProps> = ({
  partner,
  assets,
  settlements,
}) => {
  const partnerAssets = assets.filter((a) => a.partnerId === partner.id);
  const partnerSettlements = settlements.filter((s) => s.partnerId === partner.id);

  const totalRevenueGenerated = partnerAssets.reduce((sum, a) => sum + a.revenueGenerated, 0);
  const avgUtilization =
    partnerAssets.length > 0
      ? Math.round(partnerAssets.reduce((sum, a) => sum + a.utilizationPercentage, 0) / partnerAssets.length)
      : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Partner Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-[#080d16] border border-slate-700/80 px-2 py-0.5 inline-flex shadow-sm">
                <img
                  src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
                  alt="SCAFFOLDSHARE INC."
                  className="h-4 w-auto object-contain"
                />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Partner Equipment Fleet Network
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-orange-500" />
              <h1 className="text-2xl font-black">{partner.name}</h1>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Contractor Equipment Owner Portal • Registered Contract Split Rate: <span className="font-bold text-orange-400">{partner.revenueSharePercentage}% Partner / {100 - partner.revenueSharePercentage}% Platform</span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-3 rounded-xl border border-slate-700">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Partner Status</span>
              <p className="text-xs font-bold text-emerald-400">{partner.status}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-t border-slate-800 pt-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Owned Fleet</span>
            <p className="text-lg font-black text-white">{partnerAssets.length} Assets</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Fleet Utilization</span>
            <p className="text-lg font-black text-emerald-400">{avgUtilization}% Active</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Lifetime Earned</span>
            <p className="text-lg font-black text-orange-400">₱{totalRevenueGenerated.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">On-Rent Units</span>
            <p className="text-lg font-black text-blue-400">
              {partnerAssets.filter((a) => a.status === 'On Rent').length} Units
            </p>
          </div>
        </div>
      </div>

      {/* Settlement History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
          Monthly Settlement Payout Statements
        </h3>

        <div className="space-y-3">
          {partnerSettlements.map((stm) => (
            <div
              key={stm.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 text-xs gap-3"
            >
              <div>
                <span className="font-mono font-bold text-orange-600">{stm.statementNumber}</span>
                <p className="font-bold text-slate-900 dark:text-white">{stm.period}</p>
                <p className="text-slate-500">Gross Rental: ₱{stm.grossRentalRevenue.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Net Payout</span>
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400">₱{stm.netPayout.toLocaleString()}</p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>PDF Statement</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Owned Assets List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
          Your Fleet Inventory & Utilization Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-400 dark:bg-slate-800">
              <tr>
                <th className="p-2.5">Asset Tag</th>
                <th className="p-2.5">Type & Model</th>
                <th className="p-2.5">Location Yard</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Revenue Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {partnerAssets.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-2.5 font-mono font-bold text-orange-600">{a.assetId}</td>
                  <td className="p-2.5 font-medium">{a.equipmentType} ({a.brand})</td>
                  <td className="p-2.5">{a.warehouseName}</td>
                  <td className="p-2.5 font-bold">{a.status}</td>
                  <td className="p-2.5 text-right font-bold text-emerald-600">₱{a.revenueGenerated.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

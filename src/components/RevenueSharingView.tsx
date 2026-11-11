import React, { useState } from 'react';
import { PieChart, DollarSign, Download, FileText, CheckCircle2, Building2, Plus, Edit2 } from 'lucide-react';
import { SettlementStatement, Partner } from '../types';

interface RevenueSharingViewProps {
  settlements: SettlementStatement[];
  partners: Partner[];
  onApproveStatement: (id: string) => void;
  onUpdatePartnerSplit: (partnerId: string, newSplit: number) => void;
}

export const RevenueSharingView: React.FC<RevenueSharingViewProps> = ({
  settlements,
  partners,
  onApproveStatement,
  onUpdatePartnerSplit,
}) => {
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [newSplitVal, setNewSplitVal] = useState<number>(40);

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Partner Revenue Sharing & Settlements
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            60% ScaffoldShare / 40% Partner revenue split engine, management fee deductions & monthly payout statements.
          </p>
        </div>
      </div>

      {/* Partner Split Contract Rate Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
          Configured Partner Revenue Split Contracts
        </h3>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{partner.name}</span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {partner.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Revenue Split</span>
                  <p className="font-extrabold text-orange-600 text-sm">
                    {100 - partner.revenueSharePercentage}% Platform / {partner.revenueSharePercentage}% Partner
                  </p>
                </div>

                {editingPartnerId === partner.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={newSplitVal}
                      onChange={(e) => setNewSplitVal(Number(e.target.value))}
                      className="w-14 rounded border p-1 text-xs text-slate-900"
                    />
                    <button
                      onClick={() => {
                        onUpdatePartnerSplit(partner.id, newSplitVal);
                        setEditingPartnerId(null);
                      }}
                      className="rounded bg-orange-600 px-2 py-1 font-bold text-white text-[10px]"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingPartnerId(partner.id);
                      setNewSplitVal(partner.revenueSharePercentage);
                    }}
                    className="text-slate-400 hover:text-orange-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settlement Statements List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
          Monthly Settlement Payout Statements
        </h3>

        <div className="mt-4 space-y-4">
          {settlements.map((stm) => (
            <div
              key={stm.id}
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40 text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-700 gap-2">
                <div>
                  <span className="font-mono font-extrabold text-orange-600 text-sm">{stm.statementNumber}</span>
                  <h4 className="font-bold text-slate-900 dark:text-white">{stm.partnerName}</h4>
                  <p className="text-[10px] text-slate-500">Statement Period: {stm.period}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      stm.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {stm.status}
                  </span>

                  {stm.status === 'Draft' || stm.status === 'Approved' ? (
                    <button
                      onClick={() => onApproveStatement(stm.id)}
                      className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700"
                    >
                      Approve Payout
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Settlement Financial Calculation breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="rounded-lg bg-white p-2.5 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Gross Revenue</span>
                  <p className="font-bold text-slate-900 dark:text-white">₱{stm.grossRentalRevenue.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-white p-2.5 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Partner Share ({stm.partnerSplitPercent}%)</span>
                  <p className="font-bold text-emerald-600">₱{stm.partnerGrossShare.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-white p-2.5 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Management Fee</span>
                  <p className="font-bold text-slate-600 dark:text-slate-400">-₱{stm.managementFee.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-white p-2.5 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Damage Deductions</span>
                  <p className="font-bold text-red-600">-₱{stm.damageCharges.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-2.5 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900">
                  <span className="text-[9px] text-orange-700 dark:text-orange-300 font-bold uppercase">Net Partner Payout</span>
                  <p className="font-black text-orange-600 dark:text-orange-400 text-sm">₱{stm.netPayout.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

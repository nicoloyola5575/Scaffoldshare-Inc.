import React, { useState } from 'react';
import { ShoppingBag, FileText, CheckCircle2, DollarSign, Calendar, Plus, ExternalLink } from 'lucide-react';
import { InventoryAsset, RentalContract } from '../types';

interface CustomerPortalViewProps {
  assets: InventoryAsset[];
  rentals: RentalContract[];
  onAddRental: (r: RentalContract) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  assets,
  rentals,
  onAddRental,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="space-y-6 pb-12">
      {/* Portal Header */}
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white shadow-lg">
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
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-100">
                Contractor Self-Service Portal
              </span>
            </div>
            <h1 className="text-2xl font-black">Datem Construction Inc. — Equipment Desk</h1>
            <p className="mt-1 text-xs text-orange-100">
              Rent certified heavy-duty scaffolding directly from Philippine partner contractors with guaranteed safety inspection.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <ShoppingBag className="h-6 w-6 text-orange-200" />
            <div>
              <span className="text-[10px] font-bold text-orange-100 uppercase">Cart / Reserved Items</span>
              <p className="text-sm font-bold">{cartCount} Items Selected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Scaffolding Catalog Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Certified Available Scaffolding Fleet
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets
            .filter((a) => a.status === 'Available')
            .map((asset) => (
              <div
                key={asset.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-orange-600">{asset.assetId}</span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {asset.inspectionStatus}
                    </span>
                  </div>

                  <h4 className="mt-2 font-bold text-slate-900 dark:text-white text-base">{asset.equipmentType}</h4>
                  <p className="text-xs text-slate-500">{asset.brand} • {asset.model}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/40 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Daily Rental:</span>
                    <span className="font-bold text-emerald-600">₱{asset.dailyRentalRate}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Rate:</span>
                    <span className="font-bold text-emerald-600">₱{asset.monthlyRentalRate}/mo</span>
                  </div>
                </div>

                <button
                  onClick={() => setCartCount((c) => c + 1)}
                  className="w-full rounded-xl bg-orange-600 py-2 text-xs font-bold text-white shadow hover:bg-orange-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Rental Requisition</span>
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Customer Active Contracts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
          Your Active Contracts & Site Deployments
        </h3>

        <div className="space-y-3">
          {rentals.map((r) => (
            <div
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40 gap-2"
            >
              <div>
                <span className="font-mono font-bold text-orange-600">{r.rentalNumber}</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{r.projectTitle}</p>
                <p className="text-[10px] text-slate-500">Address: {r.siteAddress}</p>
              </div>

              <div className="text-right">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {r.stage}
                </span>
                <p className="font-bold text-slate-900 dark:text-white mt-1">₱{r.monthlyTotal.toLocaleString()}/mo</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

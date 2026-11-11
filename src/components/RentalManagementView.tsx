import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Kanban,
  Table as TableIcon,
  Search,
  Building,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { RentalContract, RentalStage, InventoryAsset } from '../types';

interface RentalManagementViewProps {
  rentals: RentalContract[];
  assets: InventoryAsset[];
  onAddRental: (rental: RentalContract) => void;
  onUpdateRentalStage: (id: string, newStage: RentalStage) => void;
}

const STAGES: RentalStage[] = [
  'Inquiry',
  'Quotation',
  'Contract',
  'Active Rental',
  'Return',
  'Settlement',
];

export const RentalManagementView: React.FC<RentalManagementViewProps> = ({
  rentals,
  assets,
  onAddRental,
  onUpdateRentalStage,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Quotation form
  const [customerName, setCustomerName] = useState('Engr. Gilbert Cruz');
  const [customerCompany, setCustomerCompany] = useState('Datem Construction Inc.');
  const [projectTitle, setProjectTitle] = useState('LRT-1 Cavite Extension Package 2');
  const [siteAddress, setSiteAddress] = useState('Bacoor Highway, Cavite');
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.assetId || 'SSF-2026-101');
  const [quantity, setQuantity] = useState(150);
  const [startDate, setStartDate] = useState('2026-08-01');
  const [expectedReturnDate, setExpectedReturnDate] = useState('2026-10-31');

  const filteredRentals = rentals.filter(
    (r) =>
      r.rentalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.assetId === selectedAssetId) || assets[0];

    const monthlyRate = asset ? asset.monthlyRentalRate : 900;
    const monthlyTotal = monthlyRate * quantity;

    const newContract: RentalContract = {
      id: `rnt-${Date.now()}`,
      rentalNumber: `RNT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: `cst-${Date.now()}`,
      customerName,
      customerCompany,
      projectTitle,
      siteAddress,
      region: 'NCR',
      startDate,
      expectedReturnDate,
      stage: 'Quotation',
      items: [
        {
          assetId: selectedAssetId,
          equipmentType: asset ? asset.equipmentType : 'Scaffold Frame',
          quantity,
          dailyRate: asset ? asset.dailyRentalRate : 45,
          monthlyRate: asset ? asset.monthlyRentalRate : 900,
        },
      ],
      dailyTotal: asset ? asset.dailyRentalRate * quantity : 6750,
      monthlyTotal,
      deliveryFee: 15000,
      assemblyFee: 20000,
      deposit: 40000,
      insuranceFee: 10000,
      outstandingBalance: monthlyTotal * 3 + 45000,
      totalPaid: 0,
      contractSigned: false,
      notes: 'Quotation generated via ScaffoldShare IMS.',
    };

    onAddRental(newContract);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Rental Lifecycle Management
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            End-to-end rental workflow from quotation & reservation to dispatch, return & settlement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            <span>New Quotation</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Rental #, Customer, Project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Kanban Pipeline View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageContracts = filteredRentals.filter((r) => r.stage === stage || (stage === 'Active Rental' && r.stage === 'Active Rental'));
            return (
              <div
                key={stage}
                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60 min-w-[240px]"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 dark:border-slate-800">
                  <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300">
                    {stage}
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {stageContracts.length}
                  </span>
                </div>

                <div className="mt-3 space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                  {stageContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-orange-400 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-extrabold text-orange-600">{contract.rentalNumber}</span>
                        <span className="text-[10px] font-bold text-slate-400">{contract.region}</span>
                      </div>

                      <h4 className="mt-1 font-bold text-slate-900 dark:text-white text-xs">{contract.customerCompany}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{contract.projectTitle}</p>

                      <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold">Monthly Rental</span>
                          <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">₱{contract.monthlyTotal.toLocaleString()}</p>
                        </div>

                        {/* Advance stage button */}
                        {stage !== 'Settlement' && (
                          <button
                            onClick={() => {
                              const nextStageMap: Record<string, RentalStage> = {
                                Inquiry: 'Quotation',
                                Quotation: 'Contract',
                                Contract: 'Active Rental',
                                'Active Rental': 'Return',
                                Return: 'Settlement',
                              };
                              onUpdateRentalStage(contract.id, nextStageMap[stage] || 'Active Rental');
                            }}
                            className="rounded-lg bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-300"
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Rental #</th>
                <th className="px-4 py-3">Customer & Project</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Monthly Value</th>
                <th className="px-4 py-3 text-right">Balance Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRentals.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono font-bold text-orange-600">{r.rentalNumber}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 dark:text-white">{r.customerCompany}</span>
                    <p className="text-[10px] text-slate-500">{r.projectTitle}</p>
                  </td>
                  <td className="px-4 py-3">{r.startDate} to {r.expectedReturnDate}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                      {r.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">₱{r.monthlyTotal.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-bold text-red-600">₱{r.outstandingBalance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Quotation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Rental Quotation</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">Customer Company</label>
                <input
                  type="text"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">Project Title & Site</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Equipment Asset</label>
                  <select
                    value={selectedAssetId}
                    onChange={(e) => setSelectedAssetId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {assets.map((a) => (
                      <option key={a.id} value={a.assetId}>
                        {a.assetId} - {a.equipmentType} (₱{a.dailyRentalRate}/day)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Quantity (Units)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Expected Return</label>
                  <input
                    type="date"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-5 py-2 font-bold text-white shadow hover:bg-orange-700"
                >
                  Generate Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

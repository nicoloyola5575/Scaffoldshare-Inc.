import React, { useState } from 'react';
import { Wrench, Plus, AlertCircle, Clock, CheckCircle2, UserCheck, DollarSign } from 'lucide-react';
import { MaintenanceRecord, InventoryAsset } from '../types';

interface MaintenanceViewProps {
  maintenanceRecords: MaintenanceRecord[];
  assets: InventoryAsset[];
  onAddRecord: (rec: MaintenanceRecord) => void;
  onCompleteTicket: (ticketNumber: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  maintenanceRecords,
  assets,
  onAddRecord,
  onCompleteTicket,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.assetId || 'SSF-2026-101');
  const [type, setType] = useState<'Preventive' | 'Corrective' | 'Scheduled' | 'Emergency'>('Corrective');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [technicianName, setTechnicianName] = useState('Master Tech. Arnel Bautista');
  const [laborCost, setLaborCost] = useState(450);
  const [notes, setNotes] = useState('Thread re-pitching and heat treatment for solid screw base jack.');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.assetId === selectedAssetId);

    const newRecord: MaintenanceRecord = {
      id: `mnt-${Date.now()}`,
      ticketNumber: `MNT-2026-${Math.floor(100 + Math.random() * 900)}`,
      assetId: selectedAssetId,
      assetName: asset ? `${asset.equipmentType} (${asset.brand})` : 'Scaffold Base Jack',
      type,
      priority,
      status: 'In Progress',
      partsUsed: [{ name: 'Replacement High Tensile Bolt Set', cost: 280 }],
      laborCost,
      downtimeDays: 2,
      technicianName,
      dateReported: new Date().toISOString().split('T')[0],
      notes,
    };

    onAddRecord(newRecord);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Maintenance & Repair Services
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Work order tickets, preventive maintenance calendar, parts & labor costing and downtime logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          <span>Open Repair Ticket</span>
        </button>
      </div>

      {/* Tickets List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {maintenanceRecords.map((rec) => (
          <div
            key={rec.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-orange-600">{rec.ticketNumber}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    rec.priority === 'Critical'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {rec.priority} Priority
                </span>
              </div>

              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  rec.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}
              >
                {rec.status}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rec.assetName}</h4>
              <p className="text-slate-500">Asset Tag ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{rec.assetId}</span></p>
              <p className="text-slate-500">Type: {rec.type} • Technician: {rec.technicianName}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-[11px] text-center dark:bg-slate-800/40">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Parts Cost</span>
                <p className="font-bold text-slate-900 dark:text-white">
                  ₱{rec.partsUsed.reduce((acc, p) => acc + p.cost, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Labor Cost</span>
                <p className="font-bold text-slate-900 dark:text-white">₱{rec.laborCost.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Downtime</span>
                <p className="font-bold text-amber-600">{rec.downtimeDays} Days</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{rec.notes}"</p>

            {rec.status !== 'Completed' && (
              <button
                onClick={() => onCompleteTicket(rec.ticketNumber)}
                className="w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-colors"
              >
                Mark Repair Completed & Return to Active Inventory
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 pb-3 dark:border-slate-800">
              Create Maintenance Ticket
            </h3>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">Target Asset</label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.assetId}>
                      {a.assetId} - {a.equipmentType} ({a.partnerName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Maintenance Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Preventive">Preventive</option>
                    <option value="Corrective">Corrective</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">Assigned Technician</label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">Issue Description / Spare Parts</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-5 py-2 font-bold text-white shadow hover:bg-orange-700"
                >
                  Open Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

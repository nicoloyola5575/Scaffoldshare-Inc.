import React, { useState } from 'react';
import {
  Warehouse as WhIcon,
  MapPin,
  ArrowRightLeft,
  Boxes,
  Plus,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  History,
  TrendingUp,
} from 'lucide-react';
import { Warehouse, StockMovement, InventoryAsset } from '../types';

interface WarehouseViewProps {
  warehouses: Warehouse[];
  movements: StockMovement[];
  assets: InventoryAsset[];
  onAddMovement: (mvt: StockMovement) => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({
  warehouses,
  movements,
  assets,
  onAddMovement,
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(warehouses[0]?.id || 'wh-01');
  const [activeTab, setActiveTab] = useState<'depots' | 'transfers' | 'cycle_count'>('depots');
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Transfer Form State
  const [fromWh, setFromWh] = useState(warehouses[0]?.name || '');
  const [toWh, setToWh] = useState(warehouses[1]?.name || '');
  const [assetId, setAssetId] = useState(assets[0]?.assetId || 'SSF-2026-101');
  const [quantity, setQuantity] = useState(50);
  const [notes, setNotes] = useState('Inter-depot rebalancing for BGC high demand.');

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.assetId === assetId);

    const newMvt: StockMovement = {
      id: `mvt-${Date.now()}`,
      assetId,
      assetName: asset ? `${asset.equipmentType} (${asset.brand})` : 'Scaffold Frame',
      movementType: 'Transfer',
      fromWarehouse: fromWh,
      toWarehouse: toWh,
      quantity,
      timestamp: new Date().toLocaleString(),
      performedBy: 'Operations Dispatch Officer',
      notes,
    };

    onAddMovement(newMvt);
    setShowTransferModal(false);
  };

  const currentWh = warehouses.find((w) => w.id === selectedWarehouse) || warehouses[0];
  const whAssets = assets.filter((a) => a.warehouseId === currentWh?.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <WhIcon className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Warehouse & Inventory Depots
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Multi-location yard management, inter-depot transfers, cycle counts & stock movement history in PH.
          </p>
        </div>

        <button
          onClick={() => setShowTransferModal(true)}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-700"
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>Inter-Warehouse Transfer</span>
        </button>
      </div>

      {/* Warehouse Depots Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {warehouses.map((wh) => {
          const isSelected = wh.id === selectedWarehouse;
          const capPercent = Math.round((wh.usedCapacityUnits / wh.totalCapacityUnits) * 100);
          return (
            <div
              key={wh.id}
              onClick={() => setSelectedWarehouse(wh.id)}
              className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
                isSelected
                  ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20 dark:border-orange-500 dark:bg-orange-950/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-orange-600 dark:text-orange-400">{wh.code}</span>
                <span className="text-[10px] font-semibold text-slate-500">{wh.region}</span>
              </div>
              <h3 className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{wh.name}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{wh.location}</p>

              <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Capacity Utilization</span>
                  <span className="text-orange-600">{capPercent}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${capPercent}%` }} />
                </div>
                <p className="mt-1 text-[10px] text-slate-400 text-right">
                  {wh.usedCapacityUnits} / {wh.totalCapacityUnits} units stored
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Warehouse Yard Asset Inventory Grid & Layout */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {currentWh.name} — Yard Asset Layout
            </h3>
            <p className="text-xs text-slate-500">Manager: {currentWh.managerName} ({currentWh.contactPhone})</p>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            {whAssets.length} Active Asset Types Stored
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Warehouse Yard Grid Map Simulation */}
          <div className="md:col-span-1 rounded-xl border border-slate-200 bg-slate-900 p-4 text-white">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">Depot Floor Storage Grid</h4>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {['Bay A (Frames)', 'Bay B (Braces)', 'Bay C (Catwalks)', 'Bay D (Jacks)', 'Bay E (Shoring)', 'Bay F (QC Test)'].map(
                (bay, idx) => (
                  <div
                    key={bay}
                    className="flex flex-col items-center justify-center rounded-lg bg-slate-800 p-2.5 text-center text-[10px] border border-slate-700 hover:border-orange-500"
                  >
                    <span className="font-bold text-orange-400">Zone {idx + 1}</span>
                    <span className="text-slate-300 mt-0.5">{bay}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Stored Assets Table */}
          <div className="md:col-span-2 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-400 dark:bg-slate-800">
                <tr>
                  <th className="p-2.5">Asset ID</th>
                  <th className="p-2.5">Type & Brand</th>
                  <th className="p-2.5">Partner Owner</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {whAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">{asset.assetId}</td>
                    <td className="p-2.5 font-medium">{asset.equipmentType} ({asset.brand})</td>
                    <td className="p-2.5">{asset.partnerName}</td>
                    <td className="p-2.5 font-bold text-orange-600">{asset.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stock Movement Audit Log */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
          Recent Stock Movements & Inter-Depot Audit Log
        </h3>

        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {movements.map((mvt) => (
            <div key={mvt.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-orange-600">{mvt.assetId}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {mvt.movementType}
                  </span>
                </div>
                <p className="font-medium text-slate-900 dark:text-white">{mvt.assetName} • {mvt.quantity} units</p>
                <p className="text-[10px] text-slate-500">
                  {mvt.fromWarehouse} → {mvt.toWarehouse}
                </p>
              </div>

              <div className="mt-1 sm:mt-0 text-right text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{mvt.performedBy}</span>
                <p className="text-[10px] text-slate-400">{mvt.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 pb-3 dark:border-slate-800">
              New Inter-Warehouse Stock Transfer
            </h3>

            <form onSubmit={handleCreateTransfer} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">Source Depot</label>
                <select
                  value={fromWh}
                  onChange={(e) => setFromWh(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">Destination Depot</label>
                <select
                  value={toWh}
                  onChange={(e) => setToWh(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Equipment Asset</label>
                  <select
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {assets.map((a) => (
                      <option key={a.id} value={a.assetId}>
                        {a.assetId} - {a.equipmentType}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">Transfer Reason</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-5 py-2 font-bold text-white shadow hover:bg-orange-700"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

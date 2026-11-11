import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  QrCode,
  Building2,
  Warehouse as WhIcon,
  Tag,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  Edit,
  X,
  Printer,
  CheckSquare,
} from 'lucide-react';
import { InventoryAsset, Partner, Warehouse, EquipmentType, AssetCondition, AssetStatus } from '../types';
import { PrintQrLabelsModal } from './PrintQrLabelsModal';

interface InventoryViewProps {
  assets: InventoryAsset[];
  partners: Partner[];
  warehouses: Warehouse[];
  onSelectAsset: (asset: InventoryAsset) => void;
  onAddAsset: (asset: InventoryAsset) => void;
  onOpenQrScanner: () => void;
}

const EQUIPMENT_TYPES: EquipmentType[] = [
  'Scaffold Frame',
  'Cross Brace',
  'Catwalk',
  'Base Jack',
  'U Head Jack',
  'Ladder Frame',
  'Guard Rail',
  'Toe Board',
  'Steel Plank',
  'Adjustable Jack',
  'Shoring Frame',
  'Others',
];

export const InventoryView: React.FC<InventoryViewProps> = ({
  assets,
  partners,
  warehouses,
  onSelectAsset,
  onAddAsset,
  onOpenQrScanner,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Batch QR Code Label Printing & Selection State
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [showPrintQrModal, setShowPrintQrModal] = useState(false);
  const [assetsForPrinting, setAssetsForPrinting] = useState<InventoryAsset[]>([]);

  // New Asset Form state
  const [newAssetId, setNewAssetId] = useState(`SSF-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [newEquipmentType, setNewEquipmentType] = useState<EquipmentType>('Scaffold Frame');
  const [newPartnerId, setNewPartnerId] = useState(partners[0]?.id || 'prt-01');
  const [newWarehouseId, setNewWarehouseId] = useState(warehouses[0]?.id || 'wh-01');
  const [newBrand, setNewBrand] = useState('Aluma-Systems PH');
  const [newModel, setNewModel] = useState('Heavy Duty Walk-Thru 1219x1700mm');
  const [newDailyRate, setNewDailyRate] = useState(45);
  const [newMonthlyRate, setNewMonthlyRate] = useState(900);
  const [newPurchaseCost, setNewPurchaseCost] = useState(3500);

  // Filtering
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPartner = selectedPartner === 'all' || asset.partnerId === selectedPartner;
    const matchesWarehouse = selectedWarehouse === 'all' || asset.warehouseId === selectedWarehouse;
    const matchesType = selectedType === 'all' || asset.equipmentType === selectedType;
    const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus;

    return matchesSearch && matchesPartner && matchesWarehouse && matchesType && matchesStatus;
  });

  // Selection helpers
  const isAllFilteredSelected =
    filteredAssets.length > 0 &&
    filteredAssets.every((a) => selectedAssetIds.includes(a.id));

  const isSomeFilteredSelected =
    filteredAssets.some((a) => selectedAssetIds.includes(a.id)) && !isAllFilteredSelected;

  const toggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      const filteredIdSet = new Set(filteredAssets.map((a) => a.id));
      setSelectedAssetIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const combined = new Set([...selectedAssetIds, ...filteredAssets.map((a) => a.id)]);
      setSelectedAssetIds(Array.from(combined));
    }
  };

  const toggleSelectAsset = (assetId: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const handleOpenBatchPrint = () => {
    if (selectedAssetIds.length > 0) {
      const selected = assets.filter((a) => selectedAssetIds.includes(a.id));
      setAssetsForPrinting(selected);
    } else {
      setAssetsForPrinting(filteredAssets);
    }
    setShowPrintQrModal(true);
  };

  const handlePrintSingleAsset = (asset: InventoryAsset) => {
    setAssetsForPrinting([asset]);
    setShowPrintQrModal(true);
  };

  const handleRemoveAssetFromPrint = (assetId: string) => {
    setAssetsForPrinting((prev) => prev.filter((a) => a.id !== assetId));
    setSelectedAssetIds((prev) => prev.filter((id) => id !== assetId));
  };

  const handleCreateAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const partner = partners.find((p) => p.id === newPartnerId);
    const warehouse = warehouses.find((w) => w.id === newWarehouseId);

    const newAsset: InventoryAsset = {
      id: `ast-${Date.now()}`,
      assetId: newAssetId,
      partnerId: newPartnerId,
      partnerName: partner ? partner.name : 'Villar Construction Equipment Co.',
      warehouseId: newWarehouseId,
      warehouseName: warehouse ? warehouse.name : 'Manila Port Hub (Pier 18 Yard)',
      qrCode: `SCAFFOLD-QR-${newAssetId}`,
      barcode: `880${Math.floor(10000000 + Math.random() * 90000000)}`,
      equipmentType: newEquipmentType,
      brand: newBrand,
      model: newModel,
      purchaseYear: 2026,
      purchaseCost: newPurchaseCost,
      replacementCost: Math.round(newPurchaseCost * 1.2),
      dailyRentalRate: newDailyRate,
      monthlyRentalRate: newMonthlyRate,
      condition: 'Brand New',
      status: 'Available',
      inspectionStatus: 'Passed',
      photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80'],
      notes: 'Newly registered asset with QR code tag assigned.',
      lastInspectedDate: new Date().toISOString().split('T')[0],
      utilizationPercentage: 0,
      revenueGenerated: 0,
    };

    onAddAsset(newAsset);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Module Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Multi-Company Inventory Fleet
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Consolidated partner contractor assets with QR code tracking & warehouse allocation in the Philippines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenBatchPrint}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-sm ${
              selectedAssetIds.length > 0
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold shadow-amber-500/20 ring-2 ring-amber-400/50'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
            }`}
            title="Generate and print printable QR code labels for selected equipment"
          >
            <Printer className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>
              Print QR Labels {selectedAssetIds.length > 0 ? `(${selectedAssetIds.length})` : ''}
            </span>
          </button>

          <button
            onClick={onOpenQrScanner}
            className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300"
          >
            <QrCode className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span>Scan QR Asset</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            <span>Register Asset</span>
          </button>
        </div>
      </div>

      {/* Active Batch Selection & QR Printing Banner */}
      {selectedAssetIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 p-4 shadow-sm dark:bg-amber-950/30">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-sm">
              {selectedAssetIds.length}
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{selectedAssetIds.length} Scaffolding Asset{selectedAssetIds.length > 1 ? 's' : ''} Selected</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full font-bold">
                  Batch Tagging Ready
                </span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ready to generate weatherproof adhesive QR code sheets & physical yard labels.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenBatchPrint}
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Generate & Print QR Labels ({selectedAssetIds.length})</span>
            </button>

            <button
              onClick={() => {
                const allFiltered = filteredAssets.map((a) => a.id);
                setSelectedAssetIds(Array.from(new Set([...selectedAssetIds, ...allFiltered])));
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Select All Filtered ({filteredAssets.length})
            </button>

            <button
              onClick={() => setSelectedAssetIds([])}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Asset ID, partner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
          />
        </div>

        {/* Partner Filter */}
        <select
          value={selectedPartner}
          onChange={(e) => setSelectedPartner(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
        >
          <option value="all">All Owner Partners ({partners.length})</option>
          {partners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Warehouse Filter */}
        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
        >
          <option value="all">All Depots / Warehouses</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        {/* Equipment Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
        >
          <option value="all">All Equipment Types</option>
          {EQUIPMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
        >
          <option value="all">All Asset Statuses</option>
          <option value="Available">Available</option>
          <option value="On Rent">On Rent</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
      </div>

      {/* Assets Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-800/60 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={isAllFilteredSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeFilteredSelected;
                  }}
                  onChange={toggleSelectAllFiltered}
                  className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
                  title="Select / Deselect all filtered equipment for QR label printing"
                />
              </th>
              <th className="px-4 py-3">Asset ID & QR</th>
              <th className="px-4 py-3">Equipment Type & Model</th>
              <th className="px-4 py-3">Partner Owner</th>
              <th className="px-4 py-3">Assigned Yard</th>
              <th className="px-4 py-3">Rates (PHP)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAssetIds.includes(asset.id);
              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-amber-50/70 dark:bg-amber-950/25 border-l-4 border-l-amber-500'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Row Checkbox */}
                  <td
                    className="px-4 py-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectAsset(asset.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by td onClick
                      className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
                      title="Select asset for batch QR label printing"
                    />
                  </td>

                  {/* Asset ID & QR */}
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold dark:bg-orange-950 dark:text-orange-400">
                        <QrCode className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{asset.assetId}</span>
                        <p className="text-[10px] text-slate-400 font-mono">{asset.qrCode}</p>
                      </div>
                    </div>
                  </td>

                  {/* Equipment Type & Brand */}
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{asset.equipmentType}</span>
                    <p className="text-[10px] text-slate-500">{asset.brand} • {asset.model}</p>
                  </td>

                  {/* Partner Owner */}
                  <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    {asset.partnerName}
                  </td>

                  {/* Warehouse */}
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {asset.warehouseName}
                  </td>

                  {/* Rates */}
                  <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                    ₱{asset.dailyRentalRate}/day
                    <span className="block text-[10px] font-normal text-slate-400">₱{asset.monthlyRentalRate}/mo</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        asset.status === 'On Rent'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : asset.status === 'Available'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrintSingleAsset(asset);
                        }}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-amber-100 hover:text-amber-800 dark:hover:bg-amber-950/60 dark:hover:text-amber-300 transition-colors"
                        title="Generate & print printable QR code label for this asset"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset);
                        }}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
                        title="View full asset specifications & details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add New Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Register New Scaffolding Asset</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssetSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Asset Tag ID</label>
                  <input
                    type="text"
                    value={newAssetId}
                    onChange={(e) => setNewAssetId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Equipment Type</label>
                  <select
                    value={newEquipmentType}
                    onChange={(e) => setNewEquipmentType(e.target.value as EquipmentType)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {EQUIPMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Partner Owner</label>
                  <select
                    value={newPartnerId}
                    onChange={(e) => setNewPartnerId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Assigned Depot / Warehouse</label>
                  <select
                    value={newWarehouseId}
                    onChange={(e) => setNewWarehouseId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Brand Manufacturer</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Model / Dimensions</label>
                  <input
                    type="text"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Daily Rate (₱)</label>
                  <input
                    type="number"
                    value={newDailyRate}
                    onChange={(e) => setNewDailyRate(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Monthly Rate (₱)</label>
                  <input
                    type="number"
                    value={newMonthlyRate}
                    onChange={(e) => setNewMonthlyRate(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Purchase Cost (₱)</label>
                  <input
                    type="number"
                    value={newPurchaseCost}
                    onChange={(e) => setNewPurchaseCost(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
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
                  className="rounded-xl bg-orange-600 px-5 py-2 font-bold text-white shadow-md hover:bg-orange-700"
                >
                  Save & Generate QR Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch / Single QR Label Printing Studio Modal */}
      <PrintQrLabelsModal
        isOpen={showPrintQrModal}
        onClose={() => setShowPrintQrModal(false)}
        selectedAssets={assetsForPrinting}
        onRemoveAssetFromPrint={handleRemoveAssetFromPrint}
      />
    </div>
  );
};

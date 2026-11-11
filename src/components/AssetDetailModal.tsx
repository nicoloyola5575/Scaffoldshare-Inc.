import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Building2,
  Warehouse as WhIcon,
  ShieldCheck,
  Wrench,
  FileText,
  DollarSign,
  MapPin,
  Calendar,
  Tag,
  CheckCircle2,
  AlertTriangle,
  History,
  Printer,
  ExternalLink,
} from 'lucide-react';
import { InventoryAsset } from '../types';

interface AssetDetailModalProps {
  asset: InventoryAsset | null;
  onClose: () => void;
  onOpenInspectionModal?: (asset: InventoryAsset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onOpenInspectionModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'qr' | 'history' | 'maintenance'>('overview');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!asset) return;
    QRCode.toDataURL(asset.qrCode, {
      margin: 1,
      width: 256,
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [asset]);

  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400 font-bold">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{asset.assetId}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    asset.status === 'On Rent'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : asset.status === 'Available'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {asset.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {asset.equipmentType} • {asset.brand} ({asset.model})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-white px-6 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`border-b-2 py-3 px-4 transition-colors ${
              activeTab === 'overview'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Asset Profile Overview
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`border-b-2 py-3 px-4 transition-colors ${
              activeTab === 'qr'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            QR Code & Barcode Tag
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`border-b-2 py-3 px-4 transition-colors ${
              activeTab === 'history'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Rental & Deployment Logs
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`border-b-2 py-3 px-4 transition-colors ${
              activeTab === 'maintenance'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Inspections & Repairs
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 dark:text-slate-300">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Photo Banner & Key Attributes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 h-40">
                  <img
                    src={asset.photos[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80'}
                    alt={asset.assetId}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Partner Owner</span>
                    <p className="font-bold text-slate-900 dark:text-white">{asset.partnerName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Warehouse</span>
                    <p className="font-bold text-slate-900 dark:text-white">{asset.warehouseName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Daily Rental Rate</span>
                    <p className="font-black text-emerald-600 dark:text-emerald-400">₱{asset.dailyRentalRate}/day</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Rental Rate</span>
                    <p className="font-black text-emerald-600 dark:text-emerald-400">₱{asset.monthlyRentalRate}/mo</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue Earned</span>
                    <p className="font-black text-slate-900 dark:text-white">₱{asset.revenueGenerated.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Utilization Rate</span>
                    <p className="font-bold text-blue-600 dark:text-blue-400">{asset.utilizationPercentage}%</p>
                  </div>
                </div>
              </div>

              {/* Current Active Rental if On Rent */}
              {asset.status === 'On Rent' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Currently Deployed on Active Rental</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500">Customer:</span>
                      <p className="font-semibold text-slate-900 dark:text-white">{asset.currentCustomerName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Project:</span>
                      <p className="font-semibold text-slate-900 dark:text-white">{asset.currentProjectName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Rental #:</span>
                      <p className="font-semibold text-orange-600">{asset.currentRentalNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Specifications & Financial Valuations */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Purchase Year</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{asset.purchaseYear}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Purchase Cost</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">₱{asset.purchaseCost.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Replacement Value</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">₱{asset.replacementCost.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Condition</span>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{asset.condition}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Notes & Technical Parameters</span>
                <p className="mt-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
                  {asset.notes}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="rounded-2xl border-4 border-slate-900 p-6 bg-white shadow-xl max-w-sm w-full">
                {/* Official ScaffoldShare Inc. Brand Banner on Physical Tag */}
                <div className="mb-4 flex items-center justify-center rounded-xl bg-[#080d16] p-2.5 border border-slate-800">
                  <img
                    src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
                    alt="SCAFFOLDSHARE INC."
                    className="h-6 w-auto object-contain"
                  />
                </div>

                {/* Authentic High-Resolution Scannable QR Code */}
                <div className="mx-auto flex h-48 w-48 items-center justify-center bg-white border-2 border-slate-900 rounded-xl p-2 shadow-sm">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={asset.qrCode}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center font-mono text-xs text-slate-500">
                      Generating QR...
                    </div>
                  )}
                </div>
                <p className="mt-3 font-mono font-bold text-slate-900 text-sm">{asset.qrCode}</p>
                <p className="text-[11px] font-mono text-slate-500">BARCODE: {asset.barcode}</p>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
                  <span>Owner: {asset.partnerName.slice(0, 18)}...</span>
                  <span className="font-semibold text-slate-700">DOLE Compliant</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-700"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Weatherproof QR Tag</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Rental & Project Dispatch History</h4>
              <div className="space-y-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Megaworld Corp • BGC Uptown Tower 3</span>
                    <span className="text-orange-600">RNT-2026-8801</span>
                  </div>
                  <p className="mt-1 text-slate-500">Period: June 1, 2026 – Aug 31, 2026 (Active Deployment)</p>
                  <p className="text-emerald-600 font-semibold mt-0.5">Rate: ₱45/day • Total Billed: ₱16,200</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 opacity-75 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Magsaysay Builders • Manila Bay Tower</span>
                    <span className="text-slate-500">RNT-2025-4122</span>
                  </div>
                  <p className="mt-1 text-slate-500">Period: Feb 10, 2026 – May 15, 2026 (Completed & Returned)</p>
                  <p className="text-slate-600 dark:text-slate-400 font-semibold mt-0.5">Rate: ₱45/day • Returned in Good Condition</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white">Inspections & Quality Control Log</h4>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Inspection Status: {asset.inspectionStatus}
                </span>
              </div>

              <div className="space-y-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Pre-Rental Dispatch Inspection</span>
                    <span className="text-emerald-600">Passed</span>
                  </div>
                  <p className="mt-1 text-slate-500">Inspector: Engr. Benjamin Ramos (Safety Officer) • 2026-05-30</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">Remark: All structural welds and locking pins cleared for BGC high-rise use.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

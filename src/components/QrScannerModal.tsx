import React, { useState } from 'react';
import { QrCode, X, Camera, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { InventoryAsset } from '../types';

interface QrScannerModalProps {
  assets: InventoryAsset[];
  onClose: () => void;
  onScanSuccess: (asset: InventoryAsset) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  assets,
  onClose,
  onScanSuccess,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [scannedAsset, setScannedAsset] = useState<InventoryAsset | null>(null);
  const [scanning, setScanning] = useState(true);

  const handleSimulateScan = (asset: InventoryAsset) => {
    setScannedAsset(asset);
    setScanning(false);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = assets.find(
      (a) =>
        a.assetId.toLowerCase() === manualCode.toLowerCase().trim() ||
        a.qrCode.toLowerCase() === manualCode.toLowerCase().trim() ||
        a.barcode === manualCode.trim()
    );

    if (found) {
      setScannedAsset(found);
      setScanning(false);
    } else {
      alert(`Asset with QR / Barcode "${manualCode}" not found in system.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">QR Code & Barcode Scanner</h3>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {scanning ? (
          <div className="mt-4 space-y-4 text-xs">
            {/* Viewfinder simulation */}
            <div className="relative flex h-52 w-full flex-col items-center justify-center rounded-2xl bg-slate-950 p-4 text-white overflow-hidden border-2 border-dashed border-orange-500/50">
              <div className="absolute inset-8 rounded-xl border-2 border-orange-500 animate-pulse" />
              <Camera className="h-10 w-10 text-orange-500 opacity-80" />
              <p className="mt-2 text-[11px] text-slate-300 font-semibold">Position QR code or Barcode inside viewfinder</p>
              <span className="mt-1 text-[10px] text-orange-400">Mobile Camera Ready • Auto-Focus Active</span>
            </div>

            {/* Quick Click Demo Tags */}
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300">Quick Test Scan (Click to Scan Asset):</p>
              <div className="mt-2 space-y-1.5">
                {assets.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSimulateScan(a)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-orange-500 dark:border-slate-800 dark:bg-slate-800/60"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{a.assetId}</span>
                      <p className="text-[10px] text-slate-500">{a.equipmentType} • {a.warehouseName}</p>
                    </div>
                    <span className="text-[10px] font-bold text-orange-600">Scan →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Entry Fallback */}
            <form onSubmit={handleManualSearch} className="flex gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
              <input
                type="text"
                placeholder="Or type Asset ID / Barcode..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-orange-600 px-4 py-2 font-bold text-white shadow hover:bg-orange-700"
              >
                Scan
              </button>
            </form>
          </div>
        ) : (
          scannedAsset && (
            <div className="mt-4 space-y-4 text-xs">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>Asset QR Tag Validated!</span>
                </div>
                <div className="mt-3 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white text-base">{scannedAsset.assetId}</p>
                  <p>Equipment: {scannedAsset.equipmentType} ({scannedAsset.brand})</p>
                  <p>Partner Owner: {scannedAsset.partnerName}</p>
                  <p>Status: <span className="font-bold uppercase text-orange-600">{scannedAsset.status}</span></p>
                  <p>Assigned Yard: {scannedAsset.warehouseName}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setScanning(true)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
                >
                  Scan Another
                </button>
                <button
                  onClick={() => {
                    onScanSuccess(scannedAsset);
                    onClose();
                  }}
                  className="flex-1 rounded-xl bg-orange-600 py-2.5 font-bold text-white shadow hover:bg-orange-700 flex items-center justify-center gap-1"
                >
                  <span>Open Full Profile</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

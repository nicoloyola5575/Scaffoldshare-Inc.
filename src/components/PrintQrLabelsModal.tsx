import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  QrCode,
  Sliders,
  CheckCircle2,
  Copy,
  Layers,
  ShieldCheck,
  Building2,
  Warehouse as WhIcon,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { InventoryAsset } from '../types';

export type LabelLayoutFormat = 'standard' | 'compact' | 'mini' | 'placard';

interface PrintQrLabelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssets: InventoryAsset[];
  onRemoveAssetFromPrint?: (assetId: string) => void;
}

export const PrintQrLabelsModal: React.FC<PrintQrLabelsModalProps> = ({
  isOpen,
  onClose,
  selectedAssets,
  onRemoveAssetFromPrint,
}) => {
  // Label Customization State
  const [layoutFormat, setLayoutFormat] = useState<LabelLayoutFormat>('standard');
  const [copiesPerAsset, setCopiesPerAsset] = useState<number>(1);
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [showBarcode, setShowBarcode] = useState<boolean>(true);
  const [showPartnerOwner, setShowPartnerOwner] = useState<boolean>(true);
  const [showWarehouse, setShowWarehouse] = useState<boolean>(true);
  const [showDoleBadge, setShowDoleBadge] = useState<boolean>(true);
  const [showWarning, setShowWarning] = useState<boolean>(true);
  const [errorCorrection, setErrorCorrection] = useState<'M' | 'H'>('H');

  // Generated QR Data URLs
  const [qrCodeDataUrls, setQrCodeDataUrls] = useState<Record<string, string>>({});
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(false);

  // Generate QR codes for all selected assets
  useEffect(() => {
    if (!isOpen || selectedAssets.length === 0) return;

    let isMounted = true;
    setIsGeneratingQr(true);

    const generateQrs = async () => {
      const urls: Record<string, string> = {};
      for (const asset of selectedAssets) {
        try {
          const url = await QRCode.toDataURL(asset.qrCode, {
            errorCorrectionLevel: errorCorrection,
            margin: 1,
            width: 256,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          });
          urls[asset.id] = url;
        } catch (err) {
          console.error(`Failed to generate QR for ${asset.assetId}:`, err);
        }
      }
      if (isMounted) {
        setQrCodeDataUrls(urls);
        setIsGeneratingQr(false);
      }
    };

    generateQrs();

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedAssets, errorCorrection]);

  if (!isOpen) return null;

  // Flattened array based on copies
  const totalLabels = selectedAssets.flatMap((asset) =>
    Array.from({ length: copiesPerAsset }, (_, copyIndex) => ({
      asset,
      copyIndex,
    }))
  );

  const handlePrint = () => {
    document.body.classList.add('printing-qr-labels');
    // Allow DOM to apply print classes
    setTimeout(() => {
      window.print();
      // Remove class after print dialog is closed
      setTimeout(() => {
        document.body.classList.remove('printing-qr-labels');
      }, 500);
    }, 150);
  };

  // Grid styling based on format
  const getGridClasses = () => {
    switch (layoutFormat) {
      case 'compact':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3';
      case 'mini':
        return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2';
      case 'placard':
        return 'grid grid-cols-1 gap-6 max-w-xl mx-auto';
      case 'standard':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-6xl max-h-[94vh] rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-md shadow-orange-500/20">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Batch QR Code Label Printing Studio
                </h2>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                  {selectedAssets.length} Assets Selected
                </span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {totalLabels.length} Total Labels ({copiesPerAsset}x)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-resolution weatherproof QR tags & linear barcodes formatted for industrial adhesive sheets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={selectedAssets.length === 0 || isGeneratingQr}
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              <span>Print {totalLabels.length} Labels</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body: Configuration Sidebar + Live Print Sheet Preview */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          {/* Left Controls & Customization Panel */}
          <div className="w-full lg:w-80 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/40 overflow-y-auto space-y-5 text-xs">
            {/* Format selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Label Format & Sheet Template
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLayoutFormat('standard')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    layoutFormat === 'standard'
                      ? 'border-orange-500 bg-orange-50/80 text-orange-950 font-bold dark:border-orange-600 dark:bg-orange-950/40 dark:text-orange-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                  }`}
                >
                  <p className="text-xs">Standard Tag</p>
                  <span className="text-[10px] text-slate-500 font-normal">2 per row • 3.5" x 2.5"</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutFormat('compact')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    layoutFormat === 'compact'
                      ? 'border-orange-500 bg-orange-50/80 text-orange-950 font-bold dark:border-orange-600 dark:bg-orange-950/40 dark:text-orange-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                  }`}
                >
                  <p className="text-xs">Compact Badge</p>
                  <span className="text-[10px] text-slate-500 font-normal">3 per row • 2.5" x 1.75"</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutFormat('mini')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    layoutFormat === 'mini'
                      ? 'border-orange-500 bg-orange-50/80 text-orange-950 font-bold dark:border-orange-600 dark:bg-orange-950/40 dark:text-orange-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                  }`}
                >
                  <p className="text-xs">Mini Equipment Strip</p>
                  <span className="text-[10px] text-slate-500 font-normal">4 per row • 1.75" x 1"</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutFormat('placard')}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    layoutFormat === 'placard'
                      ? 'border-orange-500 bg-orange-50/80 text-orange-950 font-bold dark:border-orange-600 dark:bg-orange-950/40 dark:text-orange-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                  }`}
                >
                  <p className="text-xs">Pallet / Yard Placard</p>
                  <span className="text-[10px] text-slate-500 font-normal">Large 5" x 7" Crate</span>
                </button>
              </div>
            </div>

            {/* Copies per asset */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Copies per Equipment Unit
              </label>
              <div className="flex gap-2">
                {[1, 2, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCopiesPerAsset(num)}
                    className={`flex-1 rounded-xl py-2 font-bold text-xs border transition-all ${
                      copiesPerAsset === num
                        ? 'border-orange-500 bg-orange-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {num}x {num > 1 ? '(Dual Side)' : ''}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                Recommended 2x for dual-side tagging on scaffolding frames & ledger pipes.
              </p>
            </div>

            {/* Label Elements Toggles */}
            <div className="space-y-2.5 border-t border-slate-200 pt-4 dark:border-slate-800">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Label Tag Elements
              </label>

              <label className="flex items-center justify-between cursor-pointer rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300 font-medium">ScaffoldShare Inc. Logo</span>
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Linear Barcode (1D)</span>
                <input
                  type="checkbox"
                  checked={showBarcode}
                  onChange={(e) => setShowBarcode(e.target.checked)}
                  className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Partner Owner Name</span>
                <input
                  type="checkbox"
                  checked={showPartnerOwner}
                  onChange={(e) => setShowPartnerOwner(e.target.checked)}
                  className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Assigned Depot / Hub</span>
                <input
                  type="checkbox"
                  checked={showWarehouse}
                  onChange={(e) => setShowWarehouse(e.target.checked)}
                  className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300 font-medium">DOLE Safety Certified Stamp</span>
                <input
                  type="checkbox"
                  checked={showDoleBadge}
                  onChange={(e) => setShowDoleBadge(e.target.checked)}
                  className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Tamper Warning Notice</span>
                <input
                  type="checkbox"
                  checked={showWarning}
                  onChange={(e) => setShowWarning(e.target.checked)}
                  className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
                />
              </label>
            </div>

            {/* Rugged Outdoor QR Setting */}
            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                QR Outdoor Resiliency (ECC)
              </label>
              <select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value as 'M' | 'H')}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                <option value="H">High (30% Damage/Dirt Recovery - Rugged Yard)</option>
                <option value="M">Medium (15% Recovery - Standard)</option>
              </select>
            </div>

            {/* Selected Assets Quick List */}
            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Target Units ({selectedAssets.length})
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {selectedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between rounded-lg bg-white p-2 border border-slate-200 dark:border-slate-800 dark:bg-slate-800/80 text-[11px]"
                  >
                    <div className="truncate mr-2">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{asset.assetId}</p>
                      <p className="text-[10px] text-slate-400 truncate">{asset.equipmentType}</p>
                    </div>
                    {onRemoveAssetFromPrint && selectedAssets.length > 1 && (
                      <button
                        onClick={() => onRemoveAssetFromPrint(asset.id)}
                        className="text-slate-400 hover:text-red-500 p-0.5"
                        title="Remove from print list"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Sheet Preview Canvas */}
          <div className="flex-1 bg-slate-100/90 dark:bg-slate-950/80 p-4 sm:p-6 overflow-y-auto">
            {/* Sheet Instructions Bar */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-white p-3.5 border border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Print Preview: Industrial Weatherproof Adhesive Layout
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Tip: Set browser print margins to "Minimum" or "None" for 100% border alignment.
              </span>
            </div>

            {/* The Sheet Container */}
            <div className="mx-auto rounded-xl bg-white p-6 shadow-xl border border-slate-300 text-slate-900">
              <div className={getGridClasses()}>
                {totalLabels.map(({ asset, copyIndex }, idx) => {
                  const qrUrl = qrCodeDataUrls[asset.id];

                  if (layoutFormat === 'mini') {
                    // Mini equipment strip
                    return (
                      <div
                        key={`${asset.id}-${copyIndex}-${idx}`}
                        className="rounded-lg border-2 border-slate-900 p-2 bg-white flex items-center gap-2.5 print-card-break relative overflow-hidden"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-white flex items-center justify-center">
                          {qrUrl ? (
                            <img src={qrUrl} alt={asset.qrCode} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[8px] font-mono">
                              QR...
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 text-[10px]">
                          <p className="font-black text-slate-900 leading-tight truncate">{asset.assetId}</p>
                          <p className="text-[9px] text-slate-600 truncate">{asset.equipmentType}</p>
                          <p className="font-mono text-[8px] text-slate-500 truncate">{asset.qrCode}</p>
                        </div>
                      </div>
                    );
                  }

                  if (layoutFormat === 'compact') {
                    // Compact 3-col badge
                    return (
                      <div
                        key={`${asset.id}-${copyIndex}-${idx}`}
                        className="rounded-xl border-2 border-slate-900 p-3 bg-white flex flex-col justify-between print-card-break relative"
                      >
                        {showLogo && (
                          <div className="mb-2 flex items-center justify-between border-b border-slate-900 pb-1.5">
                            <img
                              src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
                              alt="SCAFFOLDSHARE INC."
                              className="h-3.5 w-auto object-contain bg-[#080d16] px-1.5 py-0.5 rounded"
                            />
                            <span className="text-[8px] font-extrabold uppercase text-slate-700">
                              DOLE PASSED
                            </span>
                          </div>
                        )}

                        <div className="flex gap-2.5 items-center">
                          <div className="flex-shrink-0 w-16 h-16 bg-white border border-slate-200 p-0.5 rounded">
                            {qrUrl ? (
                              <img src={qrUrl} alt={asset.qrCode} className="w-full h-full object-contain" />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[9px] font-mono">
                                Generating...
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-[8px] uppercase tracking-wider font-bold text-slate-400">
                              ASSET ID
                            </span>
                            <p className="font-black text-xs text-slate-900 leading-tight">{asset.assetId}</p>
                            <p className="text-[10px] font-semibold text-slate-700 truncate">{asset.equipmentType}</p>
                            {showPartnerOwner && (
                              <p className="text-[9px] text-slate-500 truncate mt-0.5">
                                Owner: {asset.partnerName.slice(0, 16)}
                              </p>
                            )}
                          </div>
                        </div>

                        {showBarcode && (
                          <div className="mt-2 pt-1.5 border-t border-slate-200 text-center">
                            <div className="flex justify-center items-end h-5 gap-0.5">
                              {Array.from({ length: 28 }).map((_, bIdx) => (
                                <div
                                  key={bIdx}
                                  className="bg-black"
                                  style={{
                                    width: bIdx % 3 === 0 ? '2px' : '1px',
                                    height: bIdx % 5 === 0 ? '100%' : '80%',
                                  }}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-[8px] tracking-wider text-slate-600 block">
                              {asset.barcode}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (layoutFormat === 'placard') {
                    // Large 5" x 7" Crate / Pallet Placard
                    return (
                      <div
                        key={`${asset.id}-${copyIndex}-${idx}`}
                        className="rounded-3xl border-4 border-slate-950 p-6 bg-white print-card-break relative space-y-4"
                      >
                        {showLogo && (
                          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                            <div className="bg-[#080d16] px-3 py-1.5 rounded-xl border border-slate-800">
                              <img
                                src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
                                alt="SCAFFOLDSHARE INC."
                                className="h-6 w-auto object-contain"
                              />
                            </div>
                            <span className="rounded bg-slate-900 px-2 py-1 text-xs font-black text-white">
                              PALLET / YARD PLACARD
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="flex-shrink-0 w-44 h-44 bg-white border-2 border-slate-900 p-2 rounded-2xl shadow-sm">
                            {qrUrl ? (
                              <img src={qrUrl} alt={asset.qrCode} className="w-full h-full object-contain" />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center font-mono text-xs">
                                Generating QR...
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2 text-center sm:text-left">
                            <span className="inline-block rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                              {asset.equipmentType}
                            </span>
                            <h3 className="text-2xl font-black text-slate-950 tracking-tight">{asset.assetId}</h3>
                            <p className="font-mono text-xs font-bold text-slate-600">{asset.qrCode}</p>
                            <p className="text-xs text-slate-600">
                              <span className="font-bold">Specs:</span> {asset.brand} • {asset.model}
                            </p>
                            {showPartnerOwner && (
                              <p className="text-xs text-slate-600">
                                <span className="font-bold">Partner Owner:</span> {asset.partnerName}
                              </p>
                            )}
                            {showWarehouse && (
                              <p className="text-xs text-slate-600">
                                <span className="font-bold">Storage Depot:</span> {asset.warehouseName}
                              </p>
                            )}
                          </div>
                        </div>

                        {showBarcode && (
                          <div className="border-t-2 border-slate-900 pt-3 text-center">
                            <div className="flex justify-center items-end h-8 gap-0.5">
                              {Array.from({ length: 48 }).map((_, bIdx) => (
                                <div
                                  key={bIdx}
                                  className="bg-black"
                                  style={{
                                    width: bIdx % 4 === 0 ? '3px' : bIdx % 2 === 0 ? '2px' : '1px',
                                    height: bIdx % 6 === 0 ? '100%' : '85%',
                                  }}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-xs tracking-widest text-slate-800 block mt-1">
                              {asset.barcode}
                            </span>
                          </div>
                        )}

                        {showWarning && (
                          <div className="rounded-xl border border-slate-300 bg-slate-50 p-2 text-center text-[10px] font-bold text-slate-700">
                            PROPERTY OF SCAFFOLDSHARE PARTNER NETWORK • WEATHERPROOF DOLE D.O. 128-13
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Standard Heavy Duty Weatherproof Scaffold Tag (Default)
                  return (
                    <div
                      key={`${asset.id}-${copyIndex}-${idx}`}
                      className="rounded-2xl border-3 border-slate-950 p-4 bg-white shadow-sm flex flex-col justify-between print-card-break relative overflow-hidden"
                    >
                      {/* Top Brand & Compliance Bar */}
                      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-3">
                        {showLogo ? (
                          <div className="bg-[#080d16] px-2 py-1 rounded-lg border border-slate-800">
                            <img
                              src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
                              alt="SCAFFOLDSHARE INC."
                              className="h-4.5 w-auto object-contain"
                            />
                          </div>
                        ) : (
                          <span className="font-black text-xs tracking-tight text-slate-950 uppercase">
                            SCAFFOLDSHARE INC.
                          </span>
                        )}

                        {showDoleBadge && (
                          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-600 px-2 py-0.5 rounded text-[9px] font-extrabold text-emerald-800">
                            <ShieldCheck className="h-3 w-3 text-emerald-700" />
                            <span>DOLE COMPLIANT • PASSED</span>
                          </div>
                        )}
                      </div>

                      {/* Main Center Section: QR + Asset Meta */}
                      <div className="flex items-center gap-3.5">
                        {/* High-res Scannable QR Code */}
                        <div className="flex-shrink-0 w-24 h-24 bg-white border-2 border-slate-950 p-1 rounded-xl shadow-xs">
                          {qrUrl ? (
                            <img
                              src={qrUrl}
                              alt={asset.qrCode}
                              className="w-full h-full object-contain"
                              title={`Scan: ${asset.qrCode}`}
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center font-mono text-[9px]">
                              Rendering...
                            </div>
                          )}
                        </div>

                        {/* Text Metadata */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                              EQUIPMENT ASSET ID
                            </span>
                            <h4 className="text-base font-black text-slate-950 leading-tight">
                              {asset.assetId}
                            </h4>
                          </div>

                          <p className="text-xs font-bold text-slate-800 truncate">
                            {asset.equipmentType}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            QR: {asset.qrCode}
                          </p>

                          {showPartnerOwner && (
                            <p className="text-[10px] text-slate-600 truncate">
                              <span className="font-semibold text-slate-800">Owner:</span> {asset.partnerName}
                            </p>
                          )}

                          {showWarehouse && (
                            <p className="text-[10px] text-slate-600 truncate">
                              <span className="font-semibold text-slate-800">Yard:</span> {asset.warehouseName.slice(0, 22)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Linear Barcode representation */}
                      {showBarcode && (
                        <div className="mt-3 pt-2 border-t border-slate-200 text-center">
                          <div className="flex justify-center items-end h-6 gap-0.5">
                            {Array.from({ length: 36 }).map((_, bIdx) => (
                              <div
                                key={bIdx}
                                className="bg-black"
                                style={{
                                  width: bIdx % 4 === 0 ? '2.5px' : bIdx % 2 === 0 ? '1.5px' : '1px',
                                  height: bIdx % 6 === 0 ? '100%' : '80%',
                                }}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-[9px] tracking-widest text-slate-700 block mt-0.5">
                            BARCODE: {asset.barcode}
                          </span>
                        </div>
                      )}

                      {/* Weatherproof & Security Warning Footer */}
                      {showWarning && (
                        <div className="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-500 font-medium">
                          <span>PROPERTY OF SCAFFOLDSHARE PH</span>
                          <span className="font-bold text-slate-700">DO NOT REMOVE / TAMPER</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ready for standard letter or A4 weather-resistant label paper.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              disabled={selectedAssets.length === 0 || isGeneratingQr}
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-50"
            >
              <Printer className="h-4 w-4" />
              <span>Print {totalLabels.length} Labels Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Isolated Print Mount Point for seamless clean paper printouts */}
      <div id="qr-print-isolated-sheet" className="hidden">
        <div className={getGridClasses()}>
          {totalLabels.map(({ asset, copyIndex }, idx) => {
            const qrUrl = qrCodeDataUrls[asset.id];
            return (
              <div
                key={`print-${asset.id}-${copyIndex}-${idx}`}
                className="rounded-2xl border-3 border-black p-4 bg-white print-card-break relative mb-4"
                style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              >
                {/* Brand Bar */}
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  {showLogo ? (
                    <div className="bg-[#080d16] px-2 py-1 rounded-lg">
                      <img
                        src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
                        alt="SCAFFOLDSHARE INC."
                        className="h-5 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <span className="font-black text-xs text-black uppercase">SCAFFOLDSHARE INC.</span>
                  )}
                  {showDoleBadge && (
                    <span className="border border-black px-2 py-0.5 rounded text-[9px] font-black">
                      DOLE COMPLIANT • PASSED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 border-2 border-black p-1 rounded-xl">
                    {qrUrl && <img src={qrUrl} alt={asset.qrCode} className="w-full h-full object-contain" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] font-black uppercase text-gray-500">ASSET ID</p>
                    <h3 className="text-base font-black text-black">{asset.assetId}</h3>
                    <p className="text-xs font-bold text-black">{asset.equipmentType}</p>
                    <p className="text-[10px] font-mono text-gray-700">QR: {asset.qrCode}</p>
                    {showPartnerOwner && (
                      <p className="text-[10px] text-gray-800">Owner: {asset.partnerName}</p>
                    )}
                    {showWarehouse && (
                      <p className="text-[10px] text-gray-800">Yard: {asset.warehouseName}</p>
                    )}
                  </div>
                </div>

                {showBarcode && (
                  <div className="mt-3 pt-2 border-t border-gray-300 text-center">
                    <div className="flex justify-center items-end h-6 gap-0.5">
                      {Array.from({ length: 36 }).map((_, bIdx) => (
                        <div
                          key={bIdx}
                          className="bg-black"
                          style={{
                            width: bIdx % 4 === 0 ? '2.5px' : bIdx % 2 === 0 ? '1.5px' : '1px',
                            height: bIdx % 6 === 0 ? '100%' : '80%',
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[9px] tracking-widest text-black block mt-0.5">
                      BARCODE: {asset.barcode}
                    </span>
                  </div>
                )}

                {showWarning && (
                  <div className="mt-2 pt-1 border-t border-gray-300 flex justify-between text-[8px] font-bold text-gray-600">
                    <span>PROPERTY OF SCAFFOLDSHARE PH</span>
                    <span>DO NOT REMOVE</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

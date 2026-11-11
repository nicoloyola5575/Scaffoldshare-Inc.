import React, { useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  FileSignature,
  Wrench,
  Search,
} from 'lucide-react';
import { InspectionRecord, InventoryAsset } from '../types';

interface InspectionViewProps {
  inspections: InspectionRecord[];
  assets: InventoryAsset[];
  onAddInspection: (inspection: InspectionRecord) => void;
}

export const InspectionView: React.FC<InspectionViewProps> = ({
  inspections,
  assets,
  onAddInspection,
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.assetId || 'SSF-2026-101');
  const [inspectionType, setInspectionType] = useState<'Initial' | 'Pre Rental' | 'Delivery' | 'Return' | 'Maintenance' | 'Safety'>('Pre Rental');
  const [inspectorName, setInspectorName] = useState('Engr. Benjamin Ramos (Safety Officer)');
  const [result, setResult] = useState<'Pass' | 'Fail'>('Pass');
  const [recommendations, setRecommendations] = useState('All structural weld joints and locking pins verified for high-rise deployment.');

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.assetId === selectedAssetId);

    const createdTicketId = result === 'Fail' ? `MNT-2026-${Math.floor(100 + Math.random() * 900)}` : undefined;

    const newInsp: InspectionRecord = {
      id: `isp-${Date.now()}`,
      inspectionNumber: `INSP-2026-${Math.floor(400 + Math.random() * 500)}`,
      assetId: selectedAssetId,
      assetName: asset ? `${asset.equipmentType} (${asset.brand})` : 'Scaffold Frame',
      inspectionType,
      inspectorName,
      date: new Date().toISOString().split('T')[0],
      result,
      checklist: [
        { item: 'Structural Weld Integrity & Alignment', passed: result === 'Pass' },
        { item: 'Locking Pin & Spring Lock Mechanism', passed: true },
        { item: 'Galvanized Surface Coating & Rust Inspection', passed: true },
        { item: 'Load Bearing Stress Check', passed: result === 'Pass', remark: result === 'Fail' ? 'Minor stress fracture observed on leg brace' : undefined },
      ],
      recommendations,
      photos: ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80'],
      digitalSignature: inspectorName,
      createdMaintenanceTicketId: createdTicketId,
    };

    onAddInspection(newInsp);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Inspections & Quality Control
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Safety checklists, pre-rental inspections, return quality assessments & auto-maintenance triggers.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          <span>New Inspection Audit</span>
        </button>
      </div>

      {/* Inspections List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inspections.map((isp) => (
          <div
            key={isp.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-orange-600">{isp.inspectionNumber}</span>
                <span className="ml-2 text-xs font-semibold text-slate-500">• {isp.inspectionType}</span>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                  isp.result === 'Pass'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                }`}
              >
                {isp.result === 'Pass' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {isp.result === 'Pass' ? 'PASSED' : 'FAILED - REPAIR REQUIRED'}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white text-sm">{isp.assetName}</p>
              <p className="text-slate-500">Asset Tag ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{isp.assetId}</span></p>
              <p className="text-slate-500">Inspector: {isp.inspectorName} ({isp.date})</p>
            </div>

            {/* Checklist items */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40 text-xs space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300">Safety Checklist Items:</span>
              {isp.checklist.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-300">{c.item}</span>
                  <span className={c.passed ? 'font-bold text-emerald-600' : 'font-bold text-red-600'}>
                    {c.passed ? '✓ Pass' : '✗ Failed'}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{isp.recommendations}"</p>

            {isp.createdMaintenanceTicketId && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  <Wrench className="h-4 w-4 text-red-600" />
                  <span>Auto-Created Maintenance Ticket: {isp.createdMaintenanceTicketId}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Inspection Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 pb-3 dark:border-slate-800">
              Submit Quality & Safety Inspection
            </h3>

            <form onSubmit={handleCreateInspection} className="mt-4 space-y-3 text-xs">
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
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Inspection Type</label>
                  <select
                    value={inspectionType}
                    onChange={(e) => setInspectionType(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Initial">Initial Intake</option>
                    <option value="Pre Rental">Pre Rental Dispatch</option>
                    <option value="Delivery">On-Site Delivery</option>
                    <option value="Return">Customer Return</option>
                    <option value="Safety">Safety Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Overall Result</label>
                  <select
                    value={result}
                    onChange={(e) => setResult(e.target.value as 'Pass' | 'Fail')}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white font-bold"
                  >
                    <option value="Pass">Pass (Cleared)</option>
                    <option value="Fail">Fail (Trigger Repair Ticket)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">Inspector Name / Officer</label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">Recommendations / Findings</label>
                <textarea
                  rows={2}
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-5 py-2 font-bold text-white shadow hover:bg-orange-700"
                >
                  Submit Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

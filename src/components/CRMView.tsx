import React, { useState } from 'react';
import { RefreshCw, Plus, Users, Building, Kanban, ExternalLink, CheckCircle2, PhoneCall } from 'lucide-react';
import { CRMLead, Partner } from '../types';

interface CRMViewProps {
  leads: CRMLead[];
  partners: Partner[];
  onAddLead: (lead: CRMLead) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({ leads, partners, onAddLead }) => {
  const [synced, setSynced] = useState(true);
  const [activeTab, setActiveTab] = useState<'sales' | 'partners'>('sales');

  const triggerGHLSync = () => {
    setSynced(false);
    setTimeout(() => {
      setSynced(true);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              GoHighLevel CRM Integration & Sales Pipeline
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time contact sync with GoHighLevel CRM, contractor deal pipelines & equipment owner partner onboarding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerGHLSync}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <RefreshCw className={`h-4 w-4 text-orange-600 ${!synced ? 'animate-spin' : ''}`} />
            <span>{synced ? 'GoHighLevel Synced' : 'Syncing GHL API...'}</span>
          </button>
        </div>
      </div>

      {/* Tab switch */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <button
          onClick={() => setActiveTab('sales')}
          className={`border-b-2 py-2.5 px-4 ${
            activeTab === 'sales'
              ? 'border-orange-600 text-orange-600 dark:text-orange-400'
              : 'border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Customer Rental Sales Pipeline ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('partners')}
          className={`border-b-2 py-2.5 px-4 ${
            activeTab === 'partners'
              ? 'border-orange-600 text-orange-600 dark:text-orange-400'
              : 'border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Partner Owner Onboarding Pipeline ({partners.length})
        </button>
      </div>

      {/* Leads Pipeline Cards */}
      {activeTab === 'sales' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{lead.name}</span>
                <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                  {lead.stage}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{lead.company}</p>
                <p className="text-slate-500">Contact: {lead.email} • {lead.phone}</p>
                <p className="text-slate-500">Notes: {lead.notes}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
                <span className="text-[10px] text-slate-400">GHL ID: {lead.ghlContactId}</span>
                <span className="font-extrabold text-emerald-600">
                  Val: ₱{lead.dealValue.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{partner.name}</span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {partner.status}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <p className="text-slate-500">Contact Person: {partner.contactPerson}</p>
                <p className="text-slate-500">Email: {partner.email} • {partner.phone}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
                <span className="text-[10px] text-slate-400">Total Asset Fleet:</span>
                <span className="font-bold text-orange-600">{partner.activeAssetsCount} Units</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

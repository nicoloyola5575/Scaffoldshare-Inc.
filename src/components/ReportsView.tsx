import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, Search, Filter } from 'lucide-react';

interface ReportItem {
  id: string;
  title: string;
  category: 'Inventory' | 'Financial' | 'Logistics' | 'Safety' | 'CRM';
  description: string;
  format: 'PDF' | 'Excel' | 'CSV';
}

const REPORTS_LIST: ReportItem[] = [
  {
    id: 'rep-01',
    title: 'Multi-Company Consolidated Inventory Summary Report',
    category: 'Inventory',
    description: 'Comprehensive equipment breakdown by partner owner, assigned warehouse yard, equipment type, and current status.',
    format: 'PDF',
  },
  {
    id: 'rep-02',
    title: 'Asset Utilization Rate & Equipment Efficiency Audit',
    category: 'Inventory',
    description: 'Monthly active rental deployment percentage per asset type across NCR, CALABARZON, Cebu, and Davao.',
    format: 'Excel',
  },
  {
    id: 'rep-03',
    title: 'Rental Revenue & Outstanding Customer Balances Statement',
    category: 'Financial',
    description: 'Detailed contract revenue, collected deposits, insurance fees, and overdue billing balances by project site.',
    format: 'PDF',
  },
  {
    id: 'rep-04',
    title: 'Partner Revenue Share Settlement Statement (60/40 Split)',
    category: 'Financial',
    description: 'Monthly partner earnings payout breakdown including management fee deductions and damage adjustments.',
    format: 'Excel',
  },
  {
    id: 'rep-05',
    title: 'Warehouse Stock Movements & Inter-Depot Audit Log',
    category: 'Logistics',
    description: 'Complete record of inventory receiving, dispatch, inter-yard transfers, cycle counts, and lost item reports.',
    format: 'CSV',
  },
  {
    id: 'rep-06',
    title: 'Quality Control & Pre-Dispatch Inspection Audit',
    category: 'Safety',
    description: 'Safety officer checklist audit logs, weld structural integrity test results, and passed/failed certifications.',
    format: 'PDF',
  },
  {
    id: 'rep-07',
    title: 'Equipment Maintenance & Repair Cost Analysis Report',
    category: 'Inventory',
    description: 'Parts used, technician labor costs, equipment downtime days, and preventive vs. corrective work orders.',
    format: 'Excel',
  },
  {
    id: 'rep-08',
    title: 'Delivery & Trucking Dispatch Coordination Log',
    category: 'Logistics',
    description: 'Third-party trucking provider performance, driver assignments, arrival timestamps, and proof of delivery photos.',
    format: 'PDF',
  },
  {
    id: 'rep-09',
    title: 'Customer Aging Receivables & Credit Limit Audit',
    category: 'Financial',
    description: '30-60-90 day overdue rental payments by contractor company with GoHighLevel automated payment triggers.',
    format: 'Excel',
  },
  {
    id: 'rep-10',
    title: 'GoHighLevel CRM Lead & Partner Onboarding Pipeline Report',
    category: 'CRM',
    description: 'Sales lead conversion funnel, deal value pipeline, and new contractor equipment owner onboarding stats.',
    format: 'CSV',
  },
  {
    id: 'rep-11',
    title: 'Scaffold Fleet Depreciation Schedule & Replacement Valuation',
    category: 'Financial',
    description: 'Asset straight-line depreciation schedule, purchase vs. replacement cost valuation, and scrap threshold alerts.',
    format: 'Excel',
  },
  {
    id: 'rep-12',
    title: 'DOLE Safety Compliance & Scaffolder Certification Audit',
    category: 'Safety',
    description: 'Department of Labor and Employment (DOLE) construction safety compliance certification and load test reports.',
    format: 'PDF',
  },
  {
    id: 'rep-13',
    title: 'Regional Equipment Demand & Scaffolding Scarcity Analysis',
    category: 'Inventory',
    description: 'Heatmap data of construction activity in Metro Manila, Clark, Cebu, and Davao predicting asset shortages.',
    format: 'PDF',
  },
  {
    id: 'rep-14',
    title: 'Damage Assessment & Insurance Claims Report',
    category: 'Financial',
    description: 'Damaged scaffold frames during customer deployment, billing adjustments, and insurance claims settlements.',
    format: 'Excel',
  },
  {
    id: 'rep-15',
    title: 'Consolidated Income Statement, Balance Sheet & Cash Flow',
    category: 'Financial',
    description: 'Full executive financial statements combining platform commission, partner payouts, OPEX, and net margins.',
    format: 'PDF',
  },
];

export const ReportsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredReports = REPORTS_LIST.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownloadReport = (rep: ReportItem) => {
    setGeneratingId(rep.id);
    setTimeout(() => {
      setGeneratingId(null);
      setToastMessage(`Official Report "${rep.title}" (${rep.format}) generated with ScaffoldShare Inc. letterhead.`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-700 p-4 text-white shadow-2xl backdrop-blur animate-slide-up">
          <div className="rounded-lg bg-[#080d16] p-1.5 border border-slate-800">
            <img
              src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
              alt="SCAFFOLDSHARE INC."
              className="h-4 w-auto object-contain"
            />
          </div>
          <p className="text-xs font-semibold text-slate-200">{toastMessage}</p>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#080d16] border border-slate-800 px-2 py-1 inline-flex">
              <img
                src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
                alt="SCAFFOLDSHARE INC."
                className="h-5 w-auto object-contain"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Operational & Financial Reports Center
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Export certified executive, operational, financial, and DOLE safety audit reports in PDF, Excel & CSV formats.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search report name or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">All Report Categories ({REPORTS_LIST.length})</option>
          <option value="Inventory">Inventory & Equipment</option>
          <option value="Financial">Financial & Settlements</option>
          <option value="Logistics">Logistics & Warehouses</option>
          <option value="Safety">Safety & Compliance</option>
          <option value="CRM">CRM & Sales</option>
        </select>
      </div>

      {/* Reports List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((rep) => (
          <div
            key={rep.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {rep.category}
                </span>
                <span className="font-mono text-[10px] font-bold text-orange-600">{rep.format}</span>
              </div>

              <h4 className="mt-2 font-bold text-slate-900 dark:text-white text-sm">{rep.title}</h4>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{rep.description}</p>
            </div>

            <button
              onClick={() => handleDownloadReport(rep)}
              disabled={generatingId === rep.id}
              className="w-full rounded-xl bg-orange-600 py-2 text-xs font-bold text-white shadow hover:bg-orange-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Download className={`h-4 w-4 ${generatingId === rep.id ? 'animate-bounce' : ''}`} />
              <span>{generatingId === rep.id ? 'Generating Report...' : `Export ${rep.format}`}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

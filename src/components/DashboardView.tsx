import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Boxes,
  PieChart as PieIcon,
  AlertTriangle,
  FileCheck2,
  Receipt,
  Users,
  Building2,
  Percent,
  Sparkles,
  Download,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { InventoryAsset, Partner, RentalContract } from '../types';

interface DashboardViewProps {
  assets: InventoryAsset[];
  partners: Partner[];
  rentals: RentalContract[];
  onOpenAiHub: () => void;
  onOpenReportExport: () => void;
  onNavigateToModule: (module: string) => void;
}

const REVENUE_MONTHLY_DATA = [
  { month: 'Jan', gross: 2400000, net: 1440000, settlements: 960000 },
  { month: 'Feb', gross: 2850000, net: 1710000, settlements: 1140000 },
  { month: 'Mar', gross: 3200000, net: 1920000, settlements: 1280000 },
  { month: 'Apr', gross: 3600000, net: 2160000, settlements: 1440000 },
  { month: 'May', gross: 4100000, net: 2460000, settlements: 1640000 },
  { month: 'Jun', gross: 4550000, net: 2730000, settlements: 1820000 },
  { month: 'Jul (Est)', gross: 4850000, net: 2910000, settlements: 1940000 },
];

const UTILIZATION_BY_REGION = [
  { region: 'NCR (Metro Manila)', utilization: 88, onRent: 840, total: 955 },
  { region: 'Region IV-A (CALABARZON)', utilization: 82, onRent: 310, total: 378 },
  { region: 'Metro Cebu (Visayas)', utilization: 79, onRent: 240, total: 304 },
  { region: 'Metro Davao (Mindanao)', utilization: 74, onRent: 190, total: 257 },
];

const EQUIPMENT_TYPE_REVENUE = [
  { name: 'Scaffold Frame', value: 38, amount: 1843000, color: '#f97316' },
  { name: 'Shoring Frame', value: 24, amount: 1164000, color: '#3b82f6' },
  { name: 'Catwalk Planks', value: 18, amount: 873000, color: '#10b981' },
  { name: 'Cross Brace & Jacks', value: 12, amount: 582000, color: '#8b5cf6' },
  { name: 'Others', value: 8, amount: 388000, color: '#ec4899' },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  assets,
  partners,
  rentals,
  onOpenAiHub,
  onOpenReportExport,
  onNavigateToModule,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'Today' | 'This Month' | 'YTD'>('This Month');

  // KPI Calculations
  const totalAssetsCount = assets.length * 120; // Simulated full inventory multiplier for enterprise scale
  const onRentCount = assets.filter((a) => a.status === 'On Rent').length * 105;
  const availableCount = assets.filter((a) => a.status === 'Available').length * 110;
  const maintenanceCount = assets.filter((a) => a.status === 'Under Maintenance').length * 20;
  const damageIncidents = assets.filter((a) => a.condition === 'Fair' || a.inspectionStatus === 'Failed').length;

  const todayRevenue = 185000;
  const monthlyRevenue = 4850000;
  const annualRevenue = 25550000;
  const grossRentalRevenue = 4850000;
  const netRevenue = 2910000; // ScaffoldShare 60%
  const partnerSettlementDue = 1940000; // Partners 40%
  const avgUtilization = Math.round((onRentCount / totalAssetsCount) * 100);

  const openQuotations = rentals.filter((r) => r.stage === 'Quotation' || r.stage === 'Inquiry').length + 5;
  const outstandingInvoices = 1250000;
  const totalCollections = 3600000;
  const cashFlow = 1820000;
  const netProfit = 1420000;
  const monthlyGrowth = 14.2;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl dark:border dark:border-slate-800 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <div className="rounded-lg bg-[#080d16] border border-slate-700/80 px-2.5 py-1 inline-flex shadow-sm">
              <img
                src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
                alt="SCAFFOLDSHARE INC."
                className="h-5 w-auto object-contain"
              />
            </div>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur border border-amber-500/30">
              PHILIPPINE ENTERPRISE NETWORK
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Executive KPI Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Real-time multi-company inventory, QR asset tracking, revenue sharing & rental logistics metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAiHub}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Executive Insights</span>
          </button>

          <button
            onClick={onOpenReportExport}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Today's Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">₱{todayRevenue.toLocaleString()}</p>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
            <ArrowUpRight className="h-3 w-3" />
            <span>+18% vs Yesterday</span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Monthly Revenue</span>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </div>
          <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">₱{(monthlyRevenue / 1000000).toFixed(2)}M</p>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
            <ArrowUpRight className="h-3 w-3" />
            <span>+{monthlyGrowth}% MoM</span>
          </div>
        </div>

        {/* Net Revenue (60%) */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Net Revenue (60%)</span>
            <DollarSign className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">₱{(netRevenue / 1000000).toFixed(2)}M</p>
          <p className="mt-1 text-[10px] text-slate-500">ScaffoldShare Platform Share</p>
        </div>

        {/* Partner Settlement Due (40%) */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Partner Due (40%)</span>
            <Users className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">₱{(partnerSettlementDue / 1000000).toFixed(2)}M</p>
          <p className="mt-1 text-[10px] text-amber-600 font-medium">Due July 30 Settlement</p>
        </div>

        {/* Inventory Utilization % */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Utilization Rate</span>
            <Percent className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">{avgUtilization}%</p>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
            <span>Optimal Peak Zone</span>
          </div>
        </div>

        {/* Total Inventory Units */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Inventory</span>
            <Boxes className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">{totalAssetsCount.toLocaleString()} units</p>
          <p className="mt-1 text-[10px] text-slate-500">Across 5 Partner Fleets</p>
        </div>
      </div>

      {/* Secondary Operational Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400">EQUIPMENT ON RENT</span>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{onRentCount.toLocaleString()} units</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400">AVAILABLE IN YARD</span>
          <p className="text-base font-bold text-blue-600 dark:text-blue-400">{availableCount.toLocaleString()} units</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400">UNDER MAINTENANCE</span>
          <p className="text-base font-bold text-amber-600 dark:text-amber-400">{maintenanceCount} units</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400">DAMAGE INCIDENTS</span>
          <p className="text-base font-bold text-red-600 dark:text-red-400">{damageIncidents} reported</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400">OPEN QUOTATIONS</span>
          <p className="text-base font-bold text-purple-600 dark:text-purple-400">{openQuotations} pending</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold text-slate-400">OUTSTANDING INVOICES</span>
          <p className="text-base font-bold text-slate-900 dark:text-white">₱{(outstandingInvoices / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue & Settlement Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Revenue & Partner Settlement Distribution
              </h3>
              <p className="text-xs text-slate-500">Gross Rental Revenue vs 60/40 Split Breakdown (PHP)</p>
            </div>
            <span className="rounded-md bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              60% ScaffoldShare / 40% Partner
            </span>
          </div>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_MONTHLY_DATA}>
                <defs>
                  <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₱${v / 1000000}M`} />
                <Tooltip formatter={(value: any) => `₱${Number(value).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="gross" name="Gross Rental Revenue" stroke="#f97316" fillOpacity={1} fill="url(#colorGross)" strokeWidth={2} />
                <Area type="monotone" dataKey="net" name="Platform Net (60%)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNet)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equipment Type Revenue Breakdown (Donut) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Revenue by Equipment Category</h3>
            <p className="text-xs text-slate-500">Asset Type Revenue Distribution</p>
          </div>

          <div className="mt-2 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={EQUIPMENT_TYPE_REVENUE} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {EQUIPMENT_TYPE_REVENUE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any, name: any, item: any) => [`₱${item.payload.amount.toLocaleString()} (${val}%)`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
            {EQUIPMENT_TYPE_REVENUE.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">₱{(item.amount / 1000).toFixed(0)}k ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Utilization & Partner Fleet Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization by Philippine Region */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Regional Asset Utilization %</h3>
            <p className="text-xs text-slate-500">Scaffolding demand & fleet utilization by hub location</p>
          </div>

          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={UTILIZATION_BY_REGION} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 10 }} width={130} />
                <Tooltip formatter={(value: any) => [`${value}% Utilization`, 'Utilization']} />
                <Bar dataKey="utilization" name="Utilization Rate %" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Partner Fleets Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Partner Contractor Fleets</h3>
              <p className="text-xs text-slate-500">Consolidated equipment fleet partners & revenue split</p>
            </div>
            <button
              onClick={() => onNavigateToModule('partner_portal')}
              className="text-xs font-semibold text-orange-600 hover:underline"
            >
              View All Partners →
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{partner.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400">
                    {partner.region} • {partner.activeAssetsCount} assets listed
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 dark:text-white">₱{(partner.totalRevenueGenerated / 1000000).toFixed(2)}M</span>
                  <div className="text-[10px] font-semibold text-emerald-600">
                    Partner Share: {partner.revenueSharePercentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

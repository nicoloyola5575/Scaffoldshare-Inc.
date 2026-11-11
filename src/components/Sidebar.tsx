import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  FileText,
  Warehouse as WarehouseIcon,
  ClipboardCheck,
  Wrench,
  Truck,
  PieChart,
  Users2,
  Building,
  UserCheck,
  DollarSign,
  Sparkles,
  FileBarChart,
  Settings,
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentModule: string;
  onSelectModule: (module: string) => void;
  userRole: UserRole;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: UserRole[];
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Executive Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['super_admin', 'ops_manager', 'finance'],
  },
  {
    id: 'inventory',
    label: 'Multi-Company Inventory',
    icon: Boxes,
    allowedRoles: ['super_admin', 'ops_manager', 'warehouse_manager', 'partner', 'finance'],
    badge: 'QR Tracked',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  {
    id: 'rentals',
    label: 'Rental Lifecycle',
    icon: FileText,
    allowedRoles: ['super_admin', 'ops_manager', 'finance', 'customer'],
  },
  {
    id: 'warehouses',
    label: 'Warehouse & Transfers',
    icon: WarehouseIcon,
    allowedRoles: ['super_admin', 'ops_manager', 'warehouse_manager'],
  },
  {
    id: 'inspections',
    label: 'Inspections & Quality',
    icon: ClipboardCheck,
    allowedRoles: ['super_admin', 'ops_manager', 'warehouse_manager'],
  },
  {
    id: 'maintenance',
    label: 'Maintenance & Repairs',
    icon: Wrench,
    allowedRoles: ['super_admin', 'ops_manager', 'warehouse_manager'],
  },
  {
    id: 'deliveries',
    label: 'Delivery & Logistics',
    icon: Truck,
    allowedRoles: ['super_admin', 'ops_manager', 'warehouse_manager'],
  },
  {
    id: 'revenue_sharing',
    label: 'Revenue Sharing (60/40)',
    icon: PieChart,
    allowedRoles: ['super_admin', 'finance', 'partner'],
  },
  {
    id: 'crm',
    label: 'CRM & GoHighLevel',
    icon: Users2,
    allowedRoles: ['super_admin', 'ops_manager'],
    badge: 'GHL Synced',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  },
  {
    id: 'partner_portal',
    label: 'Partner Portal',
    icon: UserCheck,
    allowedRoles: ['partner', 'super_admin'],
  },
  {
    id: 'customer_portal',
    label: 'Customer Catalog & Portal',
    icon: Building,
    allowedRoles: ['customer', 'super_admin'],
  },
  {
    id: 'financials',
    label: 'Financials & OPEX',
    icon: DollarSign,
    allowedRoles: ['super_admin', 'finance'],
  },
  {
    id: 'ai_features',
    label: 'AI Operational Intelligence',
    icon: Sparkles,
    allowedRoles: ['super_admin', 'ops_manager', 'finance'],
    badge: 'Gemini AI',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
  },
  {
    id: 'reports',
    label: 'Reports & Export',
    icon: FileBarChart,
    allowedRoles: ['super_admin', 'ops_manager', 'finance', 'partner'],
  },
  {
    id: 'settings',
    label: 'System & RBAC Settings',
    icon: Settings,
    allowedRoles: ['super_admin'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onSelectModule, userRole }) => {
  const visibleItems = NAV_ITEMS.filter((item) => item.allowedRoles.includes(userRole));

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/60 p-3 flex flex-col justify-between">
      <div className="space-y-1">
        {/* Brand Header Banner with uploaded logo */}
        <div className="mb-3 px-1 pt-1 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-center rounded-xl bg-[#080d16] border border-slate-800 p-2.5 shadow-sm">
            <img
              src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
              alt="SCAFFOLDSHARE INC."
              className="h-6 w-auto max-w-full object-contain"
            />
          </div>
          <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Heavy Asset Network</span>
            <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>

        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Navigation
        </div>
        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'text-slate-700 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-800/60">
        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
          <span>ScaffoldShare Inc.</span>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            Enterprise HQ
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          Contractor Fleet Sharing & QR Logistics Management
        </p>
      </div>
    </aside>
  );
};

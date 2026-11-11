import React, { useState } from 'react';
import {
  Building2,
  Search,
  QrCode,
  Bell,
  Sun,
  Moon,
  ShieldAlert,
  HardHat,
  Warehouse as WhIcon,
  Users,
  Building,
  DollarSign,
  ChevronDown,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserRole, AppNotification } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenGlobalSearch: () => void;
  onOpenQrScanner: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onNavigateToModule: (moduleId: string) => void;
}

const ROLE_OPTIONS: { role: UserRole; label: string; icon: any; color: string }[] = [
  { role: 'super_admin', label: 'Super Admin', icon: ShieldAlert, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  { role: 'ops_manager', label: 'Operations Manager', icon: HardHat, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  { role: 'warehouse_manager', label: 'Warehouse Manager', icon: WhIcon, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  { role: 'partner', label: 'Partner Company', icon: Users, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { role: 'customer', label: 'Customer', icon: Building, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
  { role: 'finance', label: 'Finance Officer', icon: DollarSign, color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  onOpenGlobalSearch,
  onOpenQrScanner,
  notifications,
  onMarkNotificationRead,
  onNavigateToModule,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const activeRoleConfig = ROLE_OPTIONS.find((r) => r.role === currentRole) || ROLE_OPTIONS[0];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Brand & Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => onNavigateToModule('dashboard')}
        title="ScaffoldShare Inc. - Return to Dashboard"
      >
        <div className="flex items-center rounded-xl bg-[#080d16] border border-slate-800/90 px-3 py-1.5 shadow-md shadow-black/20 group-hover:border-amber-500/60 transition-all">
          <img
            src="/assets/aistudio/Scaffolshare_Logo_a3941131.png"
            alt="SCAFFOLDSHARE INC."
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </div>
        <div className="hidden lg:flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              ENTERPRISE IMS
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              • PH Heavy Asset Cloud
            </span>
          </div>
        </div>
      </div>

      {/* Global Search Bar Trigger */}
      <div className="hidden max-w-md flex-1 px-8 md:block">
        <button
          onClick={onOpenGlobalSearch}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-sm text-slate-500 transition-all hover:border-orange-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-slate-700"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <span>Search assets, contracts, QR codes, partners...</span>
          </div>
          <kbd className="hidden rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300 lg:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          onClick={onOpenGlobalSearch}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          title="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* QR Scanner Trigger */}
        <button
          onClick={onOpenQrScanner}
          className="flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50/80 px-3 py-1.5 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300 dark:hover:bg-orange-900/60"
        >
          <QrCode className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <span className="hidden sm:inline">Scan QR Code</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notification Popover Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifMenu(false)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 max-h-72 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start justify-between p-2.5 text-xs transition-colors rounded-lg my-1 ${
                      n.read ? 'opacity-70' : 'bg-slate-50 dark:bg-slate-800/40 font-medium'
                    }`}
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            n.type === 'alert'
                              ? 'bg-red-500'
                              : n.type === 'warning'
                              ? 'bg-amber-500'
                              : n.type === 'success'
                              ? 'bg-emerald-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <span className="font-semibold text-slate-900 dark:text-white">{n.title}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{n.message}</p>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    {!n.read && (
                      <button
                        onClick={() => onMarkNotificationRead(n.id)}
                        className="text-orange-600 hover:text-orange-700 text-[10px] font-semibold"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition-all border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 ${activeRoleConfig.color}`}
          >
            <activeRoleConfig.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{activeRoleConfig.label}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Switch Role Perspective
              </div>
              <div className="space-y-1">
                {ROLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = opt.role === currentRole;
                  return (
                    <button
                      key={opt.role}
                      onClick={() => {
                        onRoleChange(opt.role);
                        setShowRoleMenu(false);
                        if (opt.role === 'partner') onNavigateToModule('partner_portal');
                        else if (opt.role === 'customer') onNavigateToModule('customer_portal');
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 font-bold'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-500" />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

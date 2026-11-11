import React, { useState } from 'react';
import { UserRole, NavModule, InventoryAsset, RentalContract, StockMovement, InspectionRecord, MaintenanceRecord, SettlementStatement, Partner, CRMLead } from './types';
import {
  INITIAL_ASSETS,
  INITIAL_PARTNERS,
  INITIAL_WAREHOUSES,
  INITIAL_RENTALS,
  INITIAL_MOVEMENTS,
  INITIAL_INSPECTIONS,
  INITIAL_MAINTENANCE,
  INITIAL_DELIVERIES,
  INITIAL_SETTLEMENTS,
  INITIAL_LEADS,
  INITIAL_NOTIFICATIONS,
} from './mockData';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { RentalManagementView } from './components/RentalManagementView';
import { WarehouseView } from './components/WarehouseView';
import { InspectionView } from './components/InspectionView';
import { MaintenanceView } from './components/MaintenanceView';
import { DeliveryView } from './components/DeliveryView';
import { RevenueSharingView } from './components/RevenueSharingView';
import { CRMView } from './components/CRMView';
import { CustomerPortalView } from './components/CustomerPortalView';
import { PartnerPortalView } from './components/PartnerPortalView';
import { FinancialsView } from './components/FinancialsView';
import { AIFeaturesView } from './components/AIFeaturesView';
import { ReportsView } from './components/ReportsView';

import { AssetDetailModal } from './components/AssetDetailModal';
import { QrScannerModal } from './components/QrScannerModal';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('Super Admin');
  const [currentModule, setCurrentModule] = useState<NavModule>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Core Datasets State
  const [assets, setAssets] = useState<InventoryAsset[]>(INITIAL_ASSETS);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [rentals, setRentals] = useState<RentalContract[]>(INITIAL_RENTALS);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [inspections, setInspections] = useState<InspectionRecord[]>(INITIAL_INSPECTIONS);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(INITIAL_MAINTENANCE);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [settlements, setSettlements] = useState<SettlementStatement[]>(INITIAL_SETTLEMENTS);
  const [leads, setLeads] = useState<CRMLead[]>(INITIAL_LEADS);

  // Modals
  const [selectedAssetDetail, setSelectedAssetDetail] = useState<InventoryAsset | null>(null);
  const [showQrScanner, setShowQrScanner] = useState(false);

  // Asset Handlers
  const handleAddAsset = (newAsset: InventoryAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleAddRental = (newRental: RentalContract) => {
    setRentals((prev) => [newRental, ...prev]);
  };

  const handleUpdateRentalStage = (id: string, newStage: any) => {
    setRentals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, stage: newStage } : r))
    );
  };

  const handleAddMovement = (newMvt: StockMovement) => {
    setMovements((prev) => [newMvt, ...prev]);
  };

  const handleAddInspection = (newInsp: InspectionRecord) => {
    setInspections((prev) => [newInsp, ...prev]);
    if (newInsp.createdMaintenanceTicketId) {
      const newMnt: MaintenanceRecord = {
        id: `mnt-${Date.now()}`,
        ticketNumber: newInsp.createdMaintenanceTicketId,
        assetId: newInsp.assetId,
        assetName: newInsp.assetName,
        type: 'Corrective',
        priority: 'High',
        status: 'Open',
        partsUsed: [],
        laborCost: 500,
        downtimeDays: 3,
        technicianName: 'Field Inspector & Weld Tech',
        dateReported: newInsp.date,
        notes: `Failed inspection remark: ${newInsp.recommendations}`,
      };
      setMaintenanceRecords((prev) => [newMnt, ...prev]);
    }
  };

  const handleAddMaintenanceRecord = (rec: MaintenanceRecord) => {
    setMaintenanceRecords((prev) => [rec, ...prev]);
  };

  const handleCompleteTicket = (ticketNumber: string) => {
    setMaintenanceRecords((prev) =>
      prev.map((m) => (m.ticketNumber === ticketNumber ? { ...m, status: 'Completed' } : m))
    );
  };

  const handleApproveStatement = (id: string) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Approved' } : s))
    );
  };

  const handleUpdatePartnerSplit = (partnerId: string, newSplit: number) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, revenueSharePercentage: newSplit } : p))
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans antialiased`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentModule={currentModule}
          userRole={currentRole}
          onSelectModule={(mod) => setCurrentModule(mod as NavModule)}
        />

        {/* Main Layout Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navbar */}
          <Navbar
            currentRole={currentRole}
            onRoleChange={(role) => {
              setCurrentRole(role);
              if (role === 'customer') setCurrentModule('customer_portal');
              else if (role === 'partner') setCurrentModule('partner_portal');
              else if (role === 'warehouse_manager') setCurrentModule('warehouses');
              else if (role === 'finance') setCurrentModule('financials');
              else setCurrentModule('dashboard');
            }}
            darkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onOpenGlobalSearch={() => {}}
            onOpenQrScanner={() => setShowQrScanner(true)}
            notifications={INITIAL_NOTIFICATIONS}
            onMarkNotificationRead={() => {}}
            onNavigateToModule={(mod) => setCurrentModule(mod as NavModule)}
          />

          {/* Dynamic Module Workspace Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {currentModule === 'dashboard' && (
              <DashboardView
                assets={assets}
                rentals={rentals}
                partners={partners}
                warehouses={warehouses}
                movements={movements}
                inspections={inspections}
                maintenanceRecords={maintenanceRecords}
                onNavigate={(mod) => setCurrentModule(mod)}
                onSelectAsset={(asset) => setSelectedAssetDetail(asset)}
              />
            )}

            {currentModule === 'inventory' && (
              <InventoryView
                assets={assets}
                partners={partners}
                warehouses={warehouses}
                onSelectAsset={(asset) => setSelectedAssetDetail(asset)}
                onAddAsset={handleAddAsset}
                onOpenQrScanner={() => setShowQrScanner(true)}
              />
            )}

            {currentModule === 'rentals' && (
              <RentalManagementView
                rentals={rentals}
                assets={assets}
                onAddRental={handleAddRental}
                onUpdateRentalStage={handleUpdateRentalStage}
              />
            )}

            {currentModule === 'warehouses' && (
              <WarehouseView
                warehouses={warehouses}
                movements={movements}
                assets={assets}
                onAddMovement={handleAddMovement}
              />
            )}

            {currentModule === 'inspections' && (
              <InspectionView
                inspections={inspections}
                assets={assets}
                onAddInspection={handleAddInspection}
              />
            )}

            {currentModule === 'maintenance' && (
              <MaintenanceView
                maintenanceRecords={maintenanceRecords}
                assets={assets}
                onAddRecord={handleAddMaintenanceRecord}
                onCompleteTicket={handleCompleteTicket}
              />
            )}

            {currentModule === 'deliveries' && <DeliveryView deliveries={deliveries} />}

            {currentModule === 'revenue_sharing' && (
              <RevenueSharingView
                settlements={settlements}
                partners={partners}
                onApproveStatement={handleApproveStatement}
                onUpdatePartnerSplit={handleUpdatePartnerSplit}
              />
            )}

            {currentModule === 'crm' && (
              <CRMView leads={leads} partners={partners} onAddLead={(l) => setLeads((prev) => [l, ...prev])} />
            )}

            {currentModule === 'customer_portal' && (
              <CustomerPortalView assets={assets} rentals={rentals} onAddRental={handleAddRental} />
            )}

            {currentModule === 'partner_portal' && (
              <PartnerPortalView
                partner={partners[0]}
                assets={assets}
                settlements={settlements}
              />
            )}

            {currentModule === 'financials' && <FinancialsView />}

            {(currentModule === 'ai_features' || currentModule === 'ai_forecast') && <AIFeaturesView />}

            {currentModule === 'reports' && <ReportsView />}
          </main>
        </div>
      </div>

      {/* QR Code & Barcode Detail Modal */}
      {selectedAssetDetail && (
        <AssetDetailModal
          asset={selectedAssetDetail}
          onClose={() => setSelectedAssetDetail(null)}
        />
      )}

      {/* Live QR Camera Scanner Simulation Modal */}
      {showQrScanner && (
        <QrScannerModal
          assets={assets}
          onClose={() => setShowQrScanner(false)}
          onScanSuccess={(asset) => {
            setSelectedAssetDetail(asset);
            setShowQrScanner(false);
          }}
        />
      )}
    </div>
  );
};

export default App;

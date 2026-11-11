export type UserRole =
  | 'super_admin'
  | 'ops_manager'
  | 'warehouse_manager'
  | 'partner'
  | 'customer'
  | 'finance';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  partnerId?: string;
  customerId?: string;
  avatar: string;
}

export interface Partner {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  region: string;
  revenueSharePercentage: number; // default 40% for partner
  activeAssetsCount: number;
  totalRevenueGenerated: number;
  totalSettlementPaid: number;
  pendingSettlement: number;
  status: 'Active' | 'Pending' | 'Suspended';
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  address: string;
  region: string;
  managerName: string;
  contactPhone: string;
  totalCapacityUnits: number;
  usedCapacityUnits: number;
  coordinates: { lat: number; lng: number };
}

export type EquipmentType =
  | 'Scaffold Frame'
  | 'Cross Brace'
  | 'Catwalk'
  | 'Base Jack'
  | 'U Head Jack'
  | 'Ladder Frame'
  | 'Guard Rail'
  | 'Toe Board'
  | 'Steel Plank'
  | 'Adjustable Jack'
  | 'Shoring Frame'
  | 'Others';

export type AssetCondition = 'Brand New' | 'Good' | 'Fair' | 'Maintenance Required' | 'Scrapped';

export type AssetStatus = 'Available' | 'On Rent' | 'Reserved' | 'In Transit' | 'Under Maintenance';

export interface InventoryAsset {
  id: string;
  assetId: string; // e.g. SSF-2026-001
  partnerId: string;
  partnerName: string;
  warehouseId: string;
  warehouseName: string;
  qrCode: string;
  barcode: string;
  equipmentType: EquipmentType;
  brand: string;
  model: string;
  purchaseYear: number;
  purchaseCost: number; // in PHP
  replacementCost: number; // in PHP
  dailyRentalRate: number; // in PHP
  monthlyRentalRate: number; // in PHP
  condition: AssetCondition;
  status: AssetStatus;
  inspectionStatus: 'Passed' | 'Pending' | 'Failed';
  photos: string[];
  notes: string;
  gpsCoordinates?: { lat: number; lng: number };
  lastInspectedDate: string;
  utilizationPercentage: number;
  revenueGenerated: number;
  currentCustomerName?: string;
  currentProjectName?: string;
  currentRentalNumber?: string;
}

export type RentalStage =
  | 'Inquiry'
  | 'Quotation'
  | 'Approved'
  | 'Contract'
  | 'Reserved'
  | 'Warehouse Pick'
  | 'Dispatch'
  | 'Delivery'
  | 'Active Rental'
  | 'Inspection'
  | 'Return'
  | 'Damage Assessment'
  | 'Settlement'
  | 'Available Again';

export interface RentalItem {
  assetId: string;
  equipmentType: EquipmentType;
  quantity: number;
  dailyRate: number;
  monthlyRate: number;
}

export interface RentalContract {
  id: string;
  rentalNumber: string; // e.g. RNT-2026-8801
  customerId: string;
  customerName: string;
  customerCompany: string;
  projectTitle: string;
  siteAddress: string;
  region: string;
  startDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  stage: RentalStage;
  items: RentalItem[];
  dailyTotal: number;
  monthlyTotal: number;
  deliveryFee: number;
  assemblyFee: number;
  deposit: number;
  insuranceFee: number;
  outstandingBalance: number;
  totalPaid: number;
  contractSigned: boolean;
  notes?: string;
}

export interface StockMovement {
  id: string;
  assetId: string;
  assetName: string;
  movementType: 'Receiving' | 'Releasing' | 'Transfer' | 'Cycle Count' | 'Adjustment' | 'Damage Log' | 'Lost Item';
  fromWarehouse: string;
  toWarehouse: string;
  quantity: number;
  timestamp: string;
  performedBy: string;
  notes: string;
}

export interface InspectionRecord {
  id: string;
  inspectionNumber: string;
  assetId: string;
  assetName: string;
  inspectionType: 'Initial' | 'Pre Rental' | 'Delivery' | 'Return' | 'Maintenance' | 'Safety';
  inspectorName: string;
  date: string;
  result: 'Pass' | 'Fail';
  checklist: { item: string; passed: boolean; remark?: string }[];
  recommendations: string;
  photos: string[];
  digitalSignature?: string;
  createdMaintenanceTicketId?: string;
}

export interface MaintenanceRecord {
  id: string;
  ticketNumber: string;
  assetId: string;
  assetName: string;
  type: 'Preventive' | 'Corrective' | 'Scheduled' | 'Emergency';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Parts Pending' | 'Completed';
  partsUsed: { name: string; cost: number }[];
  laborCost: number;
  downtimeDays: number;
  technicianName: string;
  dateReported: string;
  dateCompleted?: string;
  notes: string;
}

export interface DeliveryRecord {
  id: string;
  deliveryNumber: string;
  rentalNumber: string;
  customerName: string;
  siteAddress: string;
  truckingCompany: string;
  truckPlate: string;
  driverName: string;
  driverPhone: string;
  status: 'Assigned' | 'En Route' | 'Delivered' | 'Pickup En Route' | 'Returned';
  estimatedArrival: string;
  actualArrival?: string;
  fuelCost: number;
  deliveryFee: number;
  proofOfDeliveryPhotoUrl?: string;
  customerSignature?: string;
}

export interface SettlementStatement {
  id: string;
  statementNumber: string;
  partnerId: string;
  partnerName: string;
  period: string;
  grossRentalRevenue: number;
  partnerSplitPercent: number; // e.g. 40
  partnerGrossShare: number;
  managementFee: number;
  adjustments: number;
  penalties: number;
  damageCharges: number;
  netPayout: number;
  status: 'Draft' | 'Approved' | 'Paid';
  paymentDueDate: string;
  paymentDate?: string;
}

export interface CRMLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  leadType: 'Customer' | 'Partner';
  stage: string;
  dealValue: number;
  ghlSynced: boolean;
  ghlContactId: string;
  lastActivity: string;
  notes: string;
}

export interface OpexCategory {
  id: string;
  name: string;
  monthlyBudget: number;
  actualSpent: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  category: 'returns' | 'overdue' | 'inventory' | 'maintenance' | 'settlement' | 'crm';
}

export interface AIForecastResponse {
  summary: string;
  demandForecast: { region: string; demandIndex: number; highDemandType: string; growthForecast: string }[];
  pricingRecommendations: { equipmentType: string; currentRate: number; recommendedRate: number; rationale: string }[];
  warehouseRebalance: { sourceWarehouse: string; targetWarehouse: string; equipmentType: string; quantity: number; reason: string }[];
  maintenanceAlerts: { assetId: string; equipmentType: string; riskLevel: 'High' | 'Medium' | 'Low'; predictedFailureDays: number; action: string }[];
}

export type NavModule =
  | 'dashboard'
  | 'inventory'
  | 'rentals'
  | 'warehouses'
  | 'inspections'
  | 'maintenance'
  | 'deliveries'
  | 'revenue_sharing'
  | 'crm'
  | 'partner_portal'
  | 'customer_portal'
  | 'financials'
  | 'ai_features'
  | 'ai_forecast'
  | 'reports'
  | 'settings';

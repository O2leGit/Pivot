// ──────────────────────────────────────────────────────────────────────
//  Pivot Property Management Platform — TypeScript Interfaces
// ──────────────────────────────────────────────────────────────────────

export type PortalRole = "tenant" | "owner" | "contractor" | "admin";

export type PropertyMode = "LTR" | "STR" | "mixed";

export type MaintenanceStatus =
  | "open"
  | "triaged"
  | "assigned"
  | "in_progress"
  | "pending_approval"
  | "completed"
  | "cancelled";

export type MaintenanceUrgency = "low" | "medium" | "high" | "emergency";

export type PaymentStatus = "paid" | "pending" | "overdue" | "partial";

export type LeaseStatus = "active" | "expiring_soon" | "expired" | "pending";

export type InvoiceStatus = "pending" | "approved" | "paid" | "disputed";

export type ContractorStatus = "available" | "busy" | "offline";

export type JobStatus = "open" | "accepted" | "in_progress" | "completed" | "cancelled";

export type DisputeStatus = "open" | "under_review" | "resolved" | "escalated";

// ──────────────────────────────────────────────────────────────────────
//  Properties & Units
// ──────────────────────────────────────────────────────────────────────

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: "apartment" | "house" | "condo" | "vacation_rental";
  mode: PropertyMode;
  ownerId: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  strRevenueMTD: number;
  imageUrl?: string;
  amenities: string[];
  coverImage: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rentAmount: number;
  tenantId: string | null;
  status: "occupied" | "vacant" | "maintenance";
  leaseEnd: string | null;
  strNightlyRate?: number;
}

// ──────────────────────────────────────────────────────────────────────
//  People
// ──────────────────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  propertyId: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  paymentStatus: PaymentStatus;
  screeningScore: number;
  balance: number; // positive = owes, negative = credit
  avatar?: string;
  autoPayEnabled: boolean;
  leaseStatus: LeaseStatus;
  moveInDate: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyIds: string[];
  planTier: "starter" | "pro" | "enterprise";
  platformFeePercent: number;
}

export interface Contractor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string[];
  rating: number;
  completedJobs: number;
  status: ContractorStatus;
  licenseNumber: string;
  vetted: boolean;
  hourlyRate: number;
  avatar?: string;
}

// ──────────────────────────────────────────────────────────────────────
//  Maintenance
// ──────────────────────────────────────────────────────────────────────

export interface MaintenanceRequest {
  id: string;
  unitId: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  category: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "pest" | "other";
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  submittedAt: string;
  updatedAt: string;
  assignedContractorId?: string;
  estimatedCost?: number;
  actualCost?: number;
  aiTriageSummary?: string;
  aiUrgencyScore?: number;
  photos?: string[];
  notes?: string;
  scheduledDate?: string;
  completedDate?: string;
  accessCode?: string;
}

// ──────────────────────────────────────────────────────────────────────
//  Financial
// ──────────────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  tenantId: string;
  unitId: string;
  propertyId: string;
  amount: number;
  type: "rent" | "deposit" | "late_fee" | "utility" | "other";
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  method?: "ach" | "credit_card" | "check" | "cash";
  receiptUrl?: string;
  description: string;
}

export interface Invoice {
  id: string;
  maintenanceRequestId?: string;
  contractorId: string;
  propertyId: string;
  amount: number;
  laborHours: number;
  materialsCost: number;
  platformFee: number;
  status: InvoiceStatus;
  submittedAt: string;
  approvedAt?: string;
  paidAt?: string;
  description: string;
  lineItems: { description: string; amount: number }[];
}

export interface PLEntry {
  month: string;
  rentIncome: number;
  strIncome: number;
  maintenanceCost: number;
  platformFees: number;
  otherExpenses: number;
  netIncome: number;
}

// ──────────────────────────────────────────────────────────────────────
//  Lease & Messages
// ──────────────────────────────────────────────────────────────────────

export interface Lease {
  id: string;
  tenantId: string;
  unitId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: LeaseStatus;
  signedByTenant: boolean;
  signedByOwner: boolean;
  signedAt?: string;
  renewalOfferSent: boolean;
  terms: string[];
  petPolicy: "no_pets" | "cats_allowed" | "dogs_allowed" | "all_pets";
}

export interface Message {
  id: string;
  threadId: string;
  fromId: string;
  fromName: string;
  fromRole: PortalRole;
  toId: string;
  toName: string;
  body: string;
  sentAt: string;
  read: boolean;
  attachments?: string[];
}

export interface MessageThread {
  id: string;
  subject: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
}

// ──────────────────────────────────────────────────────────────────────
//  Contractor Job (from contractor perspective)
// ──────────────────────────────────────────────────────────────────────

export interface ContractorJob {
  id: string;
  maintenanceRequestId: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  unitNumber: string;
  title: string;
  description: string;
  category: string;
  urgency: MaintenanceUrgency;
  status: JobStatus;
  estimatedPay: number;
  scheduledDate?: string;
  accessCode?: string;
  completedAt?: string;
  invoiceId?: string;
}

// ──────────────────────────────────────────────────────────────────────
//  Admin
// ──────────────────────────────────────────────────────────────────────

export interface AccountRecord {
  id: string;
  ownerName: string;
  email: string;
  plan: string;
  properties: number;
  units: number;
  mrr: number;
  platformFeeDefault: number;
  platformFeeOverride: number | null;
  platformFeeEffective: number;
  status: "active" | "trial" | "suspended";
  joinedAt: string;
}

export interface Dispute {
  id: string;
  type: "maintenance" | "payment" | "deposit" | "lease" | "other";
  status: DisputeStatus;
  openedBy: string;
  openedByRole: PortalRole;
  againstId: string;
  againstName: string;
  propertyId: string;
  description: string;
  openedAt: string;
  resolvedAt?: string;
  resolution?: string;
  amount?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: PortalRole | "system";
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress?: string;
}

export interface IoTEvent {
  id: string;
  deviceId: string;
  deviceType: "smart_lock" | "noise_sensor" | "leak_detector" | "thermostat";
  propertyId: string;
  unitId: string;
  eventType: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
  description: string;
  resolved: boolean;
}

// ──────────────────────────────────────────────────────────────────────
//  Dashboard / App State
// ──────────────────────────────────────────────────────────────────────

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: PortalRole;
  entityId: string; // tenantId, ownerId, contractorId, or "admin"
  avatar?: string;
}

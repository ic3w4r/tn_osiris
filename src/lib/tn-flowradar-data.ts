import { districtCatalog, RiskLevel } from '@/lib/tn-governance-data';

export type FlowModule =
  | 'fund_flow'
  | 'file_flow'
  | 'grievance_flow'
  | 'tender_flow'
  | 'project_flow'
  | 'scheme_benefit_flow'
  | 'certificate_service_flow'
  | 'vehicle_field_team_flow'
  | 'material_supply_flow'
  | 'disaster_response_flow'
  | 'inspection_flow'
  | 'citizen_impact_flow';

export interface FlowStage {
  id: string;
  label: string;
  owner: string;
  status: 'completed' | 'current' | 'upcoming' | 'blocked' | 'delayed';
  completedAt?: string;
  lat: number;
  lng: number;
}

export interface FlowPassport {
  flowId: string;
  flowType: FlowModule;
  title: string;
  objectType: string;
  objectId: string;
  districtId: string;
  district: string;
  zone?: string;
  originStage: string;
  currentStage: string;
  currentOwner: string;
  destination: string;
  outcome: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  status: 'created' | 'assigned' | 'in_review' | 'in_progress' | 'blocked' | 'delayed' | 'escalated' | 'completed' | 'verified' | 'disputed' | 'closed';
  riskLevel: RiskLevel;
  riskScore: number;
  confidenceScore: number;
  delayDays: number;
  elapsedPct: number;
  progressPct: number;
  route: FlowStage[];
  metrics: Record<string, string | number>;
  linkedFlowIds: string[];
  summary: string;
  lat: number;
  lng: number;
  lastUpdated: string;
}

export interface FlowRadarDistrictSummary {
  districtId: string;
  district: string;
  lat: number;
  lng: number;
  flowScore: number;
  activeFlows: number;
  delayedFlows: number;
  criticalFlows: number;
  topBottleneck: string;
  moduleCounts: Record<FlowModule, number>;
}

export interface FlowRadarZoneSummary {
  id: string;
  districtId: string;
  district: string;
  zone: string;
  lat: number;
  lng: number;
  flowScore: number;
  activeFlows: number;
  delayedFlows: number;
  criticalFlows: number;
  topBottleneck: string;
  moduleCounts: Record<FlowModule, number>;
}

export interface ModuleFlowSummary {
  module: FlowModule;
  label: string;
  activeFlows: number;
  delayedFlows: number;
  criticalFlows: number;
  avgRiskScore: number;
  topBottleneck: string;
}

export interface DepartmentChannelHeat {
  department: string;
  modules: FlowModule[];
  flowCount: number;
  delayedCount: number;
  criticalCount: number;
  heatScore: number;
  districts: string[];
  latestFlowId: string;
  latestFlowTitle: string;
  bottleneck: string;
}

export interface FlowRadarStateSummary {
  totalActiveFlows: number;
  totalDelayedFlows: number;
  criticalRiskFlows: number;
  districtRiskRanking: Array<{ district: string; flowScore: number }>;
  departmentBottlenecks: Array<{ department: string; heatScore: number; bottleneck: string }>;
  moduleRiskSummary: Array<{ module: FlowModule; delayedFlows: number; criticalFlows: number }>;
}

export interface FlowRadarDataset {
  generatedAt: string;
  stateSummary: FlowRadarStateSummary;
  moduleSummaries: ModuleFlowSummary[];
  districtSummaries: FlowRadarDistrictSummary[];
  zoneSummaries: FlowRadarZoneSummary[];
  departmentChannels: DepartmentChannelHeat[];
  flows: FlowPassport[];
}

const labels: Record<FlowModule, string> = {
  fund_flow: 'Fund Flow',
  file_flow: 'File Flow',
  grievance_flow: 'Grievance Flow',
  tender_flow: 'Tender Flow',
  project_flow: 'Project Flow',
  scheme_benefit_flow: 'Scheme Benefit Flow',
  certificate_service_flow: 'Certificate/Service Flow',
  vehicle_field_team_flow: 'Vehicle/Field Team Flow',
  material_supply_flow: 'Material Supply Flow',
  disaster_response_flow: 'Disaster Response Flow',
  inspection_flow: 'Inspection Flow',
  citizen_impact_flow: 'Citizen Impact Flow',
};

const directionalZones = ['North', 'South', 'East', 'West'] as const;

function directionalZoneForFlow(districtId: string, lat: number, lng: number) {
  const district = districtCatalog.find((item) => item.id === districtId);
  if (!district) return 'South';
  const latDiff = lat - district.lat;
  const lngDiff = lng - district.lng;
  if (Math.abs(latDiff) >= Math.abs(lngDiff)) {
    return latDiff >= 0 ? 'North' : 'South';
  }
  return lngDiff >= 0 ? 'East' : 'West';
}

function zoneFallbackPoint(districtId: string, zone: (typeof directionalZones)[number]) {
  const district = districtCatalog.find((item) => item.id === districtId);
  if (!district) return { lat: 10.75, lng: 78.4 };
  const latOffset = 0.11;
  const lngOffset = 0.13;
  switch (zone) {
    case 'North':
      return { lat: district.lat + latOffset, lng: district.lng };
    case 'South':
      return { lat: district.lat - latOffset, lng: district.lng };
    case 'East':
      return { lat: district.lat, lng: district.lng + lngOffset };
    case 'West':
      return { lat: district.lat, lng: district.lng - lngOffset };
    default:
      return { lat: district.lat, lng: district.lng };
  }
}

const flowPassports: FlowPassport[] = [
  {
    flowId: 'FR-FUND-CUD-001',
    flowType: 'fund_flow',
    title: 'Cuddalore Coastal Resilience Housing Fund Route',
    objectType: 'Fund Route',
    objectId: 'FUND-CUD-2026-11',
    districtId: 'cuddalore',
    district: 'Cuddalore',
    originStage: 'Budget Announcement',
    currentStage: 'Fund Release',
    currentOwner: 'Finance Department',
    destination: 'Citizen-ready coastal housing',
    outcome: 'Release lag affecting batch-3 housing progress',
    startDate: '2026-01-12',
    expectedEndDate: '2026-06-30',
    status: 'delayed',
    riskLevel: 'CRITICAL',
    riskScore: 86,
    confidenceScore: 0.89,
    delayDays: 41,
    elapsedPct: 78,
    progressPct: 52,
    lat: 11.719,
    lng: 79.764,
    lastUpdated: '2026-05-24T07:25:00.000Z',
    summary: 'Allocated and partially released funds have not translated into matching housing output.',
    linkedFlowIds: ['FR-PROJ-CUD-001', 'FR-IMPACT-CUD-001'],
    metrics: {
      announcedCrore: 132,
      allocatedCrore: 118,
      releasedCrore: 81,
      utilizedCrore: 52,
      physicalFinancialGap: '29%',
      impactEfficiency: 'Low',
    },
    route: [
      { id: 's1', label: 'Budget Announcement', owner: 'State Treasury', status: 'completed', completedAt: '2026-01-12', lat: 13.0827, lng: 80.2707 },
      { id: 's2', label: 'Department Allocation', owner: 'Housing & Disaster Management', status: 'completed', completedAt: '2026-01-26', lat: 13.067, lng: 80.259 },
      { id: 's3', label: 'District Allocation', owner: 'Cuddalore Collectorate', status: 'completed', completedAt: '2026-02-11', lat: 11.748, lng: 79.7714 },
      { id: 's4', label: 'Fund Release', owner: 'Finance Department', status: 'current', lat: 11.719, lng: 79.764 },
      { id: 's5', label: 'Impact Verification', owner: 'Citizen Verification Cell', status: 'upcoming', lat: 11.705, lng: 79.77 },
    ],
  },
  {
    flowId: 'FR-FILE-TRY-001',
    flowType: 'file_flow',
    title: 'Trichy Drainage Estimate Approval File',
    objectType: 'Administrative File',
    objectId: 'FILE-TRY-ENG-042',
    districtId: 'tiruchirappalli',
    district: 'Tiruchirappalli',
    originStage: 'File Created',
    currentStage: 'Municipal Engineer Review',
    currentOwner: 'Municipal Administration',
    destination: 'Technical approval',
    outcome: 'Estimate approval held at engineering desk',
    startDate: '2026-03-02',
    expectedEndDate: '2026-03-20',
    status: 'blocked',
    riskLevel: 'HIGH',
    riskScore: 74,
    confidenceScore: 0.85,
    delayDays: 27,
    elapsedPct: 100,
    progressPct: 54,
    lat: 10.857,
    lng: 78.692,
    lastUpdated: '2026-05-24T06:10:00.000Z',
    summary: 'Repeated clarification loop has slowed technical clearance for the underground drainage package.',
    linkedFlowIds: ['FR-PROJ-TRY-001'],
    metrics: {
      currentDeskAge: '27 days',
      totalFileAge: '43 days',
      clarificationCount: 3,
      sla: '7 days',
      bottleneckStage: 'Municipal Engineer Review',
    },
    route: [
      { id: 's1', label: 'File Created', owner: 'Zone Office', status: 'completed', completedAt: '2026-03-02', lat: 10.7905, lng: 78.7047 },
      { id: 's2', label: 'Initial Scrutiny', owner: 'Clerk', status: 'completed', completedAt: '2026-03-05', lat: 10.7905, lng: 78.7047 },
      { id: 's3', label: 'Section Officer', owner: 'Section Officer', status: 'completed', completedAt: '2026-03-12', lat: 10.805, lng: 78.698 },
      { id: 's4', label: 'Municipal Engineer Review', owner: 'Municipal Engineer', status: 'current', lat: 10.857, lng: 78.692 },
      { id: 's5', label: 'Commissioner Approval', owner: 'Commissioner', status: 'upcoming', lat: 10.79, lng: 78.705 },
    ],
  },
  {
    flowId: 'FR-GRV-CHE-001',
    flowType: 'grievance_flow',
    title: 'North Chennai Waterlogging Complaint Channel',
    objectType: 'Citizen Grievance',
    objectId: 'GRV-CHE-W42-118',
    districtId: 'chennai',
    district: 'Chennai',
    originStage: 'Complaint Registered',
    currentStage: 'Field Officer Assigned',
    currentOwner: 'Municipal Administration',
    destination: 'Citizen verified closure',
    outcome: 'Repeated complaint cluster remains unresolved',
    startDate: '2026-05-03',
    expectedEndDate: '2026-05-10',
    status: 'escalated',
    riskLevel: 'HIGH',
    riskScore: 79,
    confidenceScore: 0.92,
    delayDays: 18,
    elapsedPct: 100,
    progressPct: 48,
    lat: 13.1155,
    lng: 80.236,
    lastUpdated: '2026-05-24T06:35:00.000Z',
    summary: 'Complaint route reached field assignment but repeat overflow and reopened closures keep the channel hot.',
    linkedFlowIds: ['FR-IMPACT-CHE-001'],
    metrics: {
      complaintAge: '21 days',
      reopenRate: '22%',
      repeatDensity: 38,
      escalationRate: '16%',
      citizenConfirmationRate: '41%',
    },
    route: [
      { id: 's1', label: 'Complaint Registered', owner: 'Citizen Portal', status: 'completed', completedAt: '2026-05-03', lat: 13.1155, lng: 80.236 },
      { id: 's2', label: 'Categorized', owner: 'Grievance Cell', status: 'completed', completedAt: '2026-05-04', lat: 13.1, lng: 80.242 },
      { id: 's3', label: 'Department Assigned', owner: 'Municipal Administration', status: 'completed', completedAt: '2026-05-05', lat: 13.09, lng: 80.27 },
      { id: 's4', label: 'Field Officer Assigned', owner: 'Ward Engineer', status: 'current', lat: 13.1155, lng: 80.236 },
      { id: 's5', label: 'Citizen Verification', owner: 'Citizen Verification Cell', status: 'upcoming', lat: 13.11, lng: 80.24 },
    ],
  },
  {
    flowId: 'FR-TEN-CUD-001',
    flowType: 'tender_flow',
    title: 'Cyclone Shelter Prefab Procurement Flow',
    objectType: 'Tender Flow',
    objectId: 'TEND-CUD-2026-07',
    districtId: 'cuddalore',
    district: 'Cuddalore',
    originStage: 'Tender Drafted',
    currentStage: 'Work Order Issued',
    currentOwner: 'Procurement Cell',
    destination: 'Work started on shelter package',
    outcome: 'Single corridor of procurement to execution remains fragile',
    startDate: '2026-02-08',
    expectedEndDate: '2026-04-15',
    status: 'delayed',
    riskLevel: 'CRITICAL',
    riskScore: 84,
    confidenceScore: 0.88,
    delayDays: 32,
    elapsedPct: 100,
    progressPct: 63,
    lat: 11.732,
    lng: 79.776,
    lastUpdated: '2026-05-24T04:40:00.000Z',
    summary: 'Bid clustering and slow award-to-work-order conversion created a procurement-to-execution bottleneck.',
    linkedFlowIds: ['FR-PROJ-CUD-001'],
    metrics: {
      bidCount: 4,
      evaluationDelay: '14 days',
      awardDelay: '19 days',
      workOrderDelay: '12 days',
      contractorConcentration: 'High',
    },
    route: [
      { id: 's1', label: 'Tender Published', owner: 'Procurement Cell', status: 'completed', completedAt: '2026-02-08', lat: 11.748, lng: 79.7714 },
      { id: 's2', label: 'Bid Submission', owner: 'Vendors', status: 'completed', completedAt: '2026-02-19', lat: 11.748, lng: 79.7714 },
      { id: 's3', label: 'Technical Evaluation', owner: 'Tender Committee', status: 'completed', completedAt: '2026-03-03', lat: 11.74, lng: 79.77 },
      { id: 's4', label: 'Financial Evaluation', owner: 'Tender Committee', status: 'completed', completedAt: '2026-03-14', lat: 11.74, lng: 79.77 },
      { id: 's5', label: 'Work Order Issued', owner: 'Procurement Cell', status: 'current', lat: 11.732, lng: 79.776 },
      { id: 's6', label: 'Work Started', owner: 'Contractor', status: 'upcoming', lat: 11.719, lng: 79.764 },
    ],
  },
  {
    flowId: 'FR-PROJ-TRY-001',
    flowType: 'project_flow',
    title: 'Srirangam Underground Drainage Project Route',
    objectType: 'Project Flow',
    objectId: 'PRJ-TRY-2026-0042',
    districtId: 'tiruchirappalli',
    district: 'Tiruchirappalli',
    originStage: 'Administrative Sanction',
    currentStage: 'Execution',
    currentOwner: 'Municipal Administration',
    destination: 'Completion certificate and citizen verification',
    outcome: 'Progress moving, but lagging time line and nearby complaints remain active',
    startDate: '2026-01-20',
    expectedEndDate: '2026-07-30',
    status: 'in_progress',
    riskLevel: 'ELEVATED',
    riskScore: 57,
    confidenceScore: 0.9,
    delayDays: 19,
    elapsedPct: 66,
    progressPct: 54,
    lat: 10.857,
    lng: 78.692,
    lastUpdated: '2026-05-24T05:55:00.000Z',
    summary: 'Time elapsed and nearby drainage complaints suggest execution must accelerate before monsoon pressure rises.',
    linkedFlowIds: ['FR-FILE-TRY-001', 'FR-GRV-TRY-001'],
    metrics: {
      physicalProgress: '54%',
      financialProgress: '61%',
      spendWorkGap: '7%',
      complaintCorrelation: 18,
      verificationStatus: 'Inspection pending',
    },
    route: [
      { id: 's1', label: 'Administrative Sanction', owner: 'Commissioner', status: 'completed', completedAt: '2026-01-20', lat: 10.7905, lng: 78.7047 },
      { id: 's2', label: 'Technical Sanction', owner: 'Engineering Wing', status: 'completed', completedAt: '2026-02-02', lat: 10.81, lng: 78.7 },
      { id: 's3', label: 'Tender', owner: 'Procurement Cell', status: 'completed', completedAt: '2026-02-28', lat: 10.79, lng: 78.705 },
      { id: 's4', label: 'Work Order', owner: 'Municipal Administration', status: 'completed', completedAt: '2026-03-12', lat: 10.82, lng: 78.698 },
      { id: 's5', label: 'Execution', owner: 'Cauvery Civic EPC', status: 'current', lat: 10.857, lng: 78.692 },
      { id: 's6', label: 'Inspection', owner: 'Inspection Cell', status: 'upcoming', lat: 10.84, lng: 78.695 },
      { id: 's7', label: 'Citizen Verification', owner: 'Citizen Verification Cell', status: 'upcoming', lat: 10.855, lng: 78.69 },
    ],
  },
  {
    flowId: 'FR-SCH-THO-001',
    flowType: 'scheme_benefit_flow',
    title: 'South Coast Drinking Water Benefit Funnel',
    objectType: 'Scheme Benefit Flow',
    objectId: 'SCH-THO-WAT-08',
    districtId: 'thoothukudi',
    district: 'Thoothukudi',
    originStage: 'Eligible Population Identified',
    currentStage: 'Benefit Delivered',
    currentOwner: 'TWAD Board',
    destination: 'Impact verified reduction in tanker complaints',
    outcome: 'Delivery moving but beneficiary gap remains in harbor belts',
    startDate: '2026-01-25',
    expectedEndDate: '2026-06-10',
    status: 'in_progress',
    riskLevel: 'ELEVATED',
    riskScore: 62,
    confidenceScore: 0.87,
    delayDays: 14,
    elapsedPct: 74,
    progressPct: 61,
    lat: 8.781,
    lng: 78.129,
    lastUpdated: '2026-05-24T03:30:00.000Z',
    summary: 'Delivered benefits have improved access, but pending delivery pockets still match complaint corridors.',
    linkedFlowIds: ['FR-IMPACT-THO-001'],
    metrics: {
      eligiblePopulation: 81200,
      applications: 62140,
      approvals: 48910,
      delivered: 41200,
      beneficiaryGap: 40000,
      impactScore: 'Moderate',
    },
    route: [
      { id: 's1', label: 'Eligible Population Identified', owner: 'TWAD Board', status: 'completed', completedAt: '2026-01-25', lat: 8.7642, lng: 78.1348 },
      { id: 's2', label: 'Application Submitted', owner: 'Citizen Facilitation Centers', status: 'completed', completedAt: '2026-02-18', lat: 8.77, lng: 78.14 },
      { id: 's3', label: 'Verification', owner: 'Ward Verification Teams', status: 'completed', completedAt: '2026-03-14', lat: 8.775, lng: 78.136 },
      { id: 's4', label: 'Approval', owner: 'TWAD Board', status: 'completed', completedAt: '2026-04-02', lat: 8.78, lng: 78.129 },
      { id: 's5', label: 'Benefit Delivered', owner: 'Local Utility Teams', status: 'current', lat: 8.781, lng: 78.129 },
      { id: 's6', label: 'Impact Verified', owner: 'Impact Cell', status: 'upcoming', lat: 8.806, lng: 78.146 },
    ],
  },
  {
    flowId: 'FR-SVC-VEL-001',
    flowType: 'certificate_service_flow',
    title: 'Vellore Patta Transfer Service Flow',
    objectType: 'Citizen Service Flow',
    objectId: 'SRV-VEL-PATTA-118',
    districtId: 'vellore',
    district: 'Vellore',
    originStage: 'Application Submitted',
    currentStage: 'Field Verification',
    currentOwner: 'Revenue Department',
    destination: 'Certificate Delivered',
    outcome: 'Service SLA breach at field verification',
    startDate: '2026-04-04',
    expectedEndDate: '2026-04-19',
    status: 'delayed',
    riskLevel: 'HIGH',
    riskScore: 71,
    confidenceScore: 0.83,
    delayDays: 21,
    elapsedPct: 100,
    progressPct: 57,
    lat: 12.943,
    lng: 79.118,
    lastUpdated: '2026-05-24T02:45:00.000Z',
    summary: 'Patta transfer remains in field verification far beyond SLA and is contributing to citizen service dissatisfaction.',
    linkedFlowIds: [],
    metrics: {
      applicationAge: '31 days',
      slaBreachCount: 1,
      stageDelay: '21 days',
      clarificationRate: '18%',
      deliveryTime: 'Pending',
    },
    route: [
      { id: 's1', label: 'Application Submitted', owner: 'e-Sevai Center', status: 'completed', completedAt: '2026-04-04', lat: 12.9165, lng: 79.1325 },
      { id: 's2', label: 'Document Verification', owner: 'Revenue Clerk', status: 'completed', completedAt: '2026-04-09', lat: 12.925, lng: 79.128 },
      { id: 's3', label: 'Field Verification', owner: 'Village Administrative Officer', status: 'current', lat: 12.943, lng: 79.118 },
      { id: 's4', label: 'Approval', owner: 'Tahsildar', status: 'upcoming', lat: 12.93, lng: 79.14 },
      { id: 's5', label: 'Certificate Delivered', owner: 'Revenue Department', status: 'upcoming', lat: 12.9165, lng: 79.1325 },
    ],
  },
  {
    flowId: 'FR-VEH-CHE-001',
    flowType: 'vehicle_field_team_flow',
    title: 'North Chennai Water Tanker Route 7',
    objectType: 'Field Team Route',
    objectId: 'VEH-CHE-TANK-07',
    districtId: 'chennai',
    district: 'Chennai',
    originStage: 'Depot / Office',
    currentStage: 'Current Location',
    currentOwner: 'Municipal Administration',
    destination: 'Assigned service points completed',
    outcome: 'Assigned service points remain partially unserved',
    startDate: '2026-05-24',
    expectedEndDate: '2026-05-24',
    status: 'delayed',
    riskLevel: 'HIGH',
    riskScore: 67,
    confidenceScore: 0.81,
    delayDays: 1,
    elapsedPct: 72,
    progressPct: 45,
    lat: 13.09,
    lng: 80.27,
    lastUpdated: '2026-05-24T07:10:00.000Z',
    summary: 'Route completion is lagging with three planned service points still pending and GPS silence recorded.',
    linkedFlowIds: ['FR-SCH-THO-001'],
    metrics: {
      assignedStops: 8,
      completedStops: 5,
      gpsInactiveTime: '42 min',
      taskCompletionRate: '62%',
      missedServicePoints: 3,
    },
    route: [
      { id: 's1', label: 'Depot / Office', owner: 'Tanker Depot', status: 'completed', completedAt: '2026-05-24T05:30:00.000Z', lat: 13.0827, lng: 80.2707 },
      { id: 's2', label: 'Assigned Route', owner: 'Dispatch Cell', status: 'completed', completedAt: '2026-05-24T05:45:00.000Z', lat: 13.092, lng: 80.255 },
      { id: 's3', label: 'Current Location', owner: 'Route 7 Team', status: 'current', lat: 13.09, lng: 80.27 },
      { id: 's4', label: 'Task Completed', owner: 'Field Team', status: 'upcoming', lat: 13.1155, lng: 80.236 },
    ],
  },
  {
    flowId: 'FR-MAT-MDU-001',
    flowType: 'material_supply_flow',
    title: 'Madurai PHC Medicine Stock Route',
    objectType: 'Material Supply Flow',
    objectId: 'MAT-MDU-MED-014',
    districtId: 'madurai',
    district: 'Madurai',
    originStage: 'State Warehouse',
    currentStage: 'District Warehouse',
    currentOwner: 'Health Department',
    destination: 'PHC stock replenished',
    outcome: 'Supply reached district but not all final facilities',
    startDate: '2026-05-02',
    expectedEndDate: '2026-05-07',
    status: 'blocked',
    riskLevel: 'HIGH',
    riskScore: 76,
    confidenceScore: 0.84,
    delayDays: 17,
    elapsedPct: 100,
    progressPct: 58,
    lat: 9.939,
    lng: 78.1242,
    lastUpdated: '2026-05-24T05:05:00.000Z',
    summary: 'Medicine stock reached district storage but final PHC routing is incomplete, causing local stock stress.',
    linkedFlowIds: ['FR-IMPACT-MDU-001'],
    metrics: {
      dispatchDelay: '0 days',
      receiptDelay: '3 days',
      stockoutDays: 5,
      lastMileDeliveryRate: '61%',
      demandSupplyGap: '18%',
    },
    route: [
      { id: 's1', label: 'State Warehouse', owner: 'Medical Services Corp', status: 'completed', completedAt: '2026-05-02', lat: 13.067, lng: 80.259 },
      { id: 's2', label: 'District Warehouse', owner: 'District Medical Store', status: 'current', lat: 9.939, lng: 78.1242 },
      { id: 's3', label: 'Block Store', owner: 'Block Medical Store', status: 'upcoming', lat: 9.93, lng: 78.138 },
      { id: 's4', label: 'Local Institution', owner: 'PHC', status: 'upcoming', lat: 9.921, lng: 78.119 },
    ],
  },
  {
    flowId: 'FR-DIS-CUD-001',
    flowType: 'disaster_response_flow',
    title: 'Cuddalore Flood Watch Response Chain',
    objectType: 'Disaster Response Flow',
    objectId: 'DIS-CUD-FLOOD-09',
    districtId: 'cuddalore',
    district: 'Cuddalore',
    originStage: 'Alert Generated',
    currentStage: 'Supplies Dispatched',
    currentOwner: 'Disaster Management',
    destination: 'Recovery Closed',
    outcome: 'Preparedness improved but relief center activation is incomplete',
    startDate: '2026-05-20',
    expectedEndDate: '2026-05-26',
    status: 'in_progress',
    riskLevel: 'CRITICAL',
    riskScore: 82,
    confidenceScore: 0.9,
    delayDays: 3,
    elapsedPct: 74,
    progressPct: 49,
    lat: 11.739,
    lng: 79.786,
    lastUpdated: '2026-05-24T04:18:00.000Z',
    summary: 'High-risk flood watch still shows a preparedness gap in relief center activation and pump deployment.',
    linkedFlowIds: ['FR-MAT-MDU-001', 'FR-VEH-CHE-001'],
    metrics: {
      alertToAction: '3h 20m',
      reliefCentersOpened: '6/12',
      supplyDeliveryRate: '48%',
      responseCoverage: '59%',
      preparednessGap: 'High',
    },
    route: [
      { id: 's1', label: 'Alert Generated', owner: 'Weather Cell', status: 'completed', completedAt: '2026-05-20T04:30:00.000Z', lat: 11.748, lng: 79.7714 },
      { id: 's2', label: 'District Warning Issued', owner: 'Collectorate', status: 'completed', completedAt: '2026-05-20T06:10:00.000Z', lat: 11.748, lng: 79.7714 },
      { id: 's3', label: 'Response Team Assigned', owner: 'Disaster Management', status: 'completed', completedAt: '2026-05-20T08:00:00.000Z', lat: 11.739, lng: 79.786 },
      { id: 's4', label: 'Supplies Dispatched', owner: 'Relief Logistics', status: 'current', lat: 11.739, lng: 79.786 },
      { id: 's5', label: 'People Assisted', owner: 'Field Teams', status: 'upcoming', lat: 11.719, lng: 79.764 },
      { id: 's6', label: 'Recovery Closed', owner: 'Collectorate', status: 'upcoming', lat: 11.705, lng: 79.77 },
    ],
  },
  {
    flowId: 'FR-INSP-SAL-001',
    flowType: 'inspection_flow',
    title: 'Salem School Safety Inspection Cycle',
    objectType: 'Inspection Flow',
    objectId: 'INSP-SAL-SCH-22',
    districtId: 'salem',
    district: 'Salem',
    originStage: 'Inspection Scheduled',
    currentStage: 'Rectification Ordered',
    currentOwner: 'School Education',
    destination: 'Closure with reinspection',
    outcome: 'Critical defects found but follow-up rectification is incomplete',
    startDate: '2026-04-18',
    expectedEndDate: '2026-05-12',
    status: 'escalated',
    riskLevel: 'HIGH',
    riskScore: 73,
    confidenceScore: 0.88,
    delayDays: 12,
    elapsedPct: 100,
    progressPct: 63,
    lat: 11.695,
    lng: 78.177,
    lastUpdated: '2026-05-24T05:15:00.000Z',
    summary: 'Safety defects were identified, but rectification pace is behind the planned reinspection schedule.',
    linkedFlowIds: ['FR-PROJ-SAL-001'],
    metrics: {
      scheduledVsCompleted: '15/9',
      criticalDefectCount: 3,
      rectificationDelay: '12 days',
      reinspectionPending: 2,
      recurringDefectRate: '18%',
    },
    route: [
      { id: 's1', label: 'Inspection Scheduled', owner: 'School Safety Cell', status: 'completed', completedAt: '2026-04-18', lat: 11.6643, lng: 78.146 },
      { id: 's2', label: 'Site Visited', owner: 'Inspection Officer', status: 'completed', completedAt: '2026-04-28', lat: 11.695, lng: 78.177 },
      { id: 's3', label: 'Defect Noted', owner: 'Inspection Officer', status: 'completed', completedAt: '2026-04-28', lat: 11.695, lng: 78.177 },
      { id: 's4', label: 'Rectification Ordered', owner: 'School Education', status: 'current', lat: 11.695, lng: 78.177 },
      { id: 's5', label: 'Reinspection', owner: 'Inspection Officer', status: 'upcoming', lat: 11.695, lng: 78.177 },
    ],
  },
  {
    flowId: 'FR-IMPACT-CHE-001',
    flowType: 'citizen_impact_flow',
    title: 'North Chennai Drainage Impact Verification',
    objectType: 'Impact Flow',
    objectId: 'IMP-CHE-DRG-11',
    districtId: 'chennai',
    district: 'Chennai',
    originStage: 'Problem Detected',
    currentStage: 'Complaints Reduced?',
    currentOwner: 'Impact Verification Cell',
    destination: 'Impact verified',
    outcome: 'Completed work has not yet produced enough complaint reduction',
    startDate: '2026-02-15',
    expectedEndDate: '2026-05-20',
    status: 'disputed',
    riskLevel: 'HIGH',
    riskScore: 77,
    confidenceScore: 0.82,
    delayDays: 9,
    elapsedPct: 96,
    progressPct: 58,
    lat: 13.1155,
    lng: 80.236,
    lastUpdated: '2026-05-24T06:20:00.000Z',
    summary: 'Despite project completion claims, complaint reduction remains weak and citizen verification is still negative.',
    linkedFlowIds: ['FR-GRV-CHE-001', 'FR-PROJ-CHE-001'],
    metrics: {
      beforeComplaints: 72,
      afterComplaints: 61,
      complaintReduction: '15%',
      citizenVerificationRate: '38%',
      impactMismatch: 'High',
    },
    route: [
      { id: 's1', label: 'Problem Detected', owner: 'Analytics Cell', status: 'completed', completedAt: '2026-02-15', lat: 13.1155, lng: 80.236 },
      { id: 's2', label: 'Action Started', owner: 'Municipal Administration', status: 'completed', completedAt: '2026-03-02', lat: 13.1, lng: 80.242 },
      { id: 's3', label: 'Work Completed', owner: 'Contractor', status: 'completed', completedAt: '2026-05-04', lat: 13.1, lng: 80.242 },
      { id: 's4', label: 'Complaints Reduced?', owner: 'Impact Verification Cell', status: 'current', lat: 13.1155, lng: 80.236 },
      { id: 's5', label: 'Impact Verified', owner: 'Citizen Verification Cell', status: 'upcoming', lat: 13.11, lng: 80.24 },
    ],
  },
  {
    flowId: 'FR-PROJ-CUD-001',
    flowType: 'project_flow',
    title: 'Cuddalore Coastal Housing Execution Route',
    objectType: 'Project Flow',
    objectId: 'PRJ-CUD-2026-008',
    districtId: 'cuddalore',
    district: 'Cuddalore',
    originStage: 'Administrative Sanction',
    currentStage: 'Execution',
    currentOwner: 'Housing & Disaster Management',
    destination: 'Completion certificate',
    outcome: 'Housing execution is lagging despite sanction, tender, and fund movement',
    startDate: '2026-01-18',
    expectedEndDate: '2026-06-15',
    status: 'delayed',
    riskLevel: 'CRITICAL',
    riskScore: 88,
    confidenceScore: 0.91,
    delayDays: 46,
    elapsedPct: 84,
    progressPct: 39,
    lat: 11.719,
    lng: 79.764,
    lastUpdated: '2026-05-24T07:20:00.000Z',
    summary: 'Execution is far behind elapsed time with linked fund and tender bottlenecks and high nearby grievance pressure.',
    linkedFlowIds: ['FR-FUND-CUD-001', 'FR-TEN-CUD-001', 'FR-DIS-CUD-001'],
    metrics: {
      physicalProgress: '39%',
      financialProgress: '57%',
      delayGap: '45%',
      complaintCorrelation: 44,
      verificationStatus: 'Unverified',
    },
    route: [
      { id: 's1', label: 'Administrative Sanction', owner: 'Housing & Disaster Management', status: 'completed', completedAt: '2026-01-18', lat: 11.748, lng: 79.7714 },
      { id: 's2', label: 'Tender', owner: 'Procurement Cell', status: 'completed', completedAt: '2026-02-08', lat: 11.748, lng: 79.7714 },
      { id: 's3', label: 'Work Order', owner: 'Procurement Cell', status: 'completed', completedAt: '2026-03-26', lat: 11.732, lng: 79.776 },
      { id: 's4', label: 'Execution', owner: 'Delta Habitat Alliance', status: 'current', lat: 11.719, lng: 79.764 },
      { id: 's5', label: 'Completion Certificate', owner: 'Engineering Wing', status: 'upcoming', lat: 11.719, lng: 79.764 },
    ],
  },
];

const zonedFlowPassports = flowPassports.map((flow) => ({
  ...flow,
  zone: directionalZoneForFlow(flow.districtId, flow.lat, flow.lng),
}));

const withDistricts = districtCatalog.slice(0, 12);

const moduleSummaries: ModuleFlowSummary[] = (Object.keys(labels) as FlowModule[]).map((module) => {
  const items = zonedFlowPassports.filter((flow) => flow.flowType === module);
  const active = items.filter((flow) => !['closed', 'completed', 'verified'].includes(flow.status)).length;
  const delayed = items.filter((flow) => ['delayed', 'blocked', 'escalated', 'disputed'].includes(flow.status)).length;
  const critical = items.filter((flow) => flow.riskLevel === 'CRITICAL').length;
  return {
    module,
    label: labels[module],
    activeFlows: active,
    delayedFlows: delayed,
    criticalFlows: critical,
    avgRiskScore: items.length ? Math.round(items.reduce((sum, item) => sum + item.riskScore, 0) / items.length) : 0,
    topBottleneck: items.sort((a, b) => b.delayDays - a.delayDays)[0]?.currentStage ?? 'No active bottleneck',
  };
});

const districtSummaries: FlowRadarDistrictSummary[] = withDistricts.map((item) => {
  const flows = zonedFlowPassports.filter((flow) => flow.districtId === item.id);
  const moduleCounts = Object.fromEntries((Object.keys(labels) as FlowModule[]).map((module) => [module, flows.filter((flow) => flow.flowType === module).length])) as Record<FlowModule, number>;
  return {
    districtId: item.id,
    district: item.name,
    lat: item.lat,
    lng: item.lng,
    flowScore: flows.length ? Math.round(flows.reduce((sum, flow) => sum + flow.riskScore, 0) / flows.length) : 0,
    activeFlows: flows.filter((flow) => !['closed', 'completed', 'verified'].includes(flow.status)).length,
    delayedFlows: flows.filter((flow) => ['delayed', 'blocked', 'escalated', 'disputed'].includes(flow.status)).length,
    criticalFlows: flows.filter((flow) => flow.riskLevel === 'CRITICAL').length,
    topBottleneck: flows.sort((a, b) => b.delayDays - a.delayDays)[0]?.currentStage ?? 'None',
    moduleCounts,
  };
});

const zoneSummaries: FlowRadarZoneSummary[] = districtSummaries.flatMap((district) => {
  const districtFlows = zonedFlowPassports.filter((flow) => flow.districtId === district.districtId);
  return directionalZones.map((zoneName) => {
    const zoneFlows = districtFlows.filter((flow) => flow.zone === zoneName);
    const moduleCounts = Object.fromEntries(
      (Object.keys(labels) as FlowModule[]).map((module) => [module, zoneFlows.filter((flow) => flow.flowType === module).length]),
    ) as Record<FlowModule, number>;
    const fallback = zoneFallbackPoint(district.districtId, zoneName);
    return {
      id: `${district.districtId}-${zoneName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      districtId: district.districtId,
      district: district.district,
      zone: zoneName,
      lat: Number((zoneFlows.length ? zoneFlows.reduce((sum, flow) => sum + flow.lat, 0) / zoneFlows.length : fallback.lat).toFixed(4)),
      lng: Number((zoneFlows.length ? zoneFlows.reduce((sum, flow) => sum + flow.lng, 0) / zoneFlows.length : fallback.lng).toFixed(4)),
      flowScore: zoneFlows.length ? Math.round(zoneFlows.reduce((sum, flow) => sum + flow.riskScore, 0) / zoneFlows.length) : district.flowScore,
      activeFlows: zoneFlows.filter((flow) => !['closed', 'completed', 'verified'].includes(flow.status)).length,
      delayedFlows: zoneFlows.filter((flow) => ['delayed', 'blocked', 'escalated', 'disputed'].includes(flow.status)).length,
      criticalFlows: zoneFlows.filter((flow) => flow.riskLevel === 'CRITICAL').length,
      topBottleneck: [...zoneFlows].sort((a, b) => b.delayDays - a.delayDays)[0]?.currentStage ?? 'None',
      moduleCounts,
    };
  });
});

const departmentChannels: DepartmentChannelHeat[] = Array.from(
  zonedFlowPassports.reduce((map, flow) => {
    const key = flow.currentOwner;
    const current = map.get(key) ?? [];
    current.push(flow);
    map.set(key, current);
    return map;
  }, new Map<string, FlowPassport[]>()),
).map(([department, flows]) => {
  const criticalCount = flows.filter((flow) => flow.riskLevel === 'CRITICAL').length;
  const delayedCount = flows.filter((flow) => ['delayed', 'blocked', 'escalated', 'disputed'].includes(flow.status)).length;
  const heatScore = Math.min(100, Math.round((flows.reduce((sum, flow) => sum + flow.riskScore, 0) / flows.length) + criticalCount * 4));
  const latest = [...flows].sort((a, b) => +new Date(b.lastUpdated) - +new Date(a.lastUpdated))[0];
  return {
    department,
    modules: Array.from(new Set(flows.map((flow) => flow.flowType))),
    flowCount: flows.length,
    delayedCount,
    criticalCount,
    heatScore,
    districts: Array.from(new Set(flows.map((flow) => flow.district))),
    latestFlowId: latest.flowId,
    latestFlowTitle: latest.title,
    bottleneck: flows.sort((a, b) => b.delayDays - a.delayDays)[0]?.currentStage ?? 'None',
  };
}).sort((a, b) => b.heatScore - a.heatScore);

const stateSummary: FlowRadarStateSummary = {
  totalActiveFlows: zonedFlowPassports.filter((flow) => !['closed', 'completed', 'verified'].includes(flow.status)).length,
  totalDelayedFlows: zonedFlowPassports.filter((flow) => ['delayed', 'blocked', 'escalated', 'disputed'].includes(flow.status)).length,
  criticalRiskFlows: zonedFlowPassports.filter((flow) => flow.riskLevel === 'CRITICAL').length,
  districtRiskRanking: [...districtSummaries]
    .sort((a, b) => b.flowScore - a.flowScore)
    .slice(0, 8)
    .map((item) => ({ district: item.district, flowScore: item.flowScore })),
  departmentBottlenecks: departmentChannels.slice(0, 8).map((item) => ({
    department: item.department,
    heatScore: item.heatScore,
    bottleneck: item.bottleneck,
  })),
  moduleRiskSummary: moduleSummaries.map((item) => ({
    module: item.module,
    delayedFlows: item.delayedFlows,
    criticalFlows: item.criticalFlows,
  })),
};

export const flowRadarDataset: FlowRadarDataset = {
  generatedAt: '2026-05-24T08:15:00.000Z',
  stateSummary,
  moduleSummaries,
  districtSummaries,
  zoneSummaries,
  departmentChannels,
  flows: zonedFlowPassports,
};

export const flowModuleLabels = labels;

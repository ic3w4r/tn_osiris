export type RiskLevel = 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface DistrictSnapshot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  populationLakhs: number;
  governanceScore: number;
  riskLevel: RiskLevel;
  topIssue: string;
  pendingGrievances: number;
  delayedProjects: number;
  schemeCoverage: number;
  budgetUtilization: number;
  budgetAllocatedCrore: number;
  budgetUtilizedCrore: number;
  disasterRisk: string;
  alerts: number;
}

export interface GovernanceEntity {
  id: string;
  districtId: string;
  district: string;
  zone?: string;
  name: string;
  category: string;
  riskLevel: RiskLevel;
  status: string;
  lat: number;
  lng: number;
}

export interface ProjectEntity extends GovernanceEntity {
  completion: number;
  delayDays: number;
  budgetCrore: number;
  contractor: string;
  department: string;
}

export interface GrievanceEntity extends GovernanceEntity {
  pending: number;
  closureDays: number;
  reopenedRate: number;
  intensity: number;
}

export interface SchemeEntity extends GovernanceEntity {
  beneficiaries: number;
  targetAchievement: number;
  fundsReleasedCrore: number;
  fundsUtilizedCrore: number;
  department: string;
}

export interface TenderEntity extends GovernanceEntity {
  tenderValueCrore: number;
  bidSpreadPct: number;
  flags: string[];
}

export interface AssetEntity extends GovernanceEntity {
  serviceScore: number;
  ownerDepartment: string;
}

export interface AlertEntity {
  id: string;
  title: string;
  districtId: string;
  district: string;
  zone?: string;
  severity: RiskLevel;
  type: 'grievance' | 'project' | 'scheme' | 'tender' | 'disaster';
  timestamp: string;
  summary: string;
  lat: number;
  lng: number;
}

export interface FeedItem {
  id: string;
  title: string;
  districtId: string;
  district: string;
  zone?: string;
  department: string;
  severity: RiskLevel;
  timestamp: string;
  summary: string;
  lat: number;
  lng: number;
}

export interface DistrictZoneSnapshot {
  id: string;
  districtId: string;
  district: string;
  zone: string;
  lat: number;
  lng: number;
  riskLevel: RiskLevel;
  pendingGrievances: number;
  delayedProjects: number;
  activeSchemes: number;
  trackedAssets: number;
  liveAlerts: number;
  budgetAllocatedCrore: number;
  budgetUtilizedCrore: number;
  governanceScore: number;
  topIssue: string;
}

export interface GovernanceDashboardData {
  generatedAt: string;
  statewideSummary: {
    monitoredDistricts: number;
    highRiskDistricts: number;
    activeAlerts: number;
    delayedProjects: number;
    pendingGrievances: number;
    tenderValueAtRiskCrore: number;
    schemeDeliveryRate: number;
    budgetUtilization: number;
    publicAssetsTracked: number;
  };
  districts: DistrictSnapshot[];
  zones: DistrictZoneSnapshot[];
  projects: ProjectEntity[];
  grievances: GrievanceEntity[];
  schemes: SchemeEntity[];
  tenders: TenderEntity[];
  assets: AssetEntity[];
  alerts: AlertEntity[];
  feed: FeedItem[];
}

export const districtCatalog: DistrictSnapshot[] = [
  { id: 'chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707, populationLakhs: 71, governanceScore: 78, riskLevel: 'HIGH', topIssue: 'Stormwater and road restoration backlog', pendingGrievances: 482, delayedProjects: 7, schemeCoverage: 82, budgetUtilization: 76, budgetAllocatedCrore: 1420, budgetUtilizedCrore: 1081, disasterRisk: 'Urban flooding', alerts: 5 },
  { id: 'coimbatore', name: 'Coimbatore', lat: 11.0168, lng: 76.9558, populationLakhs: 38, governanceScore: 84, riskLevel: 'ELEVATED', topIssue: 'Water supply intermittency in western wards', pendingGrievances: 201, delayedProjects: 3, schemeCoverage: 88, budgetUtilization: 81, budgetAllocatedCrore: 910, budgetUtilizedCrore: 737, disasterRisk: 'Heat stress', alerts: 2 },
  { id: 'madurai', name: 'Madurai', lat: 9.9252, lng: 78.1198, populationLakhs: 32, governanceScore: 74, riskLevel: 'HIGH', topIssue: 'Hospital load and sanitation complaints', pendingGrievances: 263, delayedProjects: 5, schemeCoverage: 79, budgetUtilization: 73, budgetAllocatedCrore: 845, budgetUtilizedCrore: 617, disasterRisk: 'Heat stress', alerts: 4 },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047, populationLakhs: 27, governanceScore: 81, riskLevel: 'ELEVATED', topIssue: 'Pipe replacement and drainage works', pendingGrievances: 174, delayedProjects: 4, schemeCoverage: 86, budgetUtilization: 84, budgetAllocatedCrore: 782, budgetUtilizedCrore: 657, disasterRisk: 'Riverine flood pockets', alerts: 2 },
  { id: 'salem', name: 'Salem', lat: 11.6643, lng: 78.146, populationLakhs: 35, governanceScore: 76, riskLevel: 'ELEVATED', topIssue: 'School repair completion slippage', pendingGrievances: 187, delayedProjects: 5, schemeCoverage: 80, budgetUtilization: 72, budgetAllocatedCrore: 768, budgetUtilizedCrore: 553, disasterRisk: 'Water stress', alerts: 3 },
  { id: 'tirunelveli', name: 'Tirunelveli', lat: 8.7139, lng: 77.7567, populationLakhs: 31, governanceScore: 83, riskLevel: 'LOW', topIssue: 'Rural road maintenance', pendingGrievances: 118, delayedProjects: 2, schemeCoverage: 89, budgetUtilization: 85, budgetAllocatedCrore: 690, budgetUtilizedCrore: 587, disasterRisk: 'Cyclone spillover', alerts: 1 },
  { id: 'thanjavur', name: 'Thanjavur', lat: 10.787, lng: 79.1378, populationLakhs: 24, governanceScore: 79, riskLevel: 'ELEVATED', topIssue: 'Irrigation channel desilting timing', pendingGrievances: 156, delayedProjects: 3, schemeCoverage: 87, budgetUtilization: 78, budgetAllocatedCrore: 655, budgetUtilizedCrore: 511, disasterRisk: 'Delta flooding', alerts: 2 },
  { id: 'erode', name: 'Erode', lat: 11.341, lng: 77.7172, populationLakhs: 23, governanceScore: 82, riskLevel: 'LOW', topIssue: 'Anganwadi refurbishment', pendingGrievances: 101, delayedProjects: 2, schemeCoverage: 90, budgetUtilization: 83, budgetAllocatedCrore: 604, budgetUtilizedCrore: 501, disasterRisk: 'Heat stress', alerts: 1 },
  { id: 'cuddalore', name: 'Cuddalore', lat: 11.748, lng: 79.7714, populationLakhs: 26, governanceScore: 71, riskLevel: 'CRITICAL', topIssue: 'Cyclone preparedness and coastal housing delays', pendingGrievances: 296, delayedProjects: 8, schemeCoverage: 75, budgetUtilization: 68, budgetAllocatedCrore: 812, budgetUtilizedCrore: 552, disasterRisk: 'Cyclone and coastal flooding', alerts: 6 },
  { id: 'thoothukudi', name: 'Thoothukudi', lat: 8.7642, lng: 78.1348, populationLakhs: 19, governanceScore: 77, riskLevel: 'HIGH', topIssue: 'Desalination and port access complaints', pendingGrievances: 149, delayedProjects: 4, schemeCoverage: 81, budgetUtilization: 75, budgetAllocatedCrore: 588, budgetUtilizedCrore: 441, disasterRisk: 'Coastal erosion', alerts: 3 },
  { id: 'kancheepuram', name: 'Kancheepuram', lat: 12.8342, lng: 79.7036, populationLakhs: 29, governanceScore: 80, riskLevel: 'ELEVATED', topIssue: 'Peripheral urban service pressure', pendingGrievances: 194, delayedProjects: 3, schemeCoverage: 84, budgetUtilization: 80, budgetAllocatedCrore: 734, budgetUtilizedCrore: 587, disasterRisk: 'Floodplain encroachment', alerts: 2 },
  { id: 'vellore', name: 'Vellore', lat: 12.9165, lng: 79.1325, populationLakhs: 22, governanceScore: 78, riskLevel: 'ELEVATED', topIssue: 'PHC staffing gaps', pendingGrievances: 137, delayedProjects: 3, schemeCoverage: 83, budgetUtilization: 79, budgetAllocatedCrore: 621, budgetUtilizedCrore: 491, disasterRisk: 'Heat stress', alerts: 2 },
];

const projects: ProjectEntity[] = [
  { id: 'p1', districtId: 'chennai', district: 'Chennai', name: 'North Chennai Stormwater Grid Phase II', category: 'Flood Mitigation', riskLevel: 'HIGH', status: 'Delayed', lat: 13.121, lng: 80.291, completion: 62, delayDays: 94, budgetCrore: 412, contractor: 'TNRDC Infra Consortium', department: 'Municipal Administration' },
  { id: 'p2', districtId: 'coimbatore', district: 'Coimbatore', name: 'Western Ring Road Utility Relocation', category: 'Roads', riskLevel: 'ELEVATED', status: 'Monitoring', lat: 11.0403, lng: 76.904, completion: 71, delayDays: 28, budgetCrore: 188, contractor: 'Kovai Mobility Works', department: 'Highways' },
  { id: 'p3', districtId: 'madurai', district: 'Madurai', name: 'Rajaji Hospital Capacity Upgrade', category: 'Health', riskLevel: 'HIGH', status: 'At Risk', lat: 9.939, lng: 78.1242, completion: 54, delayDays: 67, budgetCrore: 236, contractor: 'Vaigai Public Works', department: 'Health Department' },
  { id: 'p4', districtId: 'tiruchirappalli', district: 'Tiruchirappalli', name: 'Srirangam Underground Drainage Package', category: 'Urban Services', riskLevel: 'ELEVATED', status: 'Monitoring', lat: 10.857, lng: 78.692, completion: 66, delayDays: 31, budgetCrore: 124, contractor: 'Cauvery Civic EPC', department: 'Municipal Administration' },
  { id: 'p5', districtId: 'salem', district: 'Salem', name: 'District School Safety Retrofit Cluster', category: 'Education', riskLevel: 'HIGH', status: 'Delayed', lat: 11.676, lng: 78.134, completion: 48, delayDays: 83, budgetCrore: 97, contractor: 'Kurinji Infra', department: 'School Education' },
  { id: 'p6', districtId: 'cuddalore', district: 'Cuddalore', name: 'Coastal Resilient Housing Batch 3', category: 'Housing', riskLevel: 'CRITICAL', status: 'Critical', lat: 11.719, lng: 79.764, completion: 39, delayDays: 121, budgetCrore: 309, contractor: 'Delta Habitat Alliance', department: 'Housing & Disaster Management' },
  { id: 'p7', districtId: 'thoothukudi', district: 'Thoothukudi', name: 'Harbour Desalination Link Main', category: 'Water Supply', riskLevel: 'HIGH', status: 'At Risk', lat: 8.792, lng: 78.157, completion: 58, delayDays: 59, budgetCrore: 211, contractor: 'Blue Coast Utilities', department: 'TWAD Board' },
  { id: 'p8', districtId: 'thanjavur', district: 'Thanjavur', name: 'Delta Canal Desilting Acceleration', category: 'Irrigation', riskLevel: 'ELEVATED', status: 'Monitoring', lat: 10.802, lng: 79.121, completion: 74, delayDays: 19, budgetCrore: 88, contractor: 'Kallanai Hydro Works', department: 'Water Resources' },
  { id: 'p9', districtId: 'vellore', district: 'Vellore', name: 'Primary Health Centre Modernization Bundle', category: 'Health', riskLevel: 'ELEVATED', status: 'On Track', lat: 12.933, lng: 79.145, completion: 81, delayDays: 12, budgetCrore: 54, contractor: 'Arcot Care Build', department: 'Health Department' },
  { id: 'p10', districtId: 'kancheepuram', district: 'Kancheepuram', name: 'Peripheral Sewer Trunk Expansion', category: 'Urban Services', riskLevel: 'ELEVATED', status: 'Monitoring', lat: 12.86, lng: 79.72, completion: 69, delayDays: 27, budgetCrore: 141, contractor: 'CMDA Utilities JV', department: 'Municipal Administration' },
];

const grievances: GrievanceEntity[] = [
  { id: 'g1', districtId: 'chennai', district: 'Chennai', name: 'Perambur waterlogging cluster', category: 'Grievance Heatmap', riskLevel: 'HIGH', status: 'Pending', lat: 13.1155, lng: 80.236, pending: 113, closureDays: 29, reopenedRate: 21, intensity: 88 },
  { id: 'g2', districtId: 'chennai', district: 'Chennai', name: 'Sholinganallur road restoration backlog', category: 'Grievance Heatmap', riskLevel: 'HIGH', status: 'Pending', lat: 12.9012, lng: 80.2279, pending: 96, closureDays: 32, reopenedRate: 18, intensity: 82 },
  { id: 'g3', districtId: 'coimbatore', district: 'Coimbatore', name: 'Vadavalli supply interruptions', category: 'Grievance Heatmap', riskLevel: 'ELEVATED', status: 'Monitoring', lat: 11.032, lng: 76.902, pending: 57, closureDays: 18, reopenedRate: 12, intensity: 63 },
  { id: 'g4', districtId: 'madurai', district: 'Madurai', name: 'Central sanitation repeat complaints', category: 'Grievance Heatmap', riskLevel: 'HIGH', status: 'Pending', lat: 9.921, lng: 78.119, pending: 72, closureDays: 27, reopenedRate: 19, intensity: 77 },
  { id: 'g5', districtId: 'tiruchirappalli', district: 'Tiruchirappalli', name: 'Thuvakudi drainage overflow pocket', category: 'Grievance Heatmap', riskLevel: 'ELEVATED', status: 'Monitoring', lat: 10.755, lng: 78.813, pending: 41, closureDays: 16, reopenedRate: 10, intensity: 58 },
  { id: 'g6', districtId: 'salem', district: 'Salem', name: 'School bus access road complaints', category: 'Grievance Heatmap', riskLevel: 'ELEVATED', status: 'Monitoring', lat: 11.69, lng: 78.113, pending: 49, closureDays: 23, reopenedRate: 13, intensity: 61 },
  { id: 'g7', districtId: 'cuddalore', district: 'Cuddalore', name: 'Panruti cyclone shelter readiness', category: 'Grievance Heatmap', riskLevel: 'CRITICAL', status: 'Escalated', lat: 11.773, lng: 79.552, pending: 84, closureDays: 35, reopenedRate: 24, intensity: 93 },
  { id: 'g8', districtId: 'thoothukudi', district: 'Thoothukudi', name: 'Harbour desalination tanker delays', category: 'Grievance Heatmap', riskLevel: 'HIGH', status: 'Pending', lat: 8.806, lng: 78.146, pending: 43, closureDays: 26, reopenedRate: 15, intensity: 70 },
  { id: 'g9', districtId: 'kancheepuram', district: 'Kancheepuram', name: 'Tambaram fringe drainage complaints', category: 'Grievance Heatmap', riskLevel: 'ELEVATED', status: 'Monitoring', lat: 12.923, lng: 80.127, pending: 51, closureDays: 20, reopenedRate: 11, intensity: 59 },
  { id: 'g10', districtId: 'vellore', district: 'Vellore', name: 'PHC staffing escalation corridor', category: 'Grievance Heatmap', riskLevel: 'ELEVATED', status: 'Escalated', lat: 12.943, lng: 79.118, pending: 36, closureDays: 22, reopenedRate: 14, intensity: 55 },
];

const schemes: SchemeEntity[] = [
  { id: 's1', districtId: 'chennai', district: 'Chennai', name: 'Kalaignar Urban Livability Mission', category: 'Scheme Delivery', riskLevel: 'ELEVATED', status: 'Under Review', lat: 13.067, lng: 80.259, beneficiaries: 182400, targetAchievement: 81, fundsReleasedCrore: 355, fundsUtilizedCrore: 286, department: 'Municipal Administration' },
  { id: 's2', districtId: 'coimbatore', district: 'Coimbatore', name: 'Namma Kovai Water Security Package', category: 'Scheme Delivery', riskLevel: 'LOW', status: 'On Track', lat: 11.009, lng: 76.962, beneficiaries: 96200, targetAchievement: 91, fundsReleasedCrore: 148, fundsUtilizedCrore: 134, department: 'TWAD Board' },
  { id: 's3', districtId: 'madurai', district: 'Madurai', name: 'Temple City Health Access Mission', category: 'Scheme Delivery', riskLevel: 'ELEVATED', status: 'Monitoring', lat: 9.93, lng: 78.138, beneficiaries: 88400, targetAchievement: 78, fundsReleasedCrore: 133, fundsUtilizedCrore: 101, department: 'Health Department' },
  { id: 's4', districtId: 'thanjavur', district: 'Thanjavur', name: 'Delta Farmer Irrigation Support', category: 'Scheme Delivery', riskLevel: 'LOW', status: 'On Track', lat: 10.781, lng: 79.111, beneficiaries: 121300, targetAchievement: 93, fundsReleasedCrore: 172, fundsUtilizedCrore: 154, department: 'Agriculture & Water Resources' },
  { id: 's5', districtId: 'cuddalore', district: 'Cuddalore', name: 'Coastal Resilience Livelihood Scheme', category: 'Scheme Delivery', riskLevel: 'HIGH', status: 'Delayed', lat: 11.705, lng: 79.77, beneficiaries: 64300, targetAchievement: 68, fundsReleasedCrore: 119, fundsUtilizedCrore: 81, department: 'Rural Development & Fisheries' },
  { id: 's6', districtId: 'thoothukudi', district: 'Thoothukudi', name: 'South Coast Drinking Water Security', category: 'Scheme Delivery', riskLevel: 'ELEVATED', status: 'Under Review', lat: 8.781, lng: 78.129, beneficiaries: 51200, targetAchievement: 76, fundsReleasedCrore: 96, fundsUtilizedCrore: 73, department: 'TWAD Board' },
];

const tenders: TenderEntity[] = [
  { id: 't1', districtId: 'chennai', district: 'Chennai', name: 'Macro Drain Segment 4 Works', category: 'Tender Risk', riskLevel: 'HIGH', status: 'Flagged', lat: 13.098, lng: 80.245, tenderValueCrore: 92, bidSpreadPct: 1.9, flags: ['Low bid spread', 'Repeated consortium'] },
  { id: 't2', districtId: 'madurai', district: 'Madurai', name: 'Hospital equipment annual bundle', category: 'Tender Risk', riskLevel: 'ELEVATED', status: 'Review', lat: 9.947, lng: 78.129, tenderValueCrore: 41, bidSpreadPct: 3.8, flags: ['Single qualified bidder'] },
  { id: 't3', districtId: 'salem', district: 'Salem', name: 'School seismic retrofit materials', category: 'Tender Risk', riskLevel: 'HIGH', status: 'Flagged', lat: 11.658, lng: 78.152, tenderValueCrore: 27, bidSpreadPct: 1.2, flags: ['Bid clustering', 'Schedule compression'] },
  { id: 't4', districtId: 'cuddalore', district: 'Cuddalore', name: 'Cyclone shelter prefab package', category: 'Tender Risk', riskLevel: 'CRITICAL', status: 'Escalated', lat: 11.732, lng: 79.776, tenderValueCrore: 74, bidSpreadPct: 0.7, flags: ['Bid clustering', 'Prior vendor delay history'] },
  { id: 't5', districtId: 'kancheepuram', district: 'Kancheepuram', name: 'Peripheral sewer pumping stations', category: 'Tender Risk', riskLevel: 'ELEVATED', status: 'Review', lat: 12.886, lng: 79.741, tenderValueCrore: 38, bidSpreadPct: 2.4, flags: ['Revised BoQ spike'] },
];

const assets: AssetEntity[] = [
  { id: 'a1', districtId: 'chennai', district: 'Chennai', name: 'Otteri Stormwater Pumping Station', category: 'Public Asset', riskLevel: 'ELEVATED', status: 'Under Capacity', lat: 13.105, lng: 80.233, serviceScore: 69, ownerDepartment: 'Greater Chennai Corporation' },
  { id: 'a2', districtId: 'coimbatore', district: 'Coimbatore', name: 'Vadavalli Water Reservoir', category: 'Public Asset', riskLevel: 'LOW', status: 'Stable', lat: 11.03, lng: 76.907, serviceScore: 88, ownerDepartment: 'TWAD Board' },
  { id: 'a3', districtId: 'madurai', district: 'Madurai', name: 'Anna Bus Stand Sanitation Block', category: 'Public Asset', riskLevel: 'HIGH', status: 'Service Gap', lat: 9.919, lng: 78.128, serviceScore: 58, ownerDepartment: 'Municipal Administration' },
  { id: 'a4', districtId: 'tiruchirappalli', district: 'Tiruchirappalli', name: 'Thuvakudi PHC', category: 'Public Asset', riskLevel: 'ELEVATED', status: 'Staffing Gap', lat: 10.756, lng: 78.813, serviceScore: 64, ownerDepartment: 'Health Department' },
  { id: 'a5', districtId: 'salem', district: 'Salem', name: 'Kannankurichi Government School', category: 'Public Asset', riskLevel: 'ELEVATED', status: 'Repair Pending', lat: 11.695, lng: 78.177, serviceScore: 67, ownerDepartment: 'School Education' },
  { id: 'a6', districtId: 'cuddalore', district: 'Cuddalore', name: 'Devanampattinam Cyclone Shelter', category: 'Public Asset', riskLevel: 'CRITICAL', status: 'Preparedness Gap', lat: 11.739, lng: 79.786, serviceScore: 46, ownerDepartment: 'Disaster Management' },
  { id: 'a7', districtId: 'thoothukudi', district: 'Thoothukudi', name: 'Harbour Desalination Node', category: 'Public Asset', riskLevel: 'HIGH', status: 'Throughput Gap', lat: 8.79, lng: 78.153, serviceScore: 59, ownerDepartment: 'Municipal Administration' },
  { id: 'a8', districtId: 'vellore', district: 'Vellore', name: 'Katpadi Urban PHC', category: 'Public Asset', riskLevel: 'ELEVATED', status: 'Staffing Gap', lat: 12.971, lng: 79.141, serviceScore: 62, ownerDepartment: 'Health Department' },
];

const alerts: AlertEntity[] = [
  { id: 'al1', title: 'Cuddalore coastal housing milestone slipped by 4 months', districtId: 'cuddalore', district: 'Cuddalore', severity: 'CRITICAL', type: 'project', timestamp: '2026-05-24T07:20:00.000Z', summary: 'Phase 3 housing completion is at 39% against a planned 58%, increasing monsoon exposure for 2,800 households.', lat: 11.719, lng: 79.764 },
  { id: 'al2', title: 'North Chennai grievance cluster exceeds closure threshold', districtId: 'chennai', district: 'Chennai', severity: 'HIGH', type: 'grievance', timestamp: '2026-05-24T06:35:00.000Z', summary: 'Two adjacent wards crossed 30-day average closure time with repeated waterlogging complaints after closure.', lat: 13.1155, lng: 80.236 },
  { id: 'al3', title: 'Madurai hospital upgrade workfront under manpower stress', districtId: 'madurai', district: 'Madurai', severity: 'HIGH', type: 'project', timestamp: '2026-05-24T05:50:00.000Z', summary: 'Contractor progress fell below weekly plan for the third straight review, affecting surgical block delivery.', lat: 9.939, lng: 78.1242 },
  { id: 'al4', title: 'Cyclone shelter tender in Cuddalore flagged for bid clustering', districtId: 'cuddalore', district: 'Cuddalore', severity: 'CRITICAL', type: 'tender', timestamp: '2026-05-24T04:40:00.000Z', summary: 'Four bids landed within 0.7% of the estimate and the lead vendor has prior delay history in coastal packages.', lat: 11.732, lng: 79.776 },
  { id: 'al5', title: 'Thoothukudi desalination complaints are rising faster than tanker supply', districtId: 'thoothukudi', district: 'Thoothukudi', severity: 'HIGH', type: 'scheme', timestamp: '2026-05-24T03:30:00.000Z', summary: 'Complaint density grew 18% week over week in two coastal wards despite emergency tanker routing.', lat: 8.806, lng: 78.146 },
  { id: 'al6', title: 'Thanjavur delta canals show favorable delivery recovery', districtId: 'thanjavur', district: 'Thanjavur', severity: 'LOW', type: 'project', timestamp: '2026-05-24T02:15:00.000Z', summary: 'Desilting package closed most of its schedule gap and irrigation readiness improved before release.', lat: 10.802, lng: 79.121 },
];

const feed: FeedItem[] = [
  { id: 'f1', title: 'Collector review orders ward-wise closure sprint in North Chennai', districtId: 'chennai', district: 'Chennai', department: 'Municipal Administration', severity: 'HIGH', timestamp: '2026-05-24T07:25:00.000Z', summary: 'Backlog wards were instructed to publish closure-by-closure evidence for road and drain repairs.', lat: 13.09, lng: 80.27 },
  { id: 'f2', title: 'Coimbatore water security scheme crossed 90% target achievement', districtId: 'coimbatore', district: 'Coimbatore', department: 'TWAD Board', severity: 'LOW', timestamp: '2026-05-24T06:05:00.000Z', summary: 'Distribution balancing and reservoir telemetry reduced repeat supply complaints in western zones.', lat: 11.009, lng: 76.962 },
  { id: 'f3', title: 'Madurai hospital package moved to daily executive review', districtId: 'madurai', district: 'Madurai', department: 'Health Department', severity: 'HIGH', timestamp: '2026-05-24T05:45:00.000Z', summary: 'The dashboard elevated contractor slippage after manpower utilization fell below threshold.', lat: 9.939, lng: 78.1242 },
  { id: 'f4', title: 'Cuddalore resilience package combines grievance, project, and weather watchlists', districtId: 'cuddalore', district: 'Cuddalore', department: 'Disaster Management', severity: 'CRITICAL', timestamp: '2026-05-24T04:20:00.000Z', summary: 'Preparedness cells now track shelter readiness, housing delays, and local complaint spikes from one view.', lat: 11.719, lng: 79.764 },
  { id: 'f5', title: 'Thoothukudi tanker dispatches triggered a service verification audit', districtId: 'thoothukudi', district: 'Thoothukudi', department: 'Municipal Administration', severity: 'ELEVATED', timestamp: '2026-05-24T03:40:00.000Z', summary: 'Verification teams are comparing tanker trips, sensor uptime, and complaint closures in harbor wards.', lat: 8.79, lng: 78.153 },
  { id: 'f6', title: 'Vellore PHC staffing dashboard identified high absenteeism corridor', districtId: 'vellore', district: 'Vellore', department: 'Health Department', severity: 'ELEVATED', timestamp: '2026-05-24T02:50:00.000Z', summary: 'Three facilities were flagged for repeated staffing gaps and long outpatient wait times.', lat: 12.971, lng: 79.141 },
];

const directionalZones = ['North', 'South', 'East', 'West'] as const;

function directionalZoneForPoint(districtId: string, lat: number, lng: number) {
  const district = districtCatalog.find((item) => item.id === districtId);
  if (!district) return 'South';
  const latDiff = lat - district.lat;
  const lngDiff = lng - district.lng;
  if (Math.abs(latDiff) >= Math.abs(lngDiff)) {
    return latDiff >= 0 ? 'North' : 'South';
  }
  return lngDiff >= 0 ? 'East' : 'West';
}

function zoneFallbackPoint(district: DistrictSnapshot, zone: (typeof directionalZones)[number]) {
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

function assignDirectionalZone<T extends { districtId: string; lat: number; lng: number }>(items: T[]) {
  return items.map((item) => ({
    ...item,
    zone: directionalZoneForPoint(item.districtId, item.lat, item.lng),
  }));
}

const zonedProjects = assignDirectionalZone(projects);
const zonedGrievances = assignDirectionalZone(grievances);
const zonedSchemes = assignDirectionalZone(schemes);
const zonedTenders = assignDirectionalZone(tenders);
const zonedAssets = assignDirectionalZone(assets);
const zonedAlerts = assignDirectionalZone(alerts);
const zonedFeed = assignDirectionalZone(feed);

const districtZones: DistrictZoneSnapshot[] = districtCatalog.flatMap((district) => {
  return directionalZones.map((zoneName) => {
    const zoneProjects = zonedProjects.filter((item) => item.districtId === district.id && item.zone === zoneName);
    const zoneGrievances = zonedGrievances.filter((item) => item.districtId === district.id && item.zone === zoneName);
    const zoneSchemes = zonedSchemes.filter((item) => item.districtId === district.id && item.zone === zoneName);
    const zoneAssets = zonedAssets.filter((item) => item.districtId === district.id && item.zone === zoneName);
    const zoneAlerts = zonedAlerts.filter((item) => item.districtId === district.id && item.zone === zoneName);
    const zoneEntities = [...zoneProjects, ...zoneGrievances, ...zoneSchemes, ...zoneAssets];
    const weight = Math.max(zoneEntities.length + zoneAlerts.length, 1);
    const districtWeight = Math.max(
      zonedProjects.filter((item) => item.districtId === district.id).length +
        zonedGrievances.filter((item) => item.districtId === district.id).length +
        zonedSchemes.filter((item) => item.districtId === district.id).length +
        zonedAssets.filter((item) => item.districtId === district.id).length +
        zonedAlerts.filter((item) => item.districtId === district.id).length,
      1,
    );
    const fallback = zoneFallbackPoint(district, zoneName);
    const lat = zoneEntities.length > 0 ? zoneEntities.reduce((sum, item) => sum + item.lat, 0) / zoneEntities.length : fallback.lat;
    const lng = zoneEntities.length > 0 ? zoneEntities.reduce((sum, item) => sum + item.lng, 0) / zoneEntities.length : fallback.lng;

    return {
      id: `${district.id}-${zoneName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      districtId: district.id,
      district: district.name,
      zone: zoneName,
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4)),
      riskLevel:
        zoneAlerts.some((item) => item.severity === 'CRITICAL') || zoneEntities.some((item) => item.riskLevel === 'CRITICAL')
          ? 'CRITICAL'
          : zoneAlerts.some((item) => item.severity === 'HIGH') || zoneEntities.some((item) => item.riskLevel === 'HIGH')
            ? 'HIGH'
            : zoneEntities.some((item) => item.riskLevel === 'ELEVATED')
              ? 'ELEVATED'
              : 'LOW',
      pendingGrievances: zoneGrievances.reduce((sum, item) => sum + item.pending, 0),
      delayedProjects: zoneProjects.filter((item) => item.delayDays > 0).length,
      activeSchemes: zoneSchemes.length,
      trackedAssets: zoneAssets.length,
      liveAlerts: zoneAlerts.length,
      budgetAllocatedCrore: Math.round((district.budgetAllocatedCrore * weight) / districtWeight),
      budgetUtilizedCrore: Math.round((district.budgetUtilizedCrore * weight) / districtWeight),
      governanceScore: district.governanceScore,
      topIssue: zoneAlerts[0]?.title ?? zoneProjects[0]?.name ?? zoneGrievances[0]?.name ?? zoneSchemes[0]?.name ?? district.topIssue,
    };
  });
});

export const governanceDashboardData: GovernanceDashboardData = {
  generatedAt: '2026-05-24T07:30:00.000Z',
  statewideSummary: {
    monitoredDistricts: 38,
    highRiskDistricts: 4,
    activeAlerts: alerts.length,
    delayedProjects: 21,
    pendingGrievances: 2558,
    tenderValueAtRiskCrore: 272,
    schemeDeliveryRate: 83,
    budgetUtilization: 78,
    publicAssetsTracked: 1246,
  },
  districts: districtCatalog,
  zones: districtZones,
  projects: zonedProjects,
  grievances: zonedGrievances,
  schemes: zonedSchemes,
  tenders: zonedTenders,
  assets: zonedAssets,
  alerts: zonedAlerts,
  feed: zonedFeed,
};

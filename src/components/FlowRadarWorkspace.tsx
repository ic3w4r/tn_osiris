'use client';

import { useMemo, useState } from 'react';
import { Activity, ArrowRightLeft, CircleDot, Landmark, MapPinned, RadioTower, ShieldAlert } from 'lucide-react';

import FlowRadarMap from '@/components/FlowRadarMap';
import { DepartmentChannelHeat, FlowModule, FlowPassport, FlowRadarDataset, flowModuleLabels } from '@/lib/tn-flowradar-data';

interface FlowRadarWorkspaceProps {
  data: FlowRadarDataset;
  externalFlyToLocation?: { lat: number; lng: number; zoom?: number; ts: number } | null;
}

type DistrictFlowTab = 'grievance' | 'project' | 'scheme' | 'fund';

const moduleOrder: FlowModule[] = [
  'fund_flow',
  'file_flow',
  'grievance_flow',
  'tender_flow',
  'project_flow',
  'scheme_benefit_flow',
  'certificate_service_flow',
  'vehicle_field_team_flow',
  'material_supply_flow',
  'disaster_response_flow',
  'inspection_flow',
  'citizen_impact_flow',
];

function riskTone(level: string) {
  if (level === 'CRITICAL') return 'text-rose-300';
  if (level === 'HIGH') return 'text-orange-300';
  if (level === 'ELEVATED') return 'text-amber-300';
  return 'text-emerald-300';
}

function moduleMatchesTab(flow: FlowPassport, tab: DistrictFlowTab) {
  if (tab === 'grievance') {
    return ['grievance_flow', 'file_flow', 'certificate_service_flow'].includes(flow.flowType);
  }
  if (tab === 'project') {
    return ['project_flow', 'tender_flow', 'inspection_flow'].includes(flow.flowType);
  }
  if (tab === 'scheme') {
    return ['scheme_benefit_flow', 'material_supply_flow', 'citizen_impact_flow'].includes(flow.flowType);
  }
  return ['fund_flow', 'vehicle_field_team_flow', 'disaster_response_flow'].includes(flow.flowType);
}

function formatMetricValue(value: string | number | undefined) {
  if (value === undefined) return 'Not available';
  return typeof value === 'number' ? value.toLocaleString() : value;
}

export default function FlowRadarWorkspace({ data, externalFlyToLocation }: FlowRadarWorkspaceProps) {
  const [activeModule, setActiveModule] = useState<FlowModule | 'all'>('all');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | 'all'>('all');
  const [districtTab, setDistrictTab] = useState<DistrictFlowTab>('grievance');
  const [internalFlyToLocation, setInternalFlyToLocation] = useState<{ lat: number; lng: number; zoom?: number; ts: number } | null>(null);
  const effectiveFlyToLocation = externalFlyToLocation ?? internalFlyToLocation;

  const visibleFlows = useMemo(() => {
    return data.flows.filter((flow) => {
      if (activeModule !== 'all' && flow.flowType !== activeModule) return false;
      if ((selectedDistrictId ?? data.districtSummaries[0]?.districtId) && flow.districtId !== (selectedDistrictId ?? data.districtSummaries[0]?.districtId)) return false;
      if (selectedDepartment !== 'all' && flow.currentOwner !== selectedDepartment) return false;
      return true;
    });
  }, [activeModule, data.districtSummaries, data.flows, selectedDepartment, selectedDistrictId]);

  const selectedFlow = useMemo(
    () => visibleFlows.find((flow) => flow.flowId === selectedFlowId) ?? visibleFlows[0] ?? data.flows[0],
    [data.flows, selectedFlowId, visibleFlows],
  );

  const selectedDistrict = useMemo(
    () => data.districtSummaries.find((district) => district.districtId === (selectedDistrictId ?? data.districtSummaries[0]?.districtId)) ?? data.districtSummaries[0],
    [data.districtSummaries, selectedDistrictId],
  );

  const districtFlows = useMemo(() => {
    const districtId = selectedDistrictId ?? data.districtSummaries[0]?.districtId;
    if (!districtId) return [];
    return data.flows.filter((flow) => flow.districtId === districtId);
  }, [data.districtSummaries, data.flows, selectedDistrictId]);

  const districtTabFlows = useMemo(() => districtFlows.filter((flow) => moduleMatchesTab(flow, districtTab)), [districtFlows, districtTab]);

  const departmentChannels = useMemo(() => {
    return data.departmentChannels.filter((channel) => {
      if ((selectedDistrictId ?? data.districtSummaries[0]?.districtId) && !channel.districts.includes(selectedDistrict?.district ?? '')) return false;
      if (activeModule !== 'all' && !channel.modules.includes(activeModule)) return false;
      return true;
    });
  }, [activeModule, data.departmentChannels, data.districtSummaries, selectedDistrict?.district, selectedDistrictId]);
  const districtDepartmentChannels = useMemo(
    () => data.departmentChannels.filter((channel) => selectedDistrict?.district && channel.districts.includes(selectedDistrict.district)),
    [data.departmentChannels, selectedDistrict],
  );
  const selectedDistrictZones = useMemo(
    () => data.zoneSummaries.filter((zone) => zone.districtId === selectedDistrict?.districtId),
    [data.zoneSummaries, selectedDistrict],
  );

  const districtTabSummary = useMemo(() => {
    const delayed = districtTabFlows.filter((flow) => ['delayed', 'blocked', 'escalated', 'disputed'].includes(flow.status)).length;
    const critical = districtTabFlows.filter((flow) => flow.riskLevel === 'CRITICAL').length;
    const avgRisk = districtTabFlows.length ? Math.round(districtTabFlows.reduce((sum, flow) => sum + flow.riskScore, 0) / districtTabFlows.length) : 0;
    return { delayed, critical, avgRisk };
  }, [districtTabFlows]);

  const selectDistrict = (districtId: string) => {
    setSelectedDistrictId(districtId);
    const district = data.districtSummaries.find((item) => item.districtId === districtId);
    if (district) {
      setInternalFlyToLocation({ lat: district.lat, lng: district.lng, zoom: 8.5, ts: Date.now() });
    }
  };

  const selectFlow = (flow: FlowPassport) => {
    setSelectedFlowId(flow.flowId);
    setInternalFlyToLocation({ lat: flow.lat, lng: flow.lng, zoom: 9.2, ts: Date.now() });
  };

  const districtTabs: Array<{ key: DistrictFlowTab; label: string }> = [
    { key: 'grievance', label: 'Grievance' },
    { key: 'project', label: 'Project' },
    { key: 'scheme', label: 'Scheme' },
    { key: 'fund', label: 'Budget / Fund' },
  ];

  const districtSections = useMemo(() => {
    if (!selectedDistrict) return [];

    if (districtTab === 'grievance') {
      return [
        {
          title: 'Complaint Lifecycle Stages',
          items: districtFlows
            .filter((flow) => ['grievance_flow', 'file_flow'].includes(flow.flowType))
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `${flow.currentStage} · ${flow.currentOwner}`,
              detail: `Age ${formatMetricValue(flow.metrics.complaintAge ?? flow.metrics.totalFileAge)} · Delay ${flow.delayDays}d`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Escalated Items',
          items: districtFlows
            .filter((flow) => ['escalated', 'blocked', 'disputed'].includes(flow.status))
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `${flow.status.replaceAll('_', ' ')} · ${flow.currentOwner}`,
              detail: `Bottleneck ${flow.currentStage} · Risk ${flow.riskScore}/100`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Reopened / Repeat Signals',
          items: districtFlows
            .filter((flow) => flow.metrics.reopenRate || flow.metrics.repeatDensity)
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `Reopen ${formatMetricValue(flow.metrics.reopenRate)} · Repeat density ${formatMetricValue(flow.metrics.repeatDensity)}`,
              detail: `Citizen confirmation ${formatMetricValue(flow.metrics.citizenConfirmationRate)}`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Citizen Verification Status',
          items: districtFlows
            .filter((flow) => ['citizen_impact_flow', 'certificate_service_flow'].includes(flow.flowType))
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `${flow.currentStage} · ${flow.currentOwner}`,
              detail: `Outcome ${flow.outcome}`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Department-Source Governance Channels',
          channels: districtDepartmentChannels.slice(0, 4),
        },
      ];
    }

    if (districtTab === 'project') {
      return [
        {
          title: 'Sanction / File Stages',
          items: districtFlows
            .filter((flow) => ['project_flow', 'file_flow'].includes(flow.flowType))
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `${flow.originStage} -> ${flow.currentStage}`,
              detail: `Owner ${flow.currentOwner} · Delay ${flow.delayDays}d`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Tender Stages',
          items: districtFlows
            .filter((flow) => flow.flowType === 'tender_flow')
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `${flow.currentStage} · ${flow.currentOwner}`,
              detail: `Linked objects ${flow.linkedFlowIds.length} · Risk ${flow.riskScore}/100`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Work Order / Execution Stages',
          items: districtFlows
            .filter((flow) => ['project_flow', 'vehicle_field_team_flow', 'material_supply_flow'].includes(flow.flowType))
            .slice(0, 5)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `${flow.currentStage} · Progress ${flow.progressPct}%`,
              detail: `Outcome ${flow.outcome}`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Inspection / Completion / Verification',
          items: districtFlows
            .filter((flow) => ['inspection_flow', 'citizen_impact_flow'].includes(flow.flowType))
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `${flow.currentStage} · ${flow.status.replaceAll('_', ' ')}`,
              detail: `Verification path to ${flow.destination}`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Linked Tender Risk Items',
          items: districtFlows
            .filter((flow) => flow.flowType === 'tender_flow' || flow.linkedFlowIds.some((id) => id.includes('TEN')))
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `${flow.currentOwner} · ${flow.currentStage}`,
              detail: `Linked flow IDs ${flow.linkedFlowIds.join(', ') || 'None'}`,
              risk: flow.riskLevel,
              flow,
            })),
        },
      ];
    }

    if (districtTab === 'scheme') {
      return [
        {
          title: 'Eligible Population / Applications',
          items: districtFlows
            .filter((flow) => ['scheme_benefit_flow', 'certificate_service_flow'].includes(flow.flowType))
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `Eligible ${formatMetricValue(flow.metrics.eligiblePopulation ?? flow.metrics.applications)}`,
              detail: `Applications ${formatMetricValue(flow.metrics.applications ?? flow.metrics.requestVolume)}`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Approvals / Deliveries',
          items: districtFlows
            .filter((flow) => ['scheme_benefit_flow', 'material_supply_flow'].includes(flow.flowType))
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `Approvals ${formatMetricValue(flow.metrics.approvals ?? flow.metrics.dispatchCount)}`,
              detail: `Deliveries ${formatMetricValue(flow.metrics.deliveries ?? flow.metrics.receiptCount)}`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Beneficiary Gap / Citizen Impact',
          items: districtFlows
            .filter((flow) => ['scheme_benefit_flow', 'citizen_impact_flow'].includes(flow.flowType))
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `Gap ${formatMetricValue(flow.metrics.beneficiaryGap ?? flow.metrics.verifiedImprovementPct)}`,
              detail: `Outcome ${flow.outcome}`,
              risk: flow.riskLevel,
              flow,
            })),
        },
        {
          title: 'Linked Asset / Service Readiness',
          items: districtFlows
            .filter((flow) => ['certificate_service_flow', 'material_supply_flow', 'citizen_impact_flow'].includes(flow.flowType))
            .slice(0, 4)
            .map((flow) => ({
              id: flow.flowId,
              title: flow.title,
              eyebrow: `${flow.currentStage} · ${flow.currentOwner}`,
              detail: `Service readiness ${formatMetricValue(flow.metrics.serviceReadiness ?? flow.metrics.stockoutRisk ?? flow.metrics.serviceLevel)}`,
              risk: flow.riskLevel,
              flow,
            })),
        },
      ];
    }

    return [
      {
        title: 'Announced / Allocated / Released / Utilized',
        items: districtFlows
          .filter((flow) => flow.flowType === 'fund_flow')
          .slice(0, 4)
          .map((flow) => ({
            id: flow.flowId,
            title: flow.title,
            eyebrow: `Announced ${formatMetricValue(flow.metrics.announcedCrore)} · Allocated ${formatMetricValue(flow.metrics.allocatedCrore)}`,
            detail: `Released ${formatMetricValue(flow.metrics.releasedCrore)} · Utilized ${formatMetricValue(flow.metrics.utilizedCrore)}`,
            risk: flow.riskLevel,
            flow,
          })),
      },
      {
        title: 'Physical-Financial Gap / Impact Linkage',
        items: districtFlows
          .filter((flow) => ['fund_flow', 'citizen_impact_flow'].includes(flow.flowType))
          .slice(0, 4)
          .map((flow) => ({
            id: flow.flowId,
            title: flow.title,
            eyebrow: `Gap ${formatMetricValue(flow.metrics.physicalFinancialGap ?? flow.metrics.verifiedImprovementPct)}`,
            detail: `Impact ${formatMetricValue(flow.metrics.impactEfficiency ?? flow.metrics.citizenSatisfaction)}`,
            risk: flow.riskLevel,
            flow,
          })),
      },
      {
        title: 'Field Vehicles / Route Completion',
        items: districtFlows
          .filter((flow) => flow.flowType === 'vehicle_field_team_flow')
          .slice(0, 4)
          .map((flow) => ({
            id: flow.flowId,
            title: flow.title,
            eyebrow: `Route completion ${formatMetricValue(flow.metrics.routeCompletionPct)}`,
            detail: `Availability ${formatMetricValue(flow.metrics.vehicleAvailability)} · Owner ${flow.currentOwner}`,
            risk: flow.riskLevel,
            flow,
          })),
      },
      {
        title: 'Material Supply / Dispatch / Receipt / Stockout',
        items: districtFlows
          .filter((flow) => flow.flowType === 'material_supply_flow')
          .slice(0, 4)
          .map((flow) => ({
            id: flow.flowId,
            title: flow.title,
            eyebrow: `Dispatch ${formatMetricValue(flow.metrics.dispatchCount)} · Receipt ${formatMetricValue(flow.metrics.receiptCount)}`,
            detail: `Stockout risk ${formatMetricValue(flow.metrics.stockoutRisk)}`,
            risk: flow.riskLevel,
            flow,
          })),
      },
      {
        title: 'Disaster Response / Alert to Response Stages',
        items: districtFlows
          .filter((flow) => flow.flowType === 'disaster_response_flow')
          .slice(0, 4)
          .map((flow) => ({
            id: flow.flowId,
            title: flow.title,
            eyebrow: `${flow.currentStage} · ${flow.currentOwner}`,
            detail: `Shelter readiness ${formatMetricValue(flow.metrics.shelterReadiness)} · Response lag ${formatMetricValue(flow.metrics.responseLag)}`,
            risk: flow.riskLevel,
            flow,
          })),
      },
      {
        title: 'Inspections / Open Rectification',
        items: districtFlows
          .filter((flow) => flow.flowType === 'inspection_flow')
          .slice(0, 4)
          .map((flow) => ({
            id: flow.flowId,
            title: flow.title,
            eyebrow: `Rectification ${formatMetricValue(flow.metrics.openRectification)}`,
            detail: `Inspection score ${formatMetricValue(flow.metrics.inspectionScore)}`,
            risk: flow.riskLevel,
            flow,
          })),
      },
    ];
  }, [districtDepartmentChannels, districtFlows, districtTab, selectedDistrict]);

  return (
    <section className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_380px]">
      <aside className="space-y-4">
        <div className="glass-panel p-3">
          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-[var(--accent-bright)]" />
            <div className="hud-text text-[11px] text-[var(--text-primary)]">FlowRadar Modules</div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setActiveModule('all')}
              className={`w-full rounded-xl border px-3 py-2 text-left text-[12px] transition ${activeModule === 'all' ? 'border-white/16 bg-white/10' : 'border-white/8 bg-black/10 hover:bg-white/6'}`}
            >
              All Modules
            </button>
            {moduleOrder.map((module) => (
              <button
                key={module}
                onClick={() => setActiveModule(module)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-[12px] transition ${activeModule === module ? 'border-white/16 bg-white/10' : 'border-white/8 bg-black/10 hover:bg-white/6'}`}
              >
                {flowModuleLabels[module]}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-3">
          <div className="mb-3 flex items-center gap-2">
            <RadioTower className="h-4 w-4 text-[var(--accent-warm)]" />
            <div className="hud-text text-[11px] text-[var(--text-primary)]">Department Heat</div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedDepartment('all')}
              className={`w-full rounded-xl border px-3 py-2 text-left text-[11px] transition ${selectedDepartment === 'all' ? 'border-white/16 bg-white/10' : 'border-white/8 bg-black/10 hover:bg-white/6'}`}
            >
              All Departments
            </button>
            {departmentChannels.slice(0, 8).map((channel: DepartmentChannelHeat) => (
              <button
                key={channel.department}
                onClick={() => setSelectedDepartment(channel.department)}
                className={`w-full rounded-xl border px-3 py-2 text-left transition ${selectedDepartment === channel.department ? 'border-white/16 bg-white/10' : 'border-white/8 bg-black/10 hover:bg-white/6'}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[12px] text-[var(--text-primary)]">{channel.department}</span>
                  <span className={`text-[10px] uppercase ${riskTone(channel.heatScore > 80 ? 'CRITICAL' : channel.heatScore > 60 ? 'HIGH' : channel.heatScore > 40 ? 'ELEVATED' : 'LOW')}`}>
                    {channel.heatScore}
                  </span>
                </div>
                <div className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  {channel.flowCount} flows · {channel.modules.length} modules
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="glass-panel p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[var(--accent-bright)]">
                <ArrowRightLeft className="h-4 w-4" />
                FlowRadar Workspace
              </div>
              <h2 className="text-2xl font-semibold text-[var(--text-heading)]">Government Flow Tracking Grid</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Track funds, files, tenders, projects, grievances, materials, inspections, and impact like a flight radar for government operations.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-right">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Active module</div>
              <div className="mt-1 text-lg text-[var(--text-heading)]">{activeModule === 'all' ? 'All Modules' : flowModuleLabels[activeModule]}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Total active flows</div>
              <div className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">{data.stateSummary.totalActiveFlows}</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Delayed flows</div>
              <div className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">{data.stateSummary.totalDelayedFlows}</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Critical risk flows</div>
              <div className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">{data.stateSummary.criticalRiskFlows}</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Districts visible</div>
              <div className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">{data.districtSummaries.length}</div>
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden p-3">
          <div className="mb-3 flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-[var(--accent-bright)]" />
            <div className="hud-text text-[11px] text-[var(--text-primary)]">Tamil Nadu Flow Map</div>
          </div>
          <div className="h-[620px] overflow-hidden rounded-[20px] border border-white/8 bg-black/20">
            <FlowRadarMap
              districts={data.districtSummaries}
              flows={data.flows}
              activeModule={activeModule}
              selectedDistrictId={selectedDistrictId}
              selectedFlowId={selectedFlow?.flowId ?? null}
              flyToLocation={effectiveFlyToLocation}
              onSelectDistrict={selectDistrict}
              onSelectFlow={(flowId) => {
                const flow = data.flows.find((item) => item.flowId === flowId);
                if (flow) selectFlow(flow);
              }}
            />
          </div>
        </div>

        <div className="glass-panel p-3">
          <div className="mb-3 flex items-center gap-2">
            <Landmark className="h-4 w-4 text-[var(--accent-bright)]" />
            <div className="hud-text text-[11px] text-[var(--text-primary)]">District Flow Command List</div>
          </div>
          <div className="max-h-[320px] space-y-2 overflow-y-auto styled-scrollbar">
            {data.districtSummaries.map((district) => (
              <button
                key={district.districtId}
                onClick={() => selectDistrict(district.districtId)}
                className={`grid w-full grid-cols-5 gap-2 rounded-2xl border px-3 py-3 text-left transition ${district.districtId === selectedDistrictId ? 'border-white/16 bg-white/10' : 'border-white/8 bg-black/10 hover:bg-white/6'}`}
              >
                <div>
                  <div className="text-[12px] text-[var(--text-primary)]">{district.district}</div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Flow score {district.flowScore}</div>
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-[var(--text-heading)]">{district.activeFlows}</div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Active</div>
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-[var(--text-heading)]">{district.delayedFlows}</div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Delayed</div>
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-[var(--text-heading)]">{district.criticalFlows}</div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Critical</div>
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-[var(--text-heading)]">{district.topBottleneck}</div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Bottleneck</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="glass-panel p-4">
          <div className="mb-3 flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-[var(--accent-warm)]" />
            <div className="hud-text text-[11px] text-[var(--text-primary)]">Flow Passport</div>
          </div>
          {selectedFlow ? (
            <>
              <div className="mb-3">
                <div className="text-sm uppercase tracking-[0.18em] text-[var(--text-muted)]">{flowModuleLabels[selectedFlow.flowType]}</div>
                <h3 className="mt-1 text-xl font-semibold text-[var(--text-heading)]">{selectedFlow.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{selectedFlow.summary}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Current stage', selectedFlow.currentStage],
                  ['Owner', selectedFlow.currentOwner],
                  ['Zone', selectedFlow.zone ?? 'District Core'],
                  ['Delay', `${selectedFlow.delayDays} days`],
                  ['Risk', `${selectedFlow.riskScore}/100`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</div>
                    <div className="mt-1 text-sm text-[var(--text-heading)]">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-white/8 bg-black/10 p-4">
                <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Route / Stages</div>
                <div className="space-y-2">
                  {selectedFlow.route.map((stage) => (
                    <div key={stage.id} className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[13px] text-[var(--text-primary)]">{stage.label}</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{stage.owner}</div>
                        </div>
                        <span className={`text-[10px] uppercase tracking-[0.16em] ${riskTone(stage.status === 'delayed' || stage.status === 'blocked' ? 'HIGH' : stage.status === 'current' ? selectedFlow.riskLevel : 'LOW')}`}>
                          {stage.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-10 text-center text-[var(--text-muted)]">No flow selected.</div>
          )}
        </div>

        <div className="glass-panel p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[var(--accent-bright)]" />
            <div className="hud-text text-[11px] text-[var(--text-primary)]">District Command View</div>
          </div>
          {selectedDistrict && (
            <>
              <div className="mb-3">
                <div className="text-xl font-semibold text-[var(--text-heading)]">{selectedDistrict.district}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Flow score {selectedDistrict.flowScore} · {selectedDistrict.topBottleneck}</div>
              </div>
              <div className="mb-4 rounded-2xl border border-white/8 bg-black/10 p-3">
                <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[var(--accent-bright)]">District Zones</div>
                <div className="grid gap-2">
                  {selectedDistrictZones.map((zone) => (
                    <div key={zone.id} className="rounded-xl border border-white/8 bg-white/4 p-3">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[13px] text-[var(--text-primary)]">{zone.zone}</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{zone.topBottleneck}</div>
                        </div>
                        <span className={`text-[10px] uppercase tracking-[0.16em] ${riskTone(zone.flowScore > 80 ? 'CRITICAL' : zone.flowScore > 60 ? 'HIGH' : zone.flowScore > 40 ? 'ELEVATED' : 'LOW')}`}>
                          {zone.flowScore}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-[var(--text-secondary)]">
                        <div>Active {zone.activeFlows}</div>
                        <div>Delayed {zone.delayedFlows}</div>
                        <div>Critical {zone.criticalFlows}</div>
                        <div>Fund {zone.moduleCounts.fund_flow}</div>
                        <div>Project {zone.moduleCounts.project_flow}</div>
                        <div>Grievance {zone.moduleCounts.grievance_flow}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {districtTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setDistrictTab(tab.key)}
                    className={`rounded-xl border px-3 py-3 text-left transition ${districtTab === tab.key ? 'border-white/16 bg-white/10' : 'border-white/8 bg-white/4 hover:bg-white/6'}`}
                  >
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{tab.label}</div>
                    <div className="mt-1 text-lg text-[var(--text-heading)]">
                      {tab.key === 'grievance' ? selectedDistrict.moduleCounts.grievance_flow : tab.key === 'project' ? selectedDistrict.moduleCounts.project_flow : tab.key === 'scheme' ? selectedDistrict.moduleCounts.scheme_benefit_flow : selectedDistrict.moduleCounts.fund_flow}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Flows</div>
                  <div className="mt-1 text-lg text-[var(--text-heading)]">{districtTabFlows.length}</div>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Delayed</div>
                  <div className="mt-1 text-lg text-[var(--text-heading)]">{districtTabSummary.delayed}</div>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Avg risk</div>
                  <div className="mt-1 text-lg text-[var(--text-heading)]">{districtTabSummary.avgRisk}</div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {districtSections.map((section) => (
                  <div key={section.title} className="rounded-2xl border border-white/8 bg-black/10 p-3">
                    <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[var(--accent-bright)]">{section.title}</div>
                    {'items' in section && (
                      <div className="space-y-2">
                        {section.items.length > 0 ? (
                          section.items.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => selectFlow(item.flow)}
                              className={`w-full rounded-xl border p-3 text-left transition ${selectedFlow?.flowId === item.flow.flowId ? 'border-white/16 bg-white/10' : 'border-white/8 bg-white/4 hover:bg-white/6'}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-[13px] text-[var(--text-primary)]">{item.title}</div>
                                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{item.flow.zone} · {item.eyebrow}</div>
                                  <div className="mt-1 text-[10px] text-[var(--text-secondary)]">{item.detail}</div>
                                </div>
                                <span className={`text-[10px] uppercase tracking-[0.16em] ${riskTone(item.risk)}`}>{item.risk}</span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="rounded-xl border border-dashed border-white/8 bg-white/4 px-3 py-3 text-[11px] text-[var(--text-muted)]">
                            No district records in this sub-layer yet.
                          </div>
                        )}
                      </div>
                    )}
                    {'channels' in section && (
                      <div className="space-y-2">
                        {section.channels.length > 0 ? (
                          section.channels.map((channel) => (
                            <div key={channel.department} className="rounded-xl border border-white/8 bg-white/4 p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-[13px] text-[var(--text-primary)]">{channel.department}</div>
                                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                                    {channel.modules.length} modules · {channel.flowCount} flows
                                  </div>
                                  <div className="mt-1 text-[10px] text-[var(--text-secondary)]">{channel.bottleneck}</div>
                                </div>
                                <span className={`text-[10px] uppercase tracking-[0.16em] ${riskTone(channel.heatScore > 80 ? 'CRITICAL' : channel.heatScore > 60 ? 'HIGH' : channel.heatScore > 40 ? 'ELEVATED' : 'LOW')}`}>
                                  {channel.heatScore}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-xl border border-dashed border-white/8 bg-white/4 px-3 py-3 text-[11px] text-[var(--text-muted)]">
                            No department channels active for this district slice.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="glass-panel p-4">
          <div className="mb-3 flex items-center gap-2">
            <RadioTower className="h-4 w-4 text-[var(--accent-bright)]" />
            <div className="hud-text text-[11px] text-[var(--text-primary)]">Department Channels</div>
          </div>
          <div className="space-y-2">
            {departmentChannels.slice(0, 5).map((channel) => (
              <div key={channel.department} className="rounded-xl border border-white/8 bg-white/4 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[13px] text-[var(--text-primary)]">{channel.department}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      {channel.modules.length} modules · {channel.flowCount} flows
                    </div>
                    <div className="mt-1 text-[10px] text-[var(--text-secondary)]">{channel.bottleneck}</div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.16em] ${riskTone(channel.heatScore > 80 ? 'CRITICAL' : channel.heatScore > 60 ? 'HIGH' : channel.heatScore > 40 ? 'ELEVATED' : 'LOW')}`}>
                    {channel.heatScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}

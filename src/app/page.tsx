'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { AlertTriangle, Building2, FolderKanban, Landmark, MapPinned, ShieldCheck } from 'lucide-react';

import GlobalStatusBar from '@/components/GlobalStatusBar';
import FlowRadarWorkspace from '@/components/FlowRadarWorkspace';
import IntelFeed from '@/components/IntelFeed';
import LayerPanel from '@/components/LayerPanel';
import LiveAlerts from '@/components/LiveAlerts';
import SearchBar from '@/components/SearchBar';
import ViewPresets from '@/components/ViewPresets';
import { GovernanceDashboardData } from '@/lib/tn-governance-data';
import { FlowRadarDataset } from '@/lib/tn-flowradar-data';

const OsirisMap = dynamic(() => import('@/components/OsirisMap'), { ssr: false });

const emptyData: GovernanceDashboardData = {
  generatedAt: '',
  statewideSummary: {
    monitoredDistricts: 0,
    highRiskDistricts: 0,
    activeAlerts: 0,
    delayedProjects: 0,
    pendingGrievances: 0,
    tenderValueAtRiskCrore: 0,
    schemeDeliveryRate: 0,
    budgetUtilization: 0,
    publicAssetsTracked: 0,
  },
  districts: [],
  zones: [],
  projects: [],
  grievances: [],
  schemes: [],
  tenders: [],
  assets: [],
  alerts: [],
  feed: [],
};

const emptyFlowRadarData: FlowRadarDataset = {
  generatedAt: '',
  stateSummary: {
    totalActiveFlows: 0,
    totalDelayedFlows: 0,
    criticalRiskFlows: 0,
    districtRiskRanking: [],
    departmentBottlenecks: [],
    moduleRiskSummary: [],
  },
  moduleSummaries: [],
  districtSummaries: [],
  zoneSummaries: [],
  departmentChannels: [],
  flows: [],
};

const defaultLayers = {
  districts: true,
  grievances: true,
  projects: true,
  schemes: true,
  tenders: true,
  assets: false,
  disasters: true,
};

type DistrictTab = 'grievances' | 'projects' | 'schemes' | 'budget';
type AppMode = 'governance' | 'flowradar';

function metricTone(value: string) {
  if (value === 'CRITICAL') return 'text-rose-300';
  if (value === 'HIGH') return 'text-orange-300';
  if (value === 'ELEVATED') return 'text-amber-300';
  return 'text-emerald-300';
}

function riskDot(level: string) {
  if (level === 'CRITICAL') return 'bg-rose-400';
  if (level === 'HIGH') return 'bg-orange-400';
  if (level === 'ELEVATED') return 'bg-amber-400';
  return 'bg-emerald-400';
}

export default function DashboardPage() {
  const [data, setData] = useState<GovernanceDashboardData>(emptyData);
  const [flowRadarData, setFlowRadarData] = useState<FlowRadarDataset>(emptyFlowRadarData);
  const [loading, setLoading] = useState(true);
  const [appMode, setAppMode] = useState<AppMode>('governance');
  const [activeLayers, setActiveLayers] = useState(defaultLayers);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('cuddalore');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [activeDistrictTab, setActiveDistrictTab] = useState<DistrictTab>('grievances');
  const [flyToLocation, setFlyToLocation] = useState<{ lat: number; lng: number; zoom?: number; ts: number } | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [governanceResponse, flowRadarResponse] = await Promise.all([fetch('/api/governance'), fetch('/api/flowradar')]);
      const [governanceJson, flowRadarJson] = await Promise.all([governanceResponse.json(), flowRadarResponse.json()]);
      if (!mounted) return;
      setData(governanceJson);
      setFlowRadarData(flowRadarJson);
      setLoading(false);
      const initialDistrictId = governanceJson.alerts[0]?.districtId ?? governanceJson.districts[0]?.id ?? '';
      setSelectedDistrictId(initialDistrictId);
      setSelectedZoneId(null);
      const initialDistrict = governanceJson.districts.find((district: { id: string }) => district.id === initialDistrictId);
      if (initialDistrict) {
        setFlyToLocation({ lat: initialDistrict.lat, lng: initialDistrict.lng, zoom: 8.8, ts: Date.now() });
      }
    };

    load();
    const timer = setInterval(load, 300000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const selectedDistrict = useMemo(
    () => data.districts.find((district) => district.id === selectedDistrictId) ?? data.districts[0],
    [data.districts, selectedDistrictId],
  );

  const districtProjects = useMemo(
    () => data.projects.filter((project) => project.districtId === selectedDistrict?.id),
    [data.projects, selectedDistrict],
  );
  const districtGrievances = useMemo(
    () => data.grievances.filter((item) => item.districtId === selectedDistrict?.id),
    [data.grievances, selectedDistrict],
  );
  const districtSchemes = useMemo(
    () => data.schemes.filter((item) => item.districtId === selectedDistrict?.id),
    [data.schemes, selectedDistrict],
  );
  const districtTenders = useMemo(
    () => data.tenders.filter((item) => item.districtId === selectedDistrict?.id),
    [data.tenders, selectedDistrict],
  );
  const districtAssets = useMemo(
    () => data.assets.filter((item) => item.districtId === selectedDistrict?.id),
    [data.assets, selectedDistrict],
  );
  const districtAlerts = useMemo(
    () => data.alerts.filter((item) => item.districtId === selectedDistrict?.id),
    [data.alerts, selectedDistrict],
  );
  const districtFeed = useMemo(
    () => data.feed.filter((item) => item.districtId === selectedDistrict?.id),
    [data.feed, selectedDistrict],
  );
  const selectedDistrictZones = useMemo(
    () => data.zones.filter((zone) => zone.districtId === selectedDistrict?.id),
    [data.zones, selectedDistrict],
  );
  const selectedZone = useMemo(
    () => selectedDistrictZones.find((zone) => zone.id === selectedZoneId) ?? null,
    [selectedDistrictZones, selectedZoneId],
  );
  const scopeByZone = <T extends { zone?: string }>(items: T[]) =>
    selectedZone ? items.filter((item) => item.zone === selectedZone.zone) : items;
  const departmentFeedSummary = useMemo(() => {
    const grouped = new Map<string, { department: string; count: number; latest: string; severity: string }>();
    for (const item of districtFeed) {
      const current = grouped.get(item.department);
      if (!current) {
        grouped.set(item.department, {
          department: item.department,
          count: 1,
          latest: item.title,
          severity: item.severity,
        });
      } else {
        grouped.set(item.department, {
          department: item.department,
          count: current.count + 1,
          latest: current.latest,
          severity: current.severity === 'CRITICAL' || item.severity === 'CRITICAL' ? 'CRITICAL' : item.severity,
        });
      }
    }
    return Array.from(grouped.values()).slice(0, 4);
  }, [districtFeed]);
  const schemeBudgetSummary = useMemo(() => {
    const released = districtSchemes.reduce((sum, item) => sum + item.fundsReleasedCrore, 0);
    const utilized = districtSchemes.reduce((sum, item) => sum + item.fundsUtilizedCrore, 0);
    return { released, utilized };
  }, [districtSchemes]);
  const grievanceSummary = useMemo(() => {
    const escalated = districtGrievances.filter((item) => item.status === 'Escalated').length;
    const averageClosure =
      districtGrievances.length > 0
        ? Math.round(districtGrievances.reduce((sum, item) => sum + item.closureDays, 0) / districtGrievances.length)
        : 0;
    const reopenedAverage =
      districtGrievances.length > 0
        ? Math.round(districtGrievances.reduce((sum, item) => sum + item.reopenedRate, 0) / districtGrievances.length)
        : 0;
    return { escalated, averageClosure, reopenedAverage };
  }, [districtGrievances]);
  const projectSummary = useMemo(() => {
    const averageDelay =
      districtProjects.length > 0
        ? Math.round(districtProjects.reduce((sum, item) => sum + item.delayDays, 0) / districtProjects.length)
        : 0;
    const atRiskBudget = districtProjects.reduce((sum, item) => sum + item.budgetCrore, 0);
    return { averageDelay, atRiskBudget, tenderFlags: districtTenders.length };
  }, [districtProjects, districtTenders]);
  const schemeSummary = useMemo(() => {
    const beneficiaries = districtSchemes.reduce((sum, item) => sum + item.beneficiaries, 0);
    const avgAchievement =
      districtSchemes.length > 0
        ? Math.round(districtSchemes.reduce((sum, item) => sum + item.targetAchievement, 0) / districtSchemes.length)
        : 0;
    const assetCount = districtAssets.length;
    return { beneficiaries, avgAchievement, assetCount };
  }, [districtSchemes, districtAssets]);

  const districtTabs: Array<{ key: DistrictTab; label: string; value: string }> = selectedDistrict
    ? [
        { key: 'grievances', label: 'Pending grievances', value: selectedDistrict.pendingGrievances.toLocaleString() },
        { key: 'projects', label: 'Delayed projects', value: String(selectedDistrict.delayedProjects) },
        { key: 'schemes', label: 'Scheme coverage', value: `${selectedDistrict.schemeCoverage}%` },
        { key: 'budget', label: 'Budget utilization', value: `${selectedDistrict.budgetUtilization}%` },
      ]
    : [];

  const counts = {
    districts: data.districts.length,
    grievances: data.grievances.length,
    projects: data.projects.length,
    schemes: data.schemes.length,
    tenders: data.tenders.length,
    assets: data.assets.length,
    alerts: data.alerts.length,
  };

  const searchItems = useMemo(
    () => [
      ...data.districts.map((district) => ({
        id: district.id,
        label: district.name,
        sublabel: `District · ${district.topIssue}`,
        lat: district.lat,
        lng: district.lng,
      })),
      ...data.projects.map((project) => ({
        id: project.id,
        label: project.name,
        sublabel: `${project.district} · Project`,
        lat: project.lat,
        lng: project.lng,
      })),
      ...data.assets.map((asset) => ({
        id: asset.id,
        label: asset.name,
        sublabel: `${asset.district} · Public Asset`,
        lat: asset.lat,
        lng: asset.lng,
      })),
    ],
    [data.assets, data.districts, data.projects],
  );
  const flowRadarSearchItems = useMemo(
    () => [
      ...flowRadarData.districtSummaries.map((district) => ({
        id: district.districtId,
        label: district.district,
        sublabel: `District Flow Command · ${district.topBottleneck}`,
        lat: district.lat,
        lng: district.lng,
      })),
      ...flowRadarData.flows.map((flow) => ({
        id: flow.flowId,
        label: flow.title,
        sublabel: `${flow.district} · ${flow.currentOwner}`,
        lat: flow.lat,
        lng: flow.lng,
      })),
    ],
    [flowRadarData.districtSummaries, flowRadarData.flows],
  );

  const focusDistrict = (districtId: string, lat: number, lng: number, zoom = 8.7) => {
    setSelectedDistrictId(districtId);
    setSelectedZoneId(null);
    setFlyToLocation({ lat, lng, zoom, ts: Date.now() });
  };

  const focusZone = (zoneId: string, lat: number, lng: number, zoom = 10.1) => {
    setSelectedZoneId(zoneId);
    setFlyToLocation({ lat, lng, zoom, ts: Date.now() });
  };

  return (
    <main className="min-h-screen bg-[var(--bg-void)] px-4 pb-20 pt-4 text-[var(--text-primary)] md:px-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="glass-panel mb-4 px-4 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[var(--accent-bright)]">
                <ShieldCheck className="h-4 w-4" />
                TN-OSIRIS
              </div>
              <div className="mb-3 flex w-fit rounded-full border border-white/10 bg-black/16 p-1">
                {[
                  ['governance', 'Governance Intelligence'],
                  ['flowradar', 'FlowRadar'],
                ].map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setAppMode(mode as AppMode)}
                    className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition ${
                      appMode === mode ? 'bg-white/12 text-[var(--text-heading)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-heading)] md:text-3xl">
                {appMode === 'governance' ? 'Tamil Nadu Governance Intelligence' : 'Tamil Nadu FlowRadar Command Grid'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
                {appMode === 'governance'
                  ? 'A map-first command view for district risk, grievance clusters, scheme delivery, public assets, projects, and tender anomalies.'
                  : 'A flow-tracking operating layer for funds, files, grievances, tenders, projects, schemes, services, materials, inspections, disaster response, and citizen impact across Tamil Nadu.'}
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-3 xl:items-end">
              <SearchBar
                items={appMode === 'governance' ? searchItems : flowRadarSearchItems}
                onLocate={(item) => {
                  if (appMode === 'governance') {
                    const district =
                      data.districts.find((entry) => entry.id === item.id) ??
                      data.districts.find((entry) => item.sublabel.startsWith(entry.name));
                    if (district) {
                      focusDistrict(district.id, item.lat, item.lng);
                    } else {
                      setFlyToLocation({ lat: item.lat, lng: item.lng, zoom: 9.2, ts: Date.now() });
                    }
                  } else {
                    setFlyToLocation({ lat: item.lat, lng: item.lng, zoom: 9.2, ts: Date.now() });
                  }
                }}
              />
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Generated {(appMode === 'governance' ? data.generatedAt : flowRadarData.generatedAt) ? new Date(appMode === 'governance' ? data.generatedAt : flowRadarData.generatedAt).toLocaleString() : 'Loading...'}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {(appMode === 'governance'
              ? [
                  { label: 'Districts monitored', value: data.statewideSummary.monitoredDistricts, icon: MapPinned, tone: 'var(--accent-bright)' },
                  { label: 'Pending grievances', value: data.statewideSummary.pendingGrievances.toLocaleString(), icon: AlertTriangle, tone: 'var(--accent-warm)' },
                  { label: 'Delayed projects', value: data.statewideSummary.delayedProjects, icon: FolderKanban, tone: 'var(--accent-danger)' },
                  { label: 'Assets tracked', value: data.statewideSummary.publicAssetsTracked.toLocaleString(), icon: Building2, tone: 'var(--accent-cool)' },
                ]
              : [
                  { label: 'Active flows', value: flowRadarData.stateSummary.totalActiveFlows, icon: MapPinned, tone: 'var(--accent-bright)' },
                  { label: 'Delayed flows', value: flowRadarData.stateSummary.totalDelayedFlows, icon: AlertTriangle, tone: 'var(--accent-warm)' },
                  { label: 'Critical risk flows', value: flowRadarData.stateSummary.criticalRiskFlows, icon: FolderKanban, tone: 'var(--accent-danger)' },
                  { label: 'Departments heated', value: flowRadarData.departmentChannels.length, icon: Building2, tone: 'var(--accent-cool)' },
                ]
            ).map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{metric.label}</span>
                    <Icon className="h-4 w-4" style={{ color: metric.tone }} />
                  </div>
                  <div className="text-2xl font-semibold text-[var(--text-heading)]">{metric.value}</div>
                </div>
              );
            })}
          </div>
        </header>

        {appMode === 'governance' ? (
        <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <aside className="space-y-4">
            <LayerPanel counts={counts} activeLayers={activeLayers} setActiveLayers={setActiveLayers} />
            <ViewPresets onNavigate={(lat, lng, zoom) => setFlyToLocation({ lat, lng, zoom, ts: Date.now() })} />
          </aside>

          <section className="space-y-4">
            <div className="glass-panel overflow-hidden p-3">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="hud-text text-[10px] text-[var(--text-muted)]">Geo Legend</span>
                {[
                  ['District risk zone', 'bg-[var(--accent-bright)]'],
                  ['Grievances', 'bg-orange-400'],
                  ['Projects', 'bg-rose-400'],
                  ['Schemes', 'bg-emerald-400'],
                  ['Tenders', 'bg-amber-400'],
                  ['Assets', 'bg-sky-400'],
                  ['Alerts', 'bg-violet-400'],
                ].map(([label, tone]) => (
                  <div key={label} className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[10px] text-[var(--text-secondary)]">
                    <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="h-[620px] overflow-hidden rounded-[20px] border border-white/8 bg-black/20">
                <OsirisMap
                  data={data}
                  activeLayers={activeLayers}
                  selectedDistrictId={selectedDistrictId}
                  selectedZoneId={selectedZoneId}
                  flyToLocation={flyToLocation}
                  onEntityClick={(entity) => {
                    if (entity.type === 'zone') {
                      const zone = data.zones.find((item) => item.id === entity.id);
                      if (zone) {
                        focusZone(zone.id, zone.lat, zone.lng);
                      }
                      return;
                    }
                    const district = data.districts.find((item) => item.id === entity.districtId);
                    if (district) {
                      focusDistrict(district.id, district.lat, district.lng);
                    }
                  }}
                />
              </div>
            </div>

            {selectedDistrict && (
              <div className="glass-panel p-3">
                <div className="mb-3 flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-[var(--accent-bright)]" />
                  <div className="hud-text text-[11px] text-[var(--text-primary)]">District Sub-Zones</div>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {selectedDistrictZones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => focusZone(zone.id, zone.lat, zone.lng)}
                      className={`rounded-xl border px-3 py-3 text-left transition ${
                        selectedZoneId === zone.id ? 'border-white/18 bg-white/10' : 'border-white/8 bg-black/10 hover:bg-white/6'
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-[12px] text-[var(--text-primary)]">{zone.zone}</span>
                        <span className={`h-2.5 w-2.5 rounded-full ${riskDot(zone.riskLevel)}`} />
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{zone.topIssue}</div>
                      <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-[var(--text-secondary)]">
                        <span>G {zone.pendingGrievances}</span>
                        <span>P {zone.delayedProjects}</span>
                        <span>S {zone.activeSchemes}</span>
                        <span>A {zone.trackedAssets}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-panel p-3">
              <div className="mb-3 flex items-center gap-2">
                <Landmark className="h-4 w-4 text-[var(--accent-bright)]" />
                <div className="hud-text text-[11px] text-[var(--text-primary)]">District Jump Map</div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {data.districts.slice(0, 12).map((district) => (
                  <button
                    key={district.id}
                    onClick={() => focusDistrict(district.id, district.lat, district.lng)}
                    className={`rounded-xl border px-3 py-2 text-left transition ${
                      district.id === selectedDistrictId ? 'border-white/18 bg-white/10' : 'border-white/8 bg-black/10 hover:bg-white/6'
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${riskDot(district.riskLevel)}`} />
                      <span className="text-[12px] text-[var(--text-primary)]">{district.name}</span>
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {district.lat.toFixed(2)} N · {district.lng.toFixed(2)} E
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-panel p-3">
              <div className="mb-3 flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-[var(--accent-bright)]" />
                <div className="hud-text text-[11px] text-[var(--text-primary)]">District Command List</div>
              </div>
              <div className="mb-3 grid grid-cols-5 gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                <span>District</span>
                <span>Grievances</span>
                <span>Projects</span>
                <span>Schemes</span>
                <span>Budget</span>
              </div>
              <div className="max-h-[320px] space-y-2 overflow-y-auto styled-scrollbar pr-1">
                {data.districts.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => focusDistrict(district.id, district.lat, district.lng)}
                    className={`grid w-full grid-cols-5 gap-2 rounded-2xl border px-3 py-3 text-left transition ${
                      district.id === selectedDistrictId ? 'border-white/16 bg-white/10' : 'border-white/8 bg-black/10 hover:bg-white/6'
                    }`}
                  >
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${riskDot(district.riskLevel)}`} />
                        <span className="text-[12px] text-[var(--text-primary)]">{district.name}</span>
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{district.riskLevel}</div>
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[var(--text-heading)]">{district.pendingGrievances}</div>
                      <div className="text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Pending</div>
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[var(--text-heading)]">{district.delayedProjects}</div>
                      <div className="text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Delayed</div>
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[var(--text-heading)]">{district.schemeCoverage}%</div>
                      <div className="text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Coverage</div>
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[var(--text-heading)]">{district.budgetUtilization}%</div>
                      <div className="text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Utilized</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="glass-panel p-4">
              {selectedDistrict ? (
                <>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[var(--accent-bright)]">
                        <Landmark className="h-4 w-4" />
                        District Command View
                      </div>
                      <h2 className="text-2xl font-semibold text-[var(--text-heading)]">{selectedDistrict.name}</h2>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{selectedDistrict.topIssue}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/12 px-4 py-3 text-right">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Risk posture</div>
                      <div className={`mt-1 text-xl font-semibold ${metricTone(selectedDistrict.riskLevel)}`}>{selectedDistrict.riskLevel}</div>
                      <div className="text-[12px] text-[var(--text-secondary)]">Governance score {selectedDistrict.governanceScore}/100</div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        {selectedDistrict.lat.toFixed(2)} N · {selectedDistrict.lng.toFixed(2)} E
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 rounded-2xl border border-white/8 bg-black/10 p-4">
                    <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-bright)]">
                      <MapPinned className="h-4 w-4" />
                      District Zones
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {selectedDistrictZones.map((zone) => (
                        <div key={zone.id} className="rounded-xl border border-white/8 bg-white/4 p-3">
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[13px] text-[var(--text-primary)]">{zone.zone}</div>
                              <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{zone.topIssue}</div>
                            </div>
                            <span className={`text-[10px] uppercase tracking-[0.16em] ${metricTone(zone.riskLevel)}`}>{zone.riskLevel}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px] text-[var(--text-secondary)]">
                            <div>Grievances {zone.pendingGrievances}</div>
                            <div>Projects {zone.delayedProjects}</div>
                            <div>Schemes {zone.activeSchemes}</div>
                            <div>Assets {zone.trackedAssets}</div>
                            <div>Alerts {zone.liveAlerts}</div>
                            <div>Budget ₹{zone.budgetUtilizedCrore} / ₹{zone.budgetAllocatedCrore} Cr</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {districtTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveDistrictTab(tab.key)}
                        className={`rounded-2xl border px-3 py-3 text-left transition ${
                          activeDistrictTab === tab.key ? 'border-white/16 bg-white/10' : 'border-white/8 bg-white/4 hover:bg-white/6'
                        }`}
                      >
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{tab.label}</div>
                        <div className="mt-1 text-xl font-semibold text-[var(--text-heading)]">{tab.value}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 space-y-3">
                    {activeDistrictTab === 'grievances' && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            ['Open clusters', String(districtGrievances.length)],
                            ['Escalated', String(grievanceSummary.escalated)],
                            ['Avg closure', `${grievanceSummary.averageClosure}d`],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</div>
                              <div className="mt-1 text-lg font-semibold text-[var(--text-heading)]">{value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                          <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-warm)]">
                            <AlertTriangle className="h-4 w-4" />
                            Grievance Layer
                          </div>
                          <div className="space-y-2">
                            {scopeByZone(districtGrievances).slice(0, 3).map((item) => (
                              <div key={item.id} className="rounded-xl border border-white/8 bg-white/4 p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-[13px] text-[var(--text-primary)]">{item.name}</div>
                                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                      {item.zone} · Pending {item.pending} · Closure {item.closureDays}d · Reopened {item.reopenedRate}%
                                    </div>
                                    <div className="mt-1 text-[10px] text-[var(--text-secondary)]">
                                      {item.lat.toFixed(3)}, {item.lng.toFixed(3)}
                                    </div>
                                  </div>
                                  <span className={`text-[10px] uppercase tracking-[0.18em] ${metricTone(item.riskLevel)}`}>{item.riskLevel}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                          <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-bright)]">
                            <ShieldCheck className="h-4 w-4" />
                            Department Governance Feed
                          </div>
                          <div className="mb-3 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                            Reopened average {grievanceSummary.reopenedAverage}% across department-sourced grievance channels
                          </div>
                          <div className="space-y-2">
                            {departmentFeedSummary.map((item) => (
                              <div key={item.department} className="rounded-xl border border-white/8 bg-white/4 p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-[13px] text-[var(--text-primary)]">{item.department}</div>
                                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                      {item.count} governance updates
                                    </div>
                                    <div className="mt-1 text-[10px] text-[var(--text-secondary)]">{item.latest}</div>
                                  </div>
                                  <span className={`text-[10px] uppercase tracking-[0.18em] ${metricTone(item.severity)}`}>{item.severity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 grid gap-2">
                            {selectedDistrictZones.map((zone) => (
                              <div key={zone.id} className="rounded-xl border border-dashed border-white/8 bg-white/3 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                                {zone.zone}: {zone.pendingGrievances} pending grievances · {zone.liveAlerts} live alerts
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {activeDistrictTab === 'projects' && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            ['Delayed workfronts', String(districtProjects.length)],
                            ['Avg delay', `${projectSummary.averageDelay}d`],
                            ['At-risk budget', `₹${projectSummary.atRiskBudget} Cr`],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</div>
                              <div className="mt-1 text-lg font-semibold text-[var(--text-heading)]">{value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                          <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-danger)]">
                            <FolderKanban className="h-4 w-4" />
                            Delayed Projects Layer
                          </div>
                          <div className="space-y-2">
                            {scopeByZone(districtProjects).slice(0, 3).map((item) => (
                              <div key={item.id} className="rounded-xl border border-white/8 bg-white/4 p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-[13px] text-[var(--text-primary)]">{item.name}</div>
                                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                      {item.zone} · {item.department} · Delay {item.delayDays}d · Completion {item.completion}%
                                    </div>
                                    <div className="mt-1 text-[10px] text-[var(--text-secondary)]">
                                      Budget ₹{item.budgetCrore} Cr · {item.lat.toFixed(3)}, {item.lng.toFixed(3)}
                                    </div>
                                  </div>
                                  <span className={`text-[10px] uppercase tracking-[0.18em] ${metricTone(item.riskLevel)}`}>{item.riskLevel}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                          <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-warm)]">
                            <MapPinned className="h-4 w-4" />
                            Tender Risk Layer
                          </div>
                          <div className="mb-3 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                            {projectSummary.tenderFlags} tender channels linked to delayed execution in this district
                          </div>
                          <div className="space-y-2">
                            {scopeByZone(districtTenders).slice(0, 3).map((item) => (
                              <div key={item.id} className="rounded-xl border border-white/8 bg-white/4 p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-[13px] text-[var(--text-primary)]">{item.name}</div>
                                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                      {item.zone} · Tender value ₹{item.tenderValueCrore} Cr · Spread {item.bidSpreadPct}%
                                    </div>
                                    <div className="mt-1 text-[10px] text-[var(--text-secondary)]">
                                      Flags: {item.flags.join(', ')}
                                    </div>
                                  </div>
                                  <span className={`text-[10px] uppercase tracking-[0.18em] ${metricTone(item.riskLevel)}`}>{item.riskLevel}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {activeDistrictTab === 'schemes' && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            ['Active schemes', String(districtSchemes.length)],
                            ['Avg achievement', `${schemeSummary.avgAchievement}%`],
                            ['Beneficiaries', schemeSummary.beneficiaries.toLocaleString()],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</div>
                              <div className="mt-1 text-lg font-semibold text-[var(--text-heading)]">{value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                          <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-bright)]">
                            <FolderKanban className="h-4 w-4" />
                            Scheme Delivery Layer
                          </div>
                          <div className="space-y-2">
                            {scopeByZone(districtSchemes).slice(0, 3).map((item) => (
                              <div key={item.id} className="rounded-xl border border-white/8 bg-white/4 p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-[13px] text-[var(--text-primary)]">{item.name}</div>
                                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                      {item.zone} · {item.department} · Achievement {item.targetAchievement}% · Beneficiaries {item.beneficiaries.toLocaleString()}
                                    </div>
                                    <div className="mt-1 text-[10px] text-[var(--text-secondary)]">
                                      Released ₹{item.fundsReleasedCrore} Cr · Utilized ₹{item.fundsUtilizedCrore} Cr
                                    </div>
                                  </div>
                                  <span className={`text-[10px] uppercase tracking-[0.18em] ${metricTone(item.riskLevel)}`}>{item.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                          <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-cool)]">
                            <Building2 className="h-4 w-4" />
                            Asset Track Layer
                          </div>
                          <div className="mb-3 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                            {schemeSummary.assetCount} tracked public assets connected to delivery readiness in this district
                          </div>
                          <div className="space-y-2">
                            {scopeByZone(districtAssets).slice(0, 3).map((item) => (
                              <div key={item.id} className="rounded-xl border border-white/8 bg-white/4 p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-[13px] text-[var(--text-primary)]">{item.name}</div>
                                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                      {item.zone} · {item.ownerDepartment} · Score {item.serviceScore}/100
                                    </div>
                                    <div className="mt-1 text-[10px] text-[var(--text-secondary)]">
                                      {item.lat.toFixed(3)}, {item.lng.toFixed(3)}
                                    </div>
                                  </div>
                                  <span className={`text-[10px] uppercase tracking-[0.18em] ${metricTone(item.riskLevel)}`}>{item.riskLevel}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {activeDistrictTab === 'budget' && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            ['District allocated', `₹${selectedDistrict.budgetAllocatedCrore} Cr`],
                            ['District utilized', `₹${selectedDistrict.budgetUtilizedCrore} Cr`],
                            ['Utilization gap', `₹${selectedDistrict.budgetAllocatedCrore - selectedDistrict.budgetUtilizedCrore} Cr`],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</div>
                              <div className="mt-1 text-lg font-semibold text-[var(--text-heading)]">{value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                          <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-warm)]">
                            <Landmark className="h-4 w-4" />
                            Budget Allocation & Utilization
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">District allocated</div>
                              <div className="mt-1 text-xl font-semibold text-[var(--text-heading)]">₹{selectedDistrict.budgetAllocatedCrore} Cr</div>
                            </div>
                            <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">District utilized</div>
                              <div className="mt-1 text-xl font-semibold text-[var(--text-heading)]">₹{selectedDistrict.budgetUtilizedCrore} Cr</div>
                            </div>
                            <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Scheme released</div>
                              <div className="mt-1 text-lg font-semibold text-[var(--text-heading)]">₹{schemeBudgetSummary.released} Cr</div>
                            </div>
                            <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-3">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Scheme utilized</div>
                              <div className="mt-1 text-lg font-semibold text-[var(--text-heading)]">₹{schemeBudgetSummary.utilized} Cr</div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                          <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-bright)]">
                            <MapPinned className="h-4 w-4" />
                            Disaster Watch Layer
                          </div>
                          <div className="mb-3 grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">District risk</div>
                              <div className="mt-1 text-sm text-[var(--text-heading)]">{selectedDistrict.disasterRisk}</div>
                            </div>
                            <div className="rounded-xl border border-white/8 bg-white/4 px-3 py-2">
                              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Live alerts</div>
                              <div className="mt-1 text-sm text-[var(--text-heading)]">{districtAlerts.length}</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {scopeByZone(districtAlerts).slice(0, 2).map((item) => (
                              <div key={item.id} className="rounded-xl border border-white/8 bg-white/4 p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-[13px] text-[var(--text-primary)]">{item.title}</div>
                                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                      {item.zone} · {item.type} alert
                                    </div>
                                  </div>
                                  <span className={`text-[10px] uppercase tracking-[0.18em] ${metricTone(item.severity)}`}>{item.severity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-10 text-center text-[var(--text-muted)]">{loading ? 'Loading command view...' : 'No district selected.'}</div>
              )}
            </div>

            <LiveAlerts alerts={data.alerts} onLocate={(lat, lng, districtId) => focusDistrict(districtId, lat, lng)} />
            <IntelFeed feed={data.feed} onLocate={(lat, lng, districtId) => focusDistrict(districtId, lat, lng)} />
          </aside>
        </section>
        ) : (
          <FlowRadarWorkspace data={flowRadarData} externalFlyToLocation={flyToLocation} />
        )}
      </div>

      <GlobalStatusBar data={data} />
    </main>
  );
}

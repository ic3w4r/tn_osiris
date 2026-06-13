'use client';

import { memo, useMemo } from 'react';

import { GovernanceDashboardData } from '@/lib/tn-governance-data';

import { REFERENCE_DISTRICTS, REFERENCE_MAP_HEIGHT, REFERENCE_MAP_WIDTH } from './TNInteractiveDistrictMap.reference';

interface MapEntityClick {
  type: 'district' | 'zone' | 'grievance' | 'project' | 'scheme' | 'tender' | 'asset' | 'alert';
  id: string;
  districtId: string;
}

interface OsirisMapProps {
  data: GovernanceDashboardData;
  activeLayers: Record<string, boolean>;
  selectedDistrictId?: string | null;
  selectedZoneId?: string | null;
  onEntityClick?: (entity: MapEntityClick) => void;
  onMouseCoords?: (coords: { lat: number; lng: number }) => void;
  flyToLocation?: { lat: number; lng: number; zoom?: number; ts: number } | null;
}

const MAP_WIDTH = REFERENCE_MAP_WIDTH;
const MAP_HEIGHT = REFERENCE_MAP_HEIGHT;
const GEO_MIN_LNG = 76;
const GEO_MAX_LNG = 80.6;
const GEO_MIN_LAT = 7.6;
const GEO_MAX_LAT = 13.7;
const KEY_HUBS = new Set([
  'chennai',
  'vellore',
  'salem',
  'coimbatore',
  'tiruchirappalli',
  'thanjavur',
  'madurai',
  'tirunelveli',
  'cuddalore',
]);

function colorForRisk(level: string) {
  switch (level) {
    case 'CRITICAL':
      return '#ff6477';
    case 'HIGH':
      return '#ff9b46';
    case 'ELEVATED':
      return '#f0c955';
    default:
      return '#4fd39c';
  }
}

function fillForRisk(level: string) {
  switch (level) {
    case 'CRITICAL':
      return '#131828';
    case 'HIGH':
      return '#121b28';
    case 'ELEVATED':
      return '#122031';
    default:
      return '#102334';
  }
}

function colorForType(type: MapEntityClick['type']) {
  switch (type) {
    case 'grievance':
      return '#ff9b46';
    case 'project':
      return '#ff6477';
    case 'scheme':
      return '#25d391';
    case 'tender':
      return '#f0c955';
    case 'asset':
      return '#58b4ff';
    case 'alert':
      return '#a17cff';
    case 'zone':
      return '#59f0ff';
    default:
      return '#59f0ff';
  }
}

function fallbackDistrictPoint(lat: number, lng: number) {
  const x = 180 + ((lng - GEO_MIN_LNG) / (GEO_MAX_LNG - GEO_MIN_LNG)) * (MAP_WIDTH - 340);
  const y = 160 + ((GEO_MAX_LAT - lat) / (GEO_MAX_LAT - GEO_MIN_LAT)) * (MAP_HEIGHT - 300);
  return { x, y, rx: 52, ry: 32, region: 'Reference fallback', fill: '#233549' };
}

function zoneOffset(zone: string, rx: number, ry: number) {
  switch (zone) {
    case 'North':
      return { x: 0, y: -ry - 110 };
    case 'South':
      return { x: 0, y: ry + 110 };
    case 'East':
      return { x: rx + 128, y: 0 };
    default:
      return { x: -rx - 128, y: 0 };
  }
}

function markerOffset(index: number) {
  const spread = [
    { x: -52, y: -18 },
    { x: -16, y: -36 },
    { x: 22, y: -28 },
    { x: 52, y: -8 },
    { x: -42, y: 24 },
    { x: 0, y: 38 },
    { x: 40, y: 28 },
  ];
  return spread[index % spread.length] ?? { x: 0, y: 0 };
}

function greyDistrictFill(selected: boolean) {
  return selected ? '#1b2b3d' : '#132232';
}

function makeDistrictConnections(
  districts: Array<{ id: string; x: number; y: number; isPopulated: boolean }>,
) {
  const populated = districts.filter((district) => district.isPopulated);
  const edges = new Map<string, { from: string; to: string }>();

  populated.forEach((district) => {
    const nearest = populated
      .filter((candidate) => candidate.id !== district.id)
      .map((candidate) => ({
        id: candidate.id,
        distance: Math.hypot(candidate.x - district.x, candidate.y - district.y),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    nearest.forEach((candidate) => {
      const key = [district.id, candidate.id].sort().join(':');
      if (!edges.has(key)) {
        edges.set(key, { from: district.id, to: candidate.id });
      }
    });
  });

  return Array.from(edges.values());
}

function connectorPath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const midX = (from.x + to.x) / 2;
  const bend = Math.max(18, Math.abs(from.x - to.x) * 0.08);
  const controlY = Math.min(from.y, to.y) - bend;
  return `M ${from.x} ${from.y} Q ${midX} ${controlY} ${to.x} ${to.y}`;
}

function zoneConnectorPath(from: { x: number; y: number }, to: { x: number; y: number }, zone: string) {
  if (zone === 'North' || zone === 'South') {
    const controlY = zone === 'North' ? to.y + 26 : to.y - 26;
    return `M ${from.x} ${from.y} Q ${from.x} ${controlY} ${to.x} ${to.y}`;
  }

  const controlX = zone === 'East' ? to.x - 36 : to.x + 36;
  return `M ${from.x} ${from.y} Q ${controlX} ${from.y} ${to.x} ${to.y}`;
}

function hudLabelForDistrict(name: string) {
  if (name.length <= 12) return name.toUpperCase();
  return name.split(' ')[0]?.toUpperCase() ?? name.toUpperCase();
}

function OsirisMap({ data, activeLayers, selectedDistrictId, selectedZoneId, onEntityClick }: OsirisMapProps) {
  const populatedDistrictLayouts = useMemo(() => {
    const referenceMap = new Map(REFERENCE_DISTRICTS.map((district) => [district.id, district]));
    return data.districts.map((district) => {
      const reference = referenceMap.get(district.id);
      const fallback = fallbackDistrictPoint(district.lat, district.lng);
      return {
        ...district,
        x: reference?.x ?? fallback.x,
        y: reference?.y ?? fallback.y,
        rx: reference?.rx ?? fallback.rx,
        ry: reference?.ry ?? fallback.ry,
        region: reference?.region ?? fallback.region,
        fill: reference?.fill ?? fallback.fill,
      };
    });
  }, [data.districts]);

  const districtLayouts = useMemo(() => {
    const populatedMap = new Map(populatedDistrictLayouts.map((district) => [district.id, district]));

    return REFERENCE_DISTRICTS.map((reference) => {
      const liveDistrict = populatedMap.get(reference.id);
      if (liveDistrict) {
        return {
          ...liveDistrict,
          isPopulated: true,
        };
      }

      return {
        id: reference.id,
        name: reference.name,
        lat: 0,
        lng: 0,
        populationLakhs: 0,
        governanceScore: 0,
        riskLevel: 'LOW' as const,
        topIssue: 'Data not populated yet',
        pendingGrievances: 0,
        delayedProjects: 0,
        schemeCoverage: 0,
        budgetUtilization: 0,
        budgetAllocatedCrore: 0,
        budgetUtilizedCrore: 0,
        disasterRisk: 'Not populated',
        alerts: 0,
        x: reference.x,
        y: reference.y,
        rx: reference.rx,
        ry: reference.ry,
        region: reference.region,
        fill: reference.fill,
        isPopulated: false,
      };
    });
  }, [populatedDistrictLayouts]);

  const selectedDistrict =
    districtLayouts.find((district) => district.id === selectedDistrictId && district.isPopulated) ??
    districtLayouts.find((district) => district.isPopulated) ??
    null;

  const districtConnections = useMemo(() => makeDistrictConnections(districtLayouts), [districtLayouts]);

  const selectedZones = useMemo(
    () => data.zones.filter((zone) => zone.districtId === selectedDistrict?.id),
    [data.zones, selectedDistrict],
  );

  const zoneNodes = useMemo(
    () =>
      selectedZones.map((zone) => {
        const offset = zoneOffset(zone.zone, selectedDistrict?.rx ?? 58, selectedDistrict?.ry ?? 36);
        return {
          ...zone,
          x: (selectedDistrict?.x ?? MAP_WIDTH / 2) + offset.x,
          y: (selectedDistrict?.y ?? MAP_HEIGHT / 2) + offset.y,
        };
      }),
    [selectedDistrict, selectedZones],
  );

  const entityLayers = useMemo(() => {
    const scopedByZone = <T extends { districtId: string; zone?: string }>(items: T[]) =>
      items.filter((item) => {
        if (!selectedDistrict) return false;
        if (selectedZoneId) {
          const selectedZone = selectedZones.find((zone) => zone.id === selectedZoneId);
          if (!selectedZone) return false;
          return item.districtId === selectedDistrict.id && item.zone === selectedZone.zone;
        }
        return item.districtId === selectedDistrict.id;
      });

    return [
      { type: 'grievance' as const, active: activeLayers.grievances, items: scopedByZone(data.grievances) },
      { type: 'project' as const, active: activeLayers.projects, items: scopedByZone(data.projects) },
      { type: 'scheme' as const, active: activeLayers.schemes, items: scopedByZone(data.schemes) },
      { type: 'tender' as const, active: activeLayers.tenders, items: scopedByZone(data.tenders) },
      { type: 'asset' as const, active: activeLayers.assets, items: scopedByZone(data.assets) },
      { type: 'alert' as const, active: activeLayers.disasters, items: scopedByZone(data.alerts) },
    ];
  }, [
    activeLayers.assets,
    activeLayers.disasters,
    activeLayers.grievances,
    activeLayers.projects,
    activeLayers.schemes,
    activeLayers.tenders,
    data.alerts,
    data.assets,
    data.grievances,
    data.projects,
    data.schemes,
    data.tenders,
    selectedDistrict,
    selectedZoneId,
    selectedZones,
  ]);

  const zoneEntityGroups = useMemo(
    () =>
      zoneNodes.map((zone) => {
        const items = entityLayers.flatMap((layer) =>
          layer.active
            ? layer.items
                .filter((item) => item.zone === zone.zone)
                .map((item, index) => {
                  const offset = markerOffset(index);
                  return {
                    id: `${layer.type}-${item.id}`,
                    itemId: item.id,
                    districtId: item.districtId,
                    type: layer.type,
                    zone: zone.zone,
                    x: zone.x + offset.x,
                    y: zone.y + 92 + offset.y,
                    label: item.name,
                  };
                })
            : [],
        );

        return {
          ...zone,
          items,
        };
      }),
    [entityLayers, zoneNodes],
  );

  const layoutMap = useMemo(() => new Map(districtLayouts.map((district) => [district.id, district])), [districtLayouts]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#050d16]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(72,229,255,0.12),transparent_26%),radial-gradient(circle_at_80%_22%,rgba(88,180,255,0.08),transparent_24%),linear-gradient(180deg,rgba(6,18,31,0.98),rgba(4,11,19,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(81,137,196,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(81,137,196,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_60%,rgba(0,0,0,0.34)_100%)]" />

      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="relative h-full w-full">
        <defs>
          <filter id="hud-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="node-glow">
            <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor="#53efff" floodOpacity="0.45" />
          </filter>
          <filter id="risk-glow-critical">
            <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#ff6477" floodOpacity="0.52" />
          </filter>
          <filter id="risk-glow-high">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#ff9b46" floodOpacity="0.46" />
          </filter>
          <filter id="risk-glow-elevated">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#f0c955" floodOpacity="0.42" />
          </filter>
          <filter id="risk-glow-low">
            <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor="#4fd39c" floodOpacity="0.38" />
          </filter>
          <linearGradient id="frame-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5df2ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2d7bd8" stopOpacity="0.44" />
          </linearGradient>
        </defs>

        <rect x="18" y="18" width={MAP_WIDTH - 36} height={MAP_HEIGHT - 36} rx="28" fill="none" stroke="url(#frame-stroke)" strokeWidth="3" opacity="0.9" />
        <rect x="32" y="32" width={MAP_WIDTH - 64} height={MAP_HEIGHT - 64} rx="24" fill="none" stroke="rgba(88,180,255,0.16)" strokeWidth="1.2" />

        <text x="68" y="74" fill="#f0f7ff" fontSize="28" fontWeight="700" letterSpacing="0.04em">
          TAMIL NADU DIGITAL OPERATIONAL MAP
        </text>
        <text x="68" y="110" fill="#7bcce3" fontSize="18" letterSpacing="0.12em">
          DISTRICT COMMAND GRID • LIVE ZONE ORCHESTRATION
        </text>

        <text x={MAP_WIDTH - 190} y="84" fill="#7bd5ed" fontSize="14" textAnchor="end" letterSpacing="0.14em">
          TN-OSIRIS • MAP MODE
        </text>
        <text x={MAP_WIDTH - 190} y="110" fill="#5a7894" fontSize="11" textAnchor="end" letterSpacing="0.18em">
          NORTH / SOUTH / EAST / WEST
        </text>

        {districtConnections.map((connection) => {
          const from = layoutMap.get(connection.from);
          const to = layoutMap.get(connection.to);
          if (!from || !to) return null;
          const active = from.id === selectedDistrict?.id || to.id === selectedDistrict?.id;
          return (
            <path
              key={`${connection.from}-${connection.to}`}
              d={connectorPath(from, to)}
              fill="none"
              stroke={active ? '#67f2ff' : 'rgba(79, 211, 255, 0.34)'}
              strokeWidth={active ? 2.8 : 1.35}
              strokeDasharray={active ? '0' : '6 8'}
              opacity={active ? 0.9 : 0.52}
            />
          );
        })}

        {districtLayouts.map((district) => {
          const selected = district.id === selectedDistrict?.id;
          const clickable = district.isPopulated;
          const strokeColor = district.isPopulated ? colorForRisk(district.riskLevel) : '#58728e';
          const labelVisible = selected || KEY_HUBS.has(district.id);
          const glowFilter = selected
            ? district.riskLevel === 'CRITICAL'
              ? 'url(#risk-glow-critical)'
              : district.riskLevel === 'HIGH'
                ? 'url(#risk-glow-high)'
                : district.riskLevel === 'ELEVATED'
                  ? 'url(#risk-glow-elevated)'
                  : 'url(#risk-glow-low)'
            : undefined;

          return (
            <g
              key={district.id}
              className={clickable ? 'cursor-pointer' : ''}
              onClick={() => {
                if (!clickable) return;
                onEntityClick?.({ type: 'district', id: district.id, districtId: district.id });
              }}
            >
              <ellipse
                cx={district.x}
                cy={district.y}
                rx={district.rx + (selected ? 9 : 0)}
                ry={district.ry + (selected ? 7 : 0)}
                fill={district.isPopulated ? fillForRisk(district.riskLevel) : greyDistrictFill(selected)}
                stroke={strokeColor}
                strokeWidth={selected ? 3.6 : district.isPopulated ? 1.6 : 1}
                opacity={district.isPopulated ? (selected ? 0.96 : 0.82) : 0.56}
                filter={glowFilter}
              />
              <ellipse
                cx={district.x}
                cy={district.y}
                rx={Math.max(8, district.rx * 0.16)}
                ry={Math.max(8, district.ry * 0.2)}
                fill={district.isPopulated ? strokeColor : '#7a8ea4'}
                opacity={district.isPopulated ? 0.9 : 0.45}
                filter={district.isPopulated ? 'url(#node-glow)' : undefined}
              />
              <circle cx={district.x} cy={district.y} r={district.isPopulated ? 6 : 4} fill="#ddf8ff" opacity={district.isPopulated ? 1 : 0.45} />

              {labelVisible && (
                <>
                  <text
                    x={district.x + district.rx + 14}
                    y={district.y + 4}
                    fill={selected ? '#ffffff' : '#d3ecff'}
                    fontSize={selected ? 32 : 22}
                    fontWeight="700"
                    letterSpacing="0.02em"
                  >
                    {hudLabelForDistrict(district.name)}
                  </text>
                  {district.isPopulated && (
                    <text
                      x={district.x + district.rx + 14}
                      y={district.y + 28}
                      fill={selected ? strokeColor : '#6ba1c6'}
                      fontSize={selected ? 13 : 11}
                      letterSpacing="0.14em"
                    >
                      {selected ? `${district.topIssue.toUpperCase()}` : `${district.governanceScore}/100 GOV SCORE`}
                    </text>
                  )}
                </>
              )}

              {!district.isPopulated && (
                <text
                  x={district.x}
                  y={district.y + district.ry + 16}
                  fill="#6f8499"
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                  letterSpacing="0.14em"
                >
                  GREYED • NOT POPULATED
                </text>
              )}
            </g>
          );
        })}

        {selectedDistrict &&
          zoneEntityGroups.map((zone) => {
            const selected = zone.id === selectedZoneId;
            const zoneColor = colorForRisk(zone.riskLevel);
            return (
              <g key={zone.id}>
                <path
                  d={zoneConnectorPath(selectedDistrict, zone, zone.zone)}
                  fill="none"
                  stroke={selected ? '#86f6ff' : zoneColor}
                  strokeWidth={selected ? 3.2 : 2}
                  strokeDasharray={selected ? '0' : '8 8'}
                  opacity={0.9}
                />
                <g className="cursor-pointer" onClick={() => onEntityClick?.({ type: 'zone', id: zone.id, districtId: zone.districtId })}>
                  <rect
                    x={zone.x - 74}
                    y={zone.y - 40}
                    width="148"
                    height="80"
                    rx="22"
                    fill={selected ? 'rgba(20,40,62,0.98)' : 'rgba(10,24,39,0.88)'}
                    stroke={selected ? '#86f6ff' : zoneColor}
                    strokeWidth={selected ? 3 : 1.8}
                    filter="url(#hud-glow)"
                  />
                  <text x={zone.x} y={zone.y - 10} fill="#f3f9ff" fontSize="22" fontWeight="700" textAnchor="middle" letterSpacing="0.1em">
                    {zone.zone.toUpperCase()}
                  </text>
                  <text x={zone.x} y={zone.y + 12} fill="#81a7c8" fontSize="11" textAnchor="middle" letterSpacing="0.1em">
                    {zone.pendingGrievances} GRV • {zone.delayedProjects} PRJ • {zone.trackedAssets} AST
                  </text>
                  <text x={zone.x} y={zone.y + 28} fill={zoneColor} fontSize="10" textAnchor="middle" letterSpacing="0.16em">
                    {zone.topIssue.toUpperCase().slice(0, 28)}
                  </text>
                </g>

                {zone.items.map((item) => (
                  <g
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => onEntityClick?.({ type: item.type, id: item.itemId, districtId: item.districtId })}
                  >
                    <path
                      d={`M ${zone.x} ${zone.y + 42} Q ${(zone.x + item.x) / 2} ${(zone.y + item.y) / 2 - 10} ${item.x} ${item.y}`}
                      fill="none"
                      stroke={colorForType(item.type)}
                      strokeWidth="1.4"
                      opacity="0.42"
                    />
                    <circle cx={item.x} cy={item.y} r="14" fill="rgba(10, 20, 34, 0.92)" stroke={colorForType(item.type)} strokeWidth="1.5" />
                    <circle cx={item.x} cy={item.y} r="6" fill={colorForType(item.type)} filter="url(#node-glow)" />
                  </g>
                ))}
              </g>
            );
          })}

        {selectedDistrict && (
          <>
            <rect x="58" y="128" width="250" height="86" rx="18" fill="rgba(7,18,30,0.9)" stroke="rgba(88,180,255,0.25)" />
            <text x="82" y="158" fill="#66ebff" fontSize="13" fontWeight="700" letterSpacing="0.14em">
              ACTIVE DISTRICT
            </text>
            <text x="82" y="190" fill="#ffffff" fontSize="28" fontWeight="700">
              {selectedDistrict.name}
            </text>
            <text x="82" y="212" fill={colorForRisk(selectedDistrict.riskLevel)} fontSize="12" letterSpacing="0.12em">
              {selectedDistrict.riskLevel} • {selectedDistrict.pendingGrievances} PENDING • {selectedDistrict.delayedProjects} DELAYED
            </text>

            <rect x="70" y={MAP_HEIGHT - 128} width={MAP_WIDTH - 140} height="72" rx="22" fill="rgba(7,18,30,0.9)" stroke="rgba(88,180,255,0.2)" />
            <text x={MAP_WIDTH / 2} y={MAP_HEIGHT - 84} fill="#d8f5ff" fontSize="18" fontWeight="700" textAnchor="middle" letterSpacing="0.06em">
              {selectedDistrict.name.toUpperCase()} IS LIVE WITH NORTH • SOUTH • EAST • WEST ZONES
            </text>
            <text x={MAP_WIDTH / 2} y={MAP_HEIGHT - 60} fill="#7ea7c8" fontSize="12" textAnchor="middle" letterSpacing="0.12em">
              Click the district node, then choose a directional zone to isolate grievances, projects, schemes, tenders, assets, and alerts.
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

export default memo(OsirisMap);

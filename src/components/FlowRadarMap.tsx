'use client';

import { memo, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { FlowPassport, FlowRadarDistrictSummary, FlowModule } from '@/lib/tn-flowradar-data';

interface FlowRadarMapProps {
  districts: FlowRadarDistrictSummary[];
  flows: FlowPassport[];
  activeModule: FlowModule | 'all';
  selectedDistrictId?: string | null;
  selectedFlowId?: string | null;
  flyToLocation?: { lat: number; lng: number; zoom?: number; ts: number } | null;
  onSelectDistrict?: (districtId: string) => void;
  onSelectFlow?: (flowId: string) => void;
}

const emptyCollection = { type: 'FeatureCollection' as const, features: [] };
const tamilNaduBounds = new maplibregl.LngLatBounds([76.0, 7.6], [80.6, 13.7]);

function riskColor(level: string) {
  switch (level) {
    case 'CRITICAL':
      return '#ff5f6d';
    case 'HIGH':
      return '#ff8f3d';
    case 'ELEVATED':
      return '#f6c453';
    default:
      return '#52d39e';
  }
}

function moduleColor(module: FlowModule) {
  switch (module) {
    case 'fund_flow':
      return '#24c4b0';
    case 'file_flow':
      return '#8a9fff';
    case 'grievance_flow':
      return '#ff8f3d';
    case 'tender_flow':
      return '#f6c453';
    case 'project_flow':
      return '#ff5f6d';
    case 'scheme_benefit_flow':
      return '#52d39e';
    case 'certificate_service_flow':
      return '#73d4ff';
    case 'vehicle_field_team_flow':
      return '#ff7ec9';
    case 'material_supply_flow':
      return '#7ab8ff';
    case 'disaster_response_flow':
      return '#b595ff';
    case 'inspection_flow':
      return '#ffd166';
    case 'citizen_impact_flow':
      return '#48e5c2';
    default:
      return '#24c4b0';
  }
}

function popupHtml(title: string, accent: string, rows: Array<[string, string]>) {
  return `
    <div style="min-width:220px;background:rgba(8,16,28,0.95);border:1px solid ${accent}55;border-radius:16px;padding:14px 16px;color:#f5f7fb;font-family:IBM Plex Mono, monospace;">
      <div style="font-size:13px;font-weight:700;color:${accent};margin-bottom:8px;">${title}</div>
      ${rows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;gap:12px;margin:6px 0;"><span style="color:#8ea1b8;">${k}</span><span style="text-align:right;color:#f5f7fb;">${v}</span></div>`).join('')}
    </div>
  `;
}

function FlowRadarMap({
  districts,
  flows,
  activeModule,
  selectedDistrictId,
  selectedFlowId,
  flyToLocation,
  onSelectDistrict,
  onSelectFlow,
}: FlowRadarMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [78.4, 10.75],
      zoom: 7.2,
      minZoom: 6.4,
      maxZoom: 13.8,
      attributionControl: false,
      maxBounds: tamilNaduBounds,
    });

    map.on('load', () => {
      mapRef.current = map;

      ['districts', 'routes', 'stages', 'current-stage', 'selected-route'].forEach((name) => {
        map.addSource(name, { type: 'geojson', data: emptyCollection });
      });

      map.addLayer({
        id: 'routes',
        type: 'line',
        source: 'routes',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.5,
          'line-opacity': 0.28,
          'line-dasharray': [2, 2],
        },
      });

      map.addLayer({
        id: 'selected-route',
        type: 'line',
        source: 'selected-route',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3.2,
          'line-opacity': 0.9,
        },
      });

      map.addLayer({
        id: 'districts',
        type: 'circle',
        source: 'districts',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 7, 10, 14],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.9,
          'circle-stroke-width': 1.2,
          'circle-stroke-color': '#f8fafc',
        },
      });

      map.addLayer({
        id: 'districts-labels',
        type: 'symbol',
        source: 'districts',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-font': ['Open Sans Bold'],
          'text-offset': [0, 1.2],
        },
        paint: {
          'text-color': '#f5f7fb',
          'text-halo-color': '#08101c',
          'text-halo-width': 1,
        },
      });

      map.addLayer({
        id: 'stages',
        type: 'circle',
        source: 'stages',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 4, 10, 7],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.85,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#dfe8f7',
        },
      });

      map.addLayer({
        id: 'current-stage',
        type: 'circle',
        source: 'current-stage',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 8, 10, 14],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.2,
          'circle-stroke-width': 2,
          'circle-stroke-color': ['get', 'color'],
        },
      });

      map.on('click', 'districts', (event) => {
        const props = event.features?.[0]?.properties;
        if (!props) return;
        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup({ closeButton: true, maxWidth: '320px' })
          .setLngLat(event.lngLat)
          .setHTML(
            popupHtml(String(props.name), String(props.color), [
              ['Flow score', String(props.flowScore)],
              ['Active flows', String(props.activeFlows)],
              ['Delayed flows', String(props.delayedFlows)],
              ['Critical flows', String(props.criticalFlows)],
              ['Top bottleneck', String(props.topBottleneck)],
            ]),
          )
          .addTo(map);
        onSelectDistrict?.(String(props.id));
      });

      map.on('click', 'stages', (event) => {
        const props = event.features?.[0]?.properties;
        if (!props) return;
        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup({ closeButton: true, maxWidth: '320px' })
          .setLngLat(event.lngLat)
          .setHTML(
            popupHtml(String(props.title), String(props.color), [
              ['Module', String(props.moduleLabel)],
              ['Stage', String(props.stage)],
              ['Owner', String(props.owner)],
              ['Risk', String(props.riskLevel)],
              ['Status', String(props.status)],
            ]),
          )
          .addTo(map);
        onSelectFlow?.(String(props.flowId));
      });

      map.fitBounds(tamilNaduBounds, { padding: { top: 80, bottom: 80, left: 60, right: 60 }, duration: 0 });
    });

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [onSelectDistrict, onSelectFlow]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const districtFeatures = districts.map((item) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [item.lng, item.lat] },
      properties: {
        id: item.districtId,
        name: item.district,
        flowScore: item.flowScore,
        activeFlows: item.activeFlows,
        delayedFlows: item.delayedFlows,
        criticalFlows: item.criticalFlows,
        topBottleneck: item.topBottleneck,
        color: item.districtId === selectedDistrictId ? '#24c4b0' : item.flowScore > 80 ? '#ff5f6d' : item.flowScore > 60 ? '#ff8f3d' : '#52d39e',
      },
    }));

    const filteredFlows = flows.filter((flow) => {
      if (activeModule !== 'all' && flow.flowType !== activeModule) return false;
      if (selectedDistrictId && flow.districtId !== selectedDistrictId) return false;
      return true;
    });

    const routeFeatures = filteredFlows.map((flow) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: flow.route.map((stage) => [stage.lng, stage.lat]),
      },
      properties: {
        flowId: flow.flowId,
        color: moduleColor(flow.flowType),
      },
    }));

    const stageFeatures = filteredFlows.flatMap((flow) =>
      flow.route.map((stage) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [stage.lng, stage.lat] },
        properties: {
          flowId: flow.flowId,
          title: flow.title,
          stage: stage.label,
          owner: stage.owner,
          riskLevel: flow.riskLevel,
          status: stage.status,
          moduleLabel: flow.flowType.replaceAll('_', ' '),
          color: stage.status === 'current' ? riskColor(flow.riskLevel) : moduleColor(flow.flowType),
        },
      })),
    );

    const currentStageFeatures = filteredFlows
      .map((flow) => {
        const stage = flow.route.find((item) => item.status === 'current');
        if (!stage) return null;
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [stage.lng, stage.lat] },
          properties: {
            flowId: flow.flowId,
            color: riskColor(flow.riskLevel),
          },
        };
      })
      .filter(Boolean);

    const selected = flows.find((flow) => flow.flowId === selectedFlowId);
    const selectedRouteFeature = selected
      ? [
          {
            type: 'Feature' as const,
            geometry: {
              type: 'LineString' as const,
              coordinates: selected.route.map((stage) => [stage.lng, stage.lat]),
            },
            properties: {
              color: '#f8fafc',
            },
          },
        ]
      : [];

    (map.getSource('districts') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: districtFeatures });
    (map.getSource('routes') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: routeFeatures });
    (map.getSource('stages') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: stageFeatures });
    (map.getSource('current-stage') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: currentStageFeatures as GeoJSON.Feature[] });
    (map.getSource('selected-route') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: selectedRouteFeature });
  }, [activeModule, districts, flows, selectedDistrictId, selectedFlowId]);

  useEffect(() => {
    if (!flyToLocation || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [flyToLocation.lng, flyToLocation.lat],
      zoom: flyToLocation.zoom ?? 8.7,
      essential: true,
      speed: 0.8,
    });
  }, [flyToLocation]);

  return <div ref={containerRef} className="h-full w-full" />;
}

export default memo(FlowRadarMap);

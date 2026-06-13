import { body, C, coverBg, footer, gridCell, kicker, miniPill, panel, title } from './deck-helpers.mjs';

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  coverBg(ctx, slide, true);

  kicker(ctx, slide, 'THE PLATFORM', 72, 58, true);
  title(ctx, slide, 'TN-OSIRIS converts scattered government data into one command surface.', 72, 84, 740, 60, true, 34);
  body(ctx, slide, 'The platform ingests public and departmental signals, normalizes them into district and flow objects, then exposes them through two operating modes: Governance Intelligence and FlowRadar.', 72, 148, 760, 52, true, 17);

  panel(ctx, slide, { left: 72, top: 238, width: 250, height: 360, dark: true, fill: C.panel2 });
  miniPill(ctx, slide, { text: 'INPUTS', left: 94, top: 258, dark: true, tone: C.teal });
  body(ctx, slide, '• grievance channels\n• tender and procurement feeds\n• project and scheme records\n• budget and utilization data\n• public asset status\n• weather and disaster alerts\n• future official API integrations', 94, 302, 190, 220, true, 18);

  panel(ctx, slide, { left: 362, top: 238, width: 272, height: 360, dark: true, fill: '#0c1c31' });
  miniPill(ctx, slide, { text: 'INTELLIGENCE LAYER', left: 386, top: 258, width: 150, dark: true, tone: C.amber });
  body(ctx, slide, '• district and zone normalization\n• risk scoring\n• department linkage\n• event and heat aggregation\n• flow-passport object model\n• cross-layer correlation', 386, 302, 208, 210, true, 18);

  panel(ctx, slide, { left: 674, top: 238, width: 250, height: 360, dark: true, fill: C.panel2 });
  miniPill(ctx, slide, { text: 'COMMAND SURFACES', left: 698, top: 258, width: 160, dark: true, tone: C.rose });
  body(ctx, slide, '• statewide map\n• district command view\n• department heat channels\n• governance feed\n• district-zone navigation\n• object-level tracking', 698, 302, 190, 210, true, 18);

  panel(ctx, slide, { left: 964, top: 238, width: 244, height: 360, dark: true, fill: '#0c1c31' });
  miniPill(ctx, slide, { text: 'ACTION OUTPUTS', left: 988, top: 258, width: 146, dark: true, tone: C.blue });
  body(ctx, slide, '• earlier escalation\n• budget-to-impact visibility\n• district comparison\n• bottleneck discovery\n• disaster readiness tracking\n• service delivery accountability', 988, 302, 184, 210, true, 18);

  title(ctx, slide, 'Two modes, one backbone', 72, 628, 320, 30, true, 24);
  gridCell(ctx, slide, { left: 362, top: 620, width: 262, height: 64, titleText: 'Governance Intelligence', bodyText: 'Map-first district and department command for public-service monitoring.', accent: C.teal, dark: true });
  gridCell(ctx, slide, { left: 650, top: 620, width: 262, height: 64, titleText: 'FlowRadar', bodyText: 'Object-level tracking for funds, files, tenders, projects, services, and field operations.', accent: C.amber, dark: true });

  footer(ctx, slide, 3, true);
  return slide;
}

import { body, C, coverBg, footer, gridCell, kicker, panel, title } from './deck-helpers.mjs';

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  coverBg(ctx, slide, true);

  kicker(ctx, slide, 'ROLLOUT STRATEGY', 72, 54, true);
  title(ctx, slide, 'The platform can start as a public-data MVP and mature into an official state command grid.', 72, 82, 780, 92, true, 32);
  body(ctx, slide, 'The current system already supports a realistic first operating shell. The scale-up path is additive: more integrations, more depth, and more operational fidelity over time.', 72, 176, 760, 46, true, 16);

  gridCell(ctx, slide, { left: 72, top: 232, width: 340, height: 208, titleText: 'Phase 1  /  Public data launch', bodyText: 'Deploy map-first governance intelligence using seeded and public datasets.\n\nOutputs:\n• district risk views\n• scheme, project, grievance, and tender layers\n• statewide command narrative', accent: C.teal, dark: true });
  gridCell(ctx, slide, { left: 438, top: 232, width: 340, height: 208, titleText: 'Phase 2  /  Department integrations', bodyText: 'Connect grievance, scheme, budget, and project systems.\n\nOutputs:\n• real department channels\n• stronger district command fidelity\n• budget-to-delivery traceability', accent: C.amber, dark: true });
  gridCell(ctx, slide, { left: 804, top: 232, width: 404, height: 208, titleText: 'Phase 3  /  Operating system maturity', bodyText: 'Activate full FlowRadar across files, funds, vehicles, materials, inspections, and citizen-impact verification.\n\nOutputs:\n• live object tracking\n• intervention workflows\n• state PMU / command-center use', accent: C.rose, dark: true });

  panel(ctx, slide, { left: 72, top: 474, width: 540, height: 160, dark: true, fill: '#0c1c31' });
  title(ctx, slide, 'Integration ladder', 96, 500, 220, 24, true, 22);
  body(ctx, slide, 'Public data → portal connectors → department APIs → field updates → verified outcome signals', 96, 536, 470, 24, true, 17);
  body(ctx, slide, 'That means the architecture is investable early without pretending the hard integrations already exist.', 96, 578, 420, 24, true, 15);

  panel(ctx, slide, { left: 646, top: 474, width: 562, height: 160, dark: true, fill: C.panel2 });
  title(ctx, slide, 'Recommended first deployment', 670, 500, 270, 34, true, 18);
  body(ctx, slide, '• 3 to 5 districts with different operating profiles\n• 4 priority departments\n• governance mode first, FlowRadar second\n• PMU-led operating cadence with escalation ownership', 670, 536, 472, 68, true, 16);

  footer(ctx, slide, 8, true);
  return slide;
}

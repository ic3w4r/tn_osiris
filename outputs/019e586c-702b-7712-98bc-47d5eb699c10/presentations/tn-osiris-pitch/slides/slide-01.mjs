import { body, C, coverBg, footer, kicker, metricCard, panel, title } from './deck-helpers.mjs';

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  coverBg(ctx, slide, true);

  kicker(ctx, slide, 'GOVERNANCE COMMAND GRID', 72, 62, true);
  title(ctx, slide, 'TN-OSIRIS is a state operating layer for public-service visibility and action.', 72, 92, 670, 152, true, 38);
  body(
    ctx,
    slide,
    'A Tamil Nadu-wide platform that fuses map-first governance intelligence with FlowRadar-style operational tracking across districts, departments, schemes, projects, grievances, budgets, tenders, and disaster response.',
    72,
    260,
    670,
    92,
    true,
    19,
  );

  metricCard(ctx, slide, { left: 72, top: 354, width: 190, label: 'Districts monitored', value: '38', tone: C.teal });
  metricCard(ctx, slide, { left: 280, top: 354, width: 190, label: 'Pending grievances', value: '2,558', tone: C.amber });
  metricCard(ctx, slide, { left: 488, top: 354, width: 190, label: 'Delayed projects', value: '21', tone: C.rose });
  metricCard(ctx, slide, { left: 696, top: 354, width: 190, label: 'Tender risk', value: '₹272 Cr', tone: C.blue });

  panel(ctx, slide, { left: 786, top: 94, width: 412, height: 236, dark: true, fill: C.panel2 });
  kicker(ctx, slide, 'WHAT IT CHANGES', 814, 122, true);
  title(ctx, slide, 'One map.\nTwo operating modes.\nA measurable governance backbone.', 814, 150, 340, 128, true, 23);
  body(ctx, slide, 'District command on one side. Object tracking on the other. Both on a single Tamil Nadu operating surface.', 814, 292, 340, 42, true, 13);

  panel(ctx, slide, { left: 786, top: 406, width: 412, height: 174, dark: true, fill: '#0c1a2d' });
  title(ctx, slide, 'Why this matters now', 814, 430, 280, 30, true, 24);
  body(ctx, slide, 'Tamil Nadu already produces strong governance signals, but they live in separate portals. TN-OSIRIS turns them into one command surface.', 814, 468, 344, 34, true, 13);
  body(ctx, slide, 'Built from the current application system:\n• Map-first district command view\n• Directional zone drilldown\n• Department heat and governance feeds\n• Flow-passport tracking across 12 modules', 814, 520, 340, 48, true, 12);

  footer(ctx, slide, 1, true);
  return slide;
}

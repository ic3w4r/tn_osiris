import { body, C, coverBg, footer, gridCell, kicker, panel, title } from './deck-helpers.mjs';

export async function slide10(presentation, ctx) {
  const slide = presentation.slides.add();
  coverBg(ctx, slide, true);

  kicker(ctx, slide, 'THE CLOSE', 72, 58, true);
  title(ctx, slide, 'TN-OSIRIS can become the operating system for transparent, measurable public-service delivery.', 72, 92, 780, 144, true, 38);
  body(ctx, slide, 'The system already demonstrates the product shape: statewide map, district command, department heat, and FlowRadar tracking. The next step is sponsorship, deployment, and deeper integration.', 72, 246, 760, 54, true, 17);

  gridCell(ctx, slide, { left: 72, top: 304, width: 332, height: 168, titleText: 'Back a pilot', bodyText: 'Choose a small set of districts and departments to move from narrative demo to live operating workflow.', accent: C.teal, dark: true });
  gridCell(ctx, slide, { left: 424, top: 304, width: 332, height: 168, titleText: 'Fund the integration layer', bodyText: 'The biggest unlock is moving from public-data orchestration to official departmental feeds and field updates.', accent: C.amber, dark: true });
  gridCell(ctx, slide, { left: 776, top: 304, width: 432, height: 168, titleText: 'Position it as a command layer', bodyText: 'This is strongest when framed as an operating and accountability platform, not just another dashboard procurement.', accent: C.rose, dark: true });

  panel(ctx, slide, { left: 72, top: 514, width: 1136, height: 120, dark: true, fill: '#0c1c31' });
  title(ctx, slide, 'Deployment ask', 98, 540, 180, 24, true, 22);
  body(ctx, slide, '1. Approve a district-led pilot scope.\n2. Define the first integration set.\n3. Stand up a PMU cadence around the command views.\n4. Expand into full FlowRadar after governance mode proves value.', 98, 578, 520, 56, true, 16);
  title(ctx, slide, 'End state', 734, 540, 140, 24, true, 22);
  body(ctx, slide, 'A Tamil Nadu governance grid where every district, department, and tracked public-service flow can be seen, compared, and acted on from one platform.', 734, 578, 396, 50, true, 16);

  footer(ctx, slide, 10, true);
  return slide;
}

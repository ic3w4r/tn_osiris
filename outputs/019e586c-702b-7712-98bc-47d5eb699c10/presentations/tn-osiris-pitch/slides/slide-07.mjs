import { body, C, coverBg, footer, gridCell, kicker, panel, title } from './deck-helpers.mjs';

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  coverBg(ctx, slide, false);

  kicker(ctx, slide, 'WHY IT WINS', 72, 54, false);
  title(ctx, slide, 'TN-OSIRIS links geography, accountability, and execution in one system.', 72, 82, 720, 58, false, 34);
  body(ctx, slide, 'Most public dashboards stop at reporting. TN-OSIRIS is differentiated because it keeps the map, the district view, the department channel, and the operating object in the same logic.', 72, 146, 760, 44, false, 17);

  panel(ctx, slide, { left: 72, top: 226, width: 1136, height: 394, dark: false, fill: '#ffffff' });
  gridCell(ctx, slide, { left: 94, top: 248, width: 206, height: 144, titleText: 'Map-first command', bodyText: 'Operators start from Tamil Nadu, not from a table. District and zone context comes first.', accent: C.teal, dark: false });
  gridCell(ctx, slide, { left: 318, top: 248, width: 206, height: 144, titleText: 'District bifurcation', bodyText: 'Each district breaks into directional zones and tab-level operating slices.', accent: C.amber, dark: false });
  gridCell(ctx, slide, { left: 542, top: 248, width: 206, height: 144, titleText: 'Department heat', bodyText: 'Governance feeds are grouped by source department, not buried as flat events.', accent: C.rose, dark: false });
  gridCell(ctx, slide, { left: 766, top: 248, width: 206, height: 144, titleText: 'Budget linkage', bodyText: 'Scheme, project, and utilization signals stay connected to risk and delivery.', accent: C.blue, dark: false });
  gridCell(ctx, slide, { left: 990, top: 248, width: 194, height: 144, titleText: 'Flow passports', bodyText: 'Objects become trackable journeys, not static status rows.', accent: C.teal, dark: false });

  title(ctx, slide, 'This is the difference between an information portal and an operating system.', 94, 430, 660, 30, false, 24);
  body(ctx, slide, 'Once the user can move from state → district → zone → department → tracked object, intervention becomes faster, more specific, and more defensible.', 94, 472, 620, 40, false, 16);

  gridCell(ctx, slide, { left: 784, top: 430, width: 186, height: 150, titleText: 'Without TN-OSIRIS', bodyText: 'Fragmented portals\nStatic reporting\nSlow correlation\nReactive escalation', accent: C.rose, dark: false });
  gridCell(ctx, slide, { left: 988, top: 430, width: 196, height: 150, titleText: 'With TN-OSIRIS', bodyText: 'Unified map\nDistrict command\nFlow tracking\nActionable escalation', accent: C.teal, dark: false });

  footer(ctx, slide, 7, false);
  return slide;
}

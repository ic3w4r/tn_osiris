import { body, C, coverBg, footer, gridCell, kicker, metricCard, title } from './deck-helpers.mjs';

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  coverBg(ctx, slide, false);

  kicker(ctx, slide, 'VALUE CREATION', 72, 54, false);
  title(ctx, slide, 'The platform creates operating value before it creates reporting value.', 72, 82, 720, 56, false, 34);
  body(ctx, slide, 'TN-OSIRIS matters because it helps teams intervene earlier, coordinate better, and understand whether resources are moving toward visible public outcomes.', 72, 144, 760, 42, false, 17);

  metricCard(ctx, slide, { left: 72, top: 226, width: 186, label: 'Districts covered', value: '38', tone: C.teal, dark: false });
  metricCard(ctx, slide, { left: 274, top: 226, width: 186, label: 'Tender exposure', value: '₹272 Cr', tone: C.rose, dark: false });
  metricCard(ctx, slide, { left: 476, top: 226, width: 186, label: 'Scheme delivery', value: '83%', tone: C.amber, dark: false });
  metricCard(ctx, slide, { left: 678, top: 226, width: 186, label: 'Budget utilization', value: '78%', tone: C.blue, dark: false });

  gridCell(ctx, slide, { left: 72, top: 348, width: 264, height: 136, titleText: 'Speed', bodyText: 'Earlier identification of high-risk districts, delayed projects, and complaint clusters shortens the time to escalation.', accent: C.teal, dark: false });
  gridCell(ctx, slide, { left: 356, top: 348, width: 264, height: 136, titleText: 'Visibility', bodyText: 'Budget, delivery, and field signals sit in one operating picture rather than disconnected portals.', accent: C.amber, dark: false });
  gridCell(ctx, slide, { left: 640, top: 348, width: 264, height: 136, titleText: 'Coordination', bodyText: 'District, department, and PMU teams can act from the same system narrative and ownership chain.', accent: C.rose, dark: false });
  gridCell(ctx, slide, { left: 924, top: 348, width: 284, height: 136, titleText: 'Accountability', bodyText: 'Risk is tied to a zone, a department, a flow stage, and a visible intervention path.', accent: C.blue, dark: false });

  title(ctx, slide, 'What success looks like', 72, 528, 280, 28, false, 24);
  body(ctx, slide, '• faster closure of grievance clusters\n• tighter tracking of delayed projects\n• clearer scheme utilization trails\n• more defensible disaster-preparedness escalation\n• cleaner state-to-district operating reviews', 72, 568, 550, 92, false, 16);
  body(ctx, slide, 'The commercial and institutional story is simple: if Tamil Nadu wants a measurable command layer for governance performance, this is the backbone to build on.', 734, 548, 430, 58, false, 17);

  footer(ctx, slide, 9, false);
  return slide;
}

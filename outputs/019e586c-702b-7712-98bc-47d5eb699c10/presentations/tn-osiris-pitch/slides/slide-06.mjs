import { C, coverBg, footer, gridCell, kicker, title, body } from './deck-helpers.mjs';

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  coverBg(ctx, slide, true);

  kicker(ctx, slide, 'WHO USES IT', 72, 54, true);
  title(ctx, slide, 'The same platform serves four very different operating rhythms.', 72, 82, 720, 56, true, 34);
  body(ctx, slide, 'TN-OSIRIS is valuable because it can anchor state, district, department, and emergency decision-making without rebuilding the system for each team.', 72, 144, 720, 44, true, 17);

  gridCell(ctx, slide, { left: 72, top: 228, width: 260, height: 196, titleText: 'District Collector', bodyText: 'See the district command view, enter North / South / East / West zones, compare backlog clusters, and intervene where projects, schemes, and complaints are misaligned.', accent: C.teal, dark: true });
  gridCell(ctx, slide, { left: 352, top: 228, width: 260, height: 196, titleText: 'Department Secretary', bodyText: 'Track department heat, scheme performance, budget utilization, and delayed assets across multiple districts from one operating layer.', accent: C.amber, dark: true });
  gridCell(ctx, slide, { left: 632, top: 228, width: 260, height: 196, titleText: 'Disaster & Field Response', bodyText: 'Combine weather alerts, public-asset readiness, material movement, shelter status, and grievance spikes before local failures widen.', accent: C.rose, dark: true });
  gridCell(ctx, slide, { left: 912, top: 228, width: 296, height: 196, titleText: 'Audit / PMU / Leadership', bodyText: 'Identify execution anomalies, department bottlenecks, tender risks, and physical-financial gaps without waiting for retrospective reports.', accent: C.blue, dark: true });

  title(ctx, slide, 'Every role gets the same truth, filtered to a different decision lens.', 72, 466, 620, 30, true, 24);
  body(ctx, slide, 'That shared operating picture is the real differentiator. The product is not just visualizing data; it is standardizing how problems are seen and escalated.', 72, 506, 640, 46, true, 16);

  gridCell(ctx, slide, { left: 744, top: 466, width: 200, height: 170, titleText: 'State lens', bodyText: 'Compare districts, rank heat, watch top bottlenecks.', accent: C.teal, dark: true });
  gridCell(ctx, slide, { left: 964, top: 466, width: 244, height: 170, titleText: 'Operational lens', bodyText: 'Track flow stages, responsible owners, and what is blocked now.', accent: C.amber, dark: true });

  footer(ctx, slide, 6, true);
  return slide;
}

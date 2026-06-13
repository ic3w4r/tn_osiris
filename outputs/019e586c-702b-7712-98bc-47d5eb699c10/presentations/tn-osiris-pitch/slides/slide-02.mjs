import { body, C, coverBg, footer, gridCell, hLine, kicker, title } from './deck-helpers.mjs';

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  coverBg(ctx, slide, false);

  kicker(ctx, slide, 'THE PROBLEM', 72, 56, false);
  title(ctx, slide, 'Governance signals exist, but they do not arrive in one operational picture.', 72, 82, 760, 60, false, 34);
  body(ctx, slide, 'Today, funds, grievances, tenders, projects, schemes, public assets, and disaster alerts sit across separate systems. That makes risk visible too late and action harder to coordinate.', 72, 150, 760, 54, false, 18);
  hLine(ctx, slide, 72, 222, 1136, false);

  gridCell(ctx, slide, { left: 72, top: 252, width: 168, height: 130, titleText: 'Schemes', bodyText: 'Announcement, release, and field delivery are rarely tracked in one place.', accent: C.teal, dark: false });
  gridCell(ctx, slide, { left: 256, top: 252, width: 168, height: 130, titleText: 'Grievances', bodyText: 'Heat clusters and closure quality remain hidden inside ticket systems.', accent: C.amber, dark: false });
  gridCell(ctx, slide, { left: 440, top: 252, width: 168, height: 130, titleText: 'Projects', bodyText: 'Completion claims are hard to test against citizen and field signals.', accent: C.rose, dark: false });
  gridCell(ctx, slide, { left: 624, top: 252, width: 168, height: 130, titleText: 'Budgets', bodyText: 'Allocation and utilization often sit far away from delivery outcomes.', accent: C.blue, dark: false });
  gridCell(ctx, slide, { left: 808, top: 252, width: 168, height: 130, titleText: 'Tenders', bodyText: 'Procurement anomalies and execution risk do not stay linked.', accent: C.rose, dark: false });
  gridCell(ctx, slide, { left: 992, top: 252, width: 168, height: 130, titleText: 'Disasters', bodyText: 'Preparedness, public assets, and local complaint signals are monitored separately.', accent: C.teal, dark: false });

  title(ctx, slide, 'The result is slow visibility, slower escalation, and weak district-level accountability.', 72, 424, 770, 46, false, 28);
  body(ctx, slide, 'Officials can usually see what happened inside one system, but not what is building across the entire district. By the time the pattern is obvious, the operating cost is already higher.', 72, 474, 650, 56, false, 16);

  gridCell(ctx, slide, { left: 784, top: 430, width: 176, height: 110, titleText: 'Late risk discovery', bodyText: 'Problems surface after delays, citizen pain, or media attention.', accent: C.rose, dark: false });
  gridCell(ctx, slide, { left: 976, top: 430, width: 184, height: 110, titleText: 'No common map', bodyText: 'Teams cannot compare district, department, and asset signals in one view.', accent: C.blue, dark: false });
  gridCell(ctx, slide, { left: 784, top: 554, width: 176, height: 110, titleText: 'Weak linkage', bodyText: 'Budget, delivery, and citizen outcome remain disconnected.', accent: C.amber, dark: false });
  gridCell(ctx, slide, { left: 976, top: 554, width: 184, height: 110, titleText: 'Reactive operations', bodyText: 'Escalation happens after backlogs and clusters are already visible on the ground.', accent: C.teal, dark: false });

  footer(ctx, slide, 2, false);
  return slide;
}

import { body, C, coverBg, footer, kicker, panel, title } from './deck-helpers.mjs';

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  coverBg(ctx, slide, false);

  kicker(ctx, slide, 'FLOWRADAR', 72, 54, false);
  title(ctx, slide, 'FlowRadar makes government operations trackable like flights.', 72, 82, 780, 84, false, 32);
  body(ctx, slide, 'Each object becomes a flow passport: origin, route, current stage, responsible owner, delay, risk, destination, and outcome.', 72, 162, 760, 42, false, 17);

  panel(ctx, slide, { left: 72, top: 226, width: 1136, height: 126, dark: false, fill: '#ffffff' });
  title(ctx, slide, 'Origin', 98, 270, 90, 22, false, 20);
  title(ctx, slide, 'Route', 304, 270, 90, 22, false, 20);
  title(ctx, slide, 'Current stage', 520, 266, 140, 24, false, 18);
  title(ctx, slide, 'Delay / risk', 774, 266, 120, 24, false, 18);
  title(ctx, slide, 'Outcome', 986, 266, 120, 24, false, 18);
  body(ctx, slide, 'Budget, citizen\nrequest, proposal,\ntender notice', 98, 304, 128, 34, false, 12);
  body(ctx, slide, 'Approval path,\nexecution path,\nservice path', 304, 304, 118, 38, false, 12);
  body(ctx, slide, 'File desk, field team,\nproject stage,\ndepot, district', 520, 304, 150, 38, false, 12);
  body(ctx, slide, 'SLA breach,\npending days,\ncritical flag', 774, 304, 128, 38, false, 12);
  body(ctx, slide, 'Completed,\ndelivered, verified,\nclosed, measured', 986, 304, 150, 38, false, 12);
  body(ctx, slide, '→', 238, 278, 28, 20, false, 20);
  body(ctx, slide, '→', 450, 278, 28, 20, false, 20);
  body(ctx, slide, '→', 706, 278, 28, 20, false, 20);
  body(ctx, slide, '→', 924, 278, 28, 20, false, 20);

  title(ctx, slide, '12 modules in one tracked operating system', 72, 382, 470, 32, false, 21);
  panel(ctx, slide, { left: 72, top: 426, width: 260, height: 84, dark: false, fill: '#ffffff' });
  panel(ctx, slide, { left: 350, top: 426, width: 260, height: 84, dark: false, fill: '#ffffff' });
  panel(ctx, slide, { left: 628, top: 426, width: 260, height: 84, dark: false, fill: '#ffffff' });
  panel(ctx, slide, { left: 906, top: 426, width: 302, height: 84, dark: false, fill: '#ffffff' });
  ctx.addShape(slide, { left: 88, top: 442, width: 28, height: 4, fill: C.teal });
  ctx.addShape(slide, { left: 366, top: 442, width: 28, height: 4, fill: C.rose });
  ctx.addShape(slide, { left: 644, top: 442, width: 28, height: 4, fill: C.amber });
  ctx.addShape(slide, { left: 922, top: 442, width: 28, height: 4, fill: C.blue });
  title(ctx, slide, 'Fund / File / Grievance', 88, 458, 212, 22, false, 16);
  title(ctx, slide, 'Tender / Project / Scheme', 366, 458, 212, 22, false, 16);
  title(ctx, slide, 'Certificate / Vehicle /\nMaterial', 644, 456, 212, 36, false, 14);
  title(ctx, slide, 'Disaster / Inspection /\nCitizen Impact', 922, 456, 254, 36, false, 14);
  body(ctx, slide, 'Budget release, approvals, and complaint journeys.', 88, 488, 218, 18, false, 12);
  body(ctx, slide, 'Procurement, execution, and welfare delivery tracking.', 366, 488, 218, 18, false, 12);
  body(ctx, slide, 'Service applications, field teams, and supply movement.', 644, 490, 218, 16, false, 11);
  body(ctx, slide, 'Response operations, rectification, and outcome verification.', 922, 490, 254, 16, false, 11);

  panel(ctx, slide, { left: 72, top: 542, width: 1136, height: 120, dark: false, fill: C.paperSoft });
  title(ctx, slide, 'Why this matters\noperationally', 94, 566, 260, 46, false, 18);
  body(ctx, slide, 'FlowRadar is what turns a governance dashboard into an operations platform. It shows where government objects are stuck, which department owns the bottleneck, and what the next intervention should be.', 94, 608, 728, 36, false, 14);
  body(ctx, slide, 'Instead of asking “what was announced?” the user can ask “what is moving, what is blocked, and what has actually arrived?”', 852, 590, 304, 52, false, 15);

  footer(ctx, slide, 5, false);
  return slide;
}

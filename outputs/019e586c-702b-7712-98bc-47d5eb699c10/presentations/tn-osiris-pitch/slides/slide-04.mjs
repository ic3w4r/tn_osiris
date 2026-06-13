import { body, C, coverBg, footer, kicker, metricCard, panel, title } from './deck-helpers.mjs';

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  coverBg(ctx, slide, true);

  kicker(ctx, slide, 'GOVERNANCE INTELLIGENCE', 72, 54, true);
  title(ctx, slide, 'Every district gets a live command view that ties map, risk, feed, and execution together.', 72, 80, 760, 92, true, 30);
  body(ctx, slide, 'The governance mode is designed for district collectors, departmental teams, policy analysts, and disaster managers who need one operational picture rather than separate portals.', 72, 176, 760, 50, true, 17);

  panel(ctx, slide, { left: 72, top: 224, width: 770, height: 402, dark: true, fill: '#0a1829' });
  panel(ctx, slide, { left: 92, top: 248, width: 184, height: 330, dark: true, fill: '#10253d' });
  title(ctx, slide, 'Monitoring\nlayers', 112, 268, 120, 54, true, 21);
  body(ctx, slide, 'District risk\nGrievance heat\nDelayed projects\nSchemes\nTender risk\nAssets\nDisaster watch', 112, 336, 120, 180, true, 16);

  panel(ctx, slide, { left: 294, top: 248, width: 330, height: 330, dark: true, fill: '#112a43' });
  title(ctx, slide, 'Tamil Nadu map', 318, 266, 180, 24, true, 22);
  body(ctx, slide, 'Map-first district and zone canvas', 318, 294, 200, 20, true, 12);
  ctx.addShape(slide, { left: 372, top: 334, width: 98, height: 150, geometry: 'ellipse', fill: '#193858', line: ctx.line(C.white18, 1) });
  ctx.addText(slide, { text: 'TN', left: 405, top: 390, width: 36, height: 28, fontSize: 28, bold: true, color: C.text });
  ctx.addShape(slide, { left: 514, top: 354, width: 18, height: 18, geometry: 'ellipse', fill: C.rose });
  ctx.addShape(slide, { left: 495, top: 398, width: 18, height: 18, geometry: 'ellipse', fill: C.amber });
  ctx.addShape(slide, { left: 458, top: 426, width: 18, height: 18, geometry: 'ellipse', fill: C.teal });
  ctx.addShape(slide, { left: 442, top: 378, width: 70, height: 1.5, fill: '#ffffff55' });
  ctx.addShape(slide, { left: 442, top: 422, width: 52, height: 1.5, fill: '#ffffff55' });
  body(ctx, slide, 'Directional district zones\nConnected grievances, projects,\nschemes, assets, and alerts', 318, 504, 240, 60, true, 14);

  panel(ctx, slide, { left: 642, top: 248, width: 176, height: 330, dark: true, fill: '#10253d' });
  title(ctx, slide, 'District\ncommand view', 664, 266, 120, 68, true, 18);
  body(ctx, slide, 'Top district risk\nZone split\nTab-level bifurcation\nDepartment channels\nBudget and scheme detail', 664, 350, 112, 136, true, 15);
  body(ctx, slide, 'Example district:\nCuddalore / Trichy /\nChennai / Salem', 664, 504, 110, 54, true, 13);

  metricCard(ctx, slide, { left: 880, top: 234, width: 160, label: 'Pending grievances', value: '2,558', tone: C.amber });
  metricCard(ctx, slide, { left: 1052, top: 234, width: 156, label: 'Delayed projects', value: '21', tone: C.rose });
  metricCard(ctx, slide, { left: 880, top: 328, width: 160, label: 'Scheme delivery', value: '83%', tone: C.teal });
  metricCard(ctx, slide, { left: 1052, top: 328, width: 156, label: 'Budget utilization', value: '78%', tone: C.blue });

  panel(ctx, slide, { left: 880, top: 430, width: 328, height: 196, dark: true, fill: C.panel2 });
  title(ctx, slide, 'What the operator sees', 906, 456, 220, 30, true, 18);
  body(ctx, slide, '• which districts are heating up\n• which zones need intervention\n• which department owns the issue\n• whether budgets, tenders, and delivery are aligned\n• how risk looks on a Tamil Nadu map', 906, 506, 256, 96, true, 14);

  footer(ctx, slide, 4, true);
  return slide;
}

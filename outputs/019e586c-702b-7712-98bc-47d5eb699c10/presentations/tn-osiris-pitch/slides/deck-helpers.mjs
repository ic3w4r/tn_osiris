export const C = {
  ink: '#06111e',
  ink2: '#0d1b2c',
  panel: '#10253d',
  panel2: '#142d49',
  paper: '#f4efe6',
  paperSoft: '#ece4d7',
  paperLine: '#d5c9b6',
  text: '#f3f7fb',
  textMuted: '#93a8c0',
  darkText: '#0f1f33',
  darkMuted: '#5c6c7d',
  teal: '#27d3c3',
  tealSoft: '#183d46',
  amber: '#f0c955',
  amberSoft: '#4b4320',
  rose: '#ff6e7c',
  roseSoft: '#4c2430',
  blue: '#72a8ff',
  blueSoft: '#1a3556',
  white10: '#ffffff1a',
  white18: '#ffffff2e',
};

export function coverBg(ctx, slide, dark = true) {
  ctx.addShape(slide, {
    left: 0,
    top: 0,
    width: ctx.W,
    height: ctx.H,
    fill: dark ? C.ink : C.paper,
  });
  ctx.addShape(slide, {
    left: 36,
    top: 32,
    width: ctx.W - 72,
    height: ctx.H - 64,
    fill: '#00000000',
    line: ctx.line(dark ? C.white10 : C.paperLine, 1.2),
  });
}

export function kicker(ctx, slide, text, x, y, dark = true) {
  ctx.addText(slide, {
    text,
    left: x,
    top: y,
    width: 220,
    height: 22,
    fontSize: 12,
    color: dark ? C.teal : C.blueSoft,
    face: ctx.fonts.mono,
  });
}

export function title(ctx, slide, text, x, y, w, h, dark = true, size = 34) {
  ctx.addText(slide, {
    text,
    left: x,
    top: y,
    width: w,
    height: h,
    fontSize: size,
    bold: true,
    color: dark ? C.text : C.darkText,
    face: ctx.fonts.title,
  });
}

export function body(ctx, slide, text, x, y, w, h, dark = true, size = 18) {
  ctx.addText(slide, {
    text,
    left: x,
    top: y,
    width: w,
    height: h,
    fontSize: size,
    color: dark ? C.textMuted : C.darkMuted,
    face: ctx.fonts.body,
  });
}

export function footer(ctx, slide, page, dark = true) {
  ctx.addText(slide, {
    text: `TN-OSIRIS  /  ${String(page).padStart(2, '0')}`,
    left: ctx.W - 190,
    top: ctx.H - 38,
    width: 150,
    height: 18,
    fontSize: 10,
    color: dark ? C.textMuted : C.darkMuted,
    face: ctx.fonts.mono,
    align: 'right',
  });
}

export function panel(ctx, slide, opts) {
  const {
    left,
    top,
    width,
    height,
    dark = true,
    fill,
    line,
  } = opts;
  ctx.addShape(slide, {
    left,
    top,
    width,
    height,
    fill: fill ?? (dark ? C.panel : '#ffffff'),
    line: line ?? ctx.line(dark ? C.white10 : C.paperLine, 1),
  });
}

export function metricCard(ctx, slide, opts) {
  const { left, top, width, value, label, tone = C.teal, dark = true } = opts;
  panel(ctx, slide, {
    left,
    top,
    width,
    height: 82,
    dark,
    fill: dark ? C.panel : '#ffffff',
  });
  ctx.addText(slide, {
    text: label.toUpperCase(),
    left: left + 18,
    top: top + 16,
    width: width - 36,
    height: 16,
    fontSize: 10,
    color: dark ? C.textMuted : C.darkMuted,
    face: ctx.fonts.mono,
  });
  ctx.addText(slide, {
    text: value,
    left: left + 18,
    top: top + 34,
    width: width - 36,
    height: 30,
    fontSize: 24,
    bold: true,
    color: dark ? C.text : C.darkText,
    face: ctx.fonts.title,
  });
  ctx.addShape(slide, {
    left: left + width - 28,
    top: top + 18,
    width: 8,
    height: 8,
    geometry: 'ellipse',
    fill: tone,
  });
}

export function miniPill(ctx, slide, opts) {
  const { text, left, top, width = 110, dark = true, tone = C.teal } = opts;
  panel(ctx, slide, {
    left,
    top,
    width,
    height: 28,
    dark,
    fill: dark ? '#11263f' : '#ffffff',
    line: ctx.line(dark ? C.white10 : C.paperLine, 1),
  });
  ctx.addText(slide, {
    text,
    left: left + 12,
    top: top + 6,
    width: width - 24,
    height: 16,
    fontSize: 10,
    color: tone,
    face: ctx.fonts.mono,
    align: 'center',
  });
}

export function bulletList(ctx, slide, items, x, y, w, dark = true, size = 16, gap = 34) {
  items.forEach((item, index) => {
    ctx.addShape(slide, {
      left: x,
      top: y + index * gap + 6,
      width: 6,
      height: 6,
      geometry: 'ellipse',
      fill: dark ? C.teal : C.blue,
    });
    ctx.addText(slide, {
      text: item,
      left: x + 14,
      top: y + index * gap,
      width: w - 14,
      height: 24,
      fontSize: size,
      color: dark ? C.textMuted : C.darkMuted,
    });
  });
}

export function gridCell(ctx, slide, opts) {
  const { left, top, width, height, titleText, bodyText, accent = C.teal, dark = true } = opts;
  panel(ctx, slide, { left, top, width, height, dark, fill: dark ? C.panel : '#ffffff' });
  ctx.addShape(slide, { left: left + 16, top: top + 16, width: 28, height: 4, fill: accent });
  ctx.addText(slide, {
    text: titleText,
    left: left + 16,
    top: top + 28,
    width: width - 32,
    height: 24,
    fontSize: 18,
    bold: true,
    color: dark ? C.text : C.darkText,
  });
  ctx.addText(slide, {
    text: bodyText,
    left: left + 16,
    top: top + 58,
    width: width - 32,
    height: height - 72,
    fontSize: 14,
    color: dark ? C.textMuted : C.darkMuted,
  });
}

export function hLine(ctx, slide, left, top, width, dark = true) {
  ctx.addShape(slide, {
    left,
    top,
    width,
    height: 1.5,
    fill: dark ? C.white10 : C.paperLine,
  });
}

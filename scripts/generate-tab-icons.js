const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const OUT = path.join(__dirname, "..", "assets");

const icons = [
  { name: "tab-home", selected: false, type: "home" },
  { name: "tab-home-on", selected: true, type: "home" },
  { name: "tab-plaza", selected: false, type: "plaza" },
  { name: "tab-plaza-on", selected: true, type: "plaza" },
  { name: "tab-gallery", selected: false, type: "gallery" },
  { name: "tab-gallery-on", selected: true, type: "gallery" }
];

for (const icon of icons) {
  const canvas = createCanvas(96, 96);
  drawIcon(canvas, icon);
  fs.writeFileSync(path.join(OUT, `${icon.name}.png`), encodePng(canvas));
}

function drawIcon(canvas, icon) {
  const grey = [141, 149, 178, 255];
  const pale = [221, 226, 255, 255];
  const blue = [94, 107, 209, 255];
  const teal = [126, 216, 213, 255];
  const gold = [243, 201, 95, 255];
  const white = [255, 255, 255, 255];
  const line = icon.selected ? blue : grey;
  const accent = icon.selected ? gold : [182, 188, 224, 255];

  if (icon.selected) {
    circle(canvas, 48, 48, 40, [255, 243, 168, 80]);
  }

  if (icon.type === "home") {
    circle(canvas, 48, 50, 30, icon.selected ? [126, 216, 213, 255] : pale);
    lineSeg(canvas, 22, 57, 75, 49, 5, icon.selected ? white : grey);
    polygon(canvas, [[29, 50], [48, 34], [67, 50], [67, 70], [29, 70]], white);
    polyline(canvas, [[29, 50], [48, 34], [67, 50], [67, 70], [29, 70], [29, 50]], 5, line);
    star(canvas, 73, 22, 18, 8, accent);
  }

  if (icon.type === "plaza") {
    roundRect(canvas, 21, 26, 44, 54, 10, white);
    strokeRoundRect(canvas, 21, 26, 44, 54, 10, 5, line);
    roundRect(canvas, 34, 16, 40, 50, 10, icon.selected ? [223, 248, 244, 255] : pale);
    strokeRoundRect(canvas, 34, 16, 40, 50, 10, 5, icon.selected ? teal : line);
    star(canvas, 56, 35, 14, 6, accent);
    lineSeg(canvas, 31, 64, 55, 64, 5, icon.selected ? teal : [182, 188, 224, 255]);
  }

  if (icon.type === "gallery") {
    polygon(canvas, [[18, 27], [30, 22], [40, 23], [48, 29], [56, 23], [68, 22], [78, 27], [78, 75], [66, 70], [56, 71], [48, 77], [40, 71], [30, 70], [18, 75]], white);
    polyline(canvas, [[18, 27], [30, 22], [40, 23], [48, 29], [56, 23], [68, 22], [78, 27], [78, 75], [66, 70], [56, 71], [48, 77], [40, 71], [30, 70], [18, 75], [18, 27]], 5, line);
    lineSeg(canvas, 48, 30, 48, 76, 5, icon.selected ? teal : [182, 188, 224, 255]);
    star(canvas, 31, 50, 16, 7, accent);
    star(canvas, 65, 47, 12, 5, icon.selected ? teal : [182, 188, 224, 255]);
  }
}

function createCanvas(width, height) {
  return { width, height, pixels: new Uint8Array(width * height * 4) };
}

function setPixel(canvas, x, y, color) {
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
  const i = (y * canvas.width + x) * 4;
  const alpha = color[3] / 255;
  const inv = 1 - alpha;
  canvas.pixels[i] = Math.round(color[0] * alpha + canvas.pixels[i] * inv);
  canvas.pixels[i + 1] = Math.round(color[1] * alpha + canvas.pixels[i + 1] * inv);
  canvas.pixels[i + 2] = Math.round(color[2] * alpha + canvas.pixels[i + 2] * inv);
  canvas.pixels[i + 3] = Math.min(255, Math.round(color[3] + canvas.pixels[i + 3] * inv));
}

function circle(canvas, cx, cy, r, color) {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y += 1) {
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x += 1) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r ** 2) setPixel(canvas, x, y, color);
    }
  }
}

function roundRect(canvas, x, y, w, h, r, color) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      const dx = Math.max(x + r - xx, 0, xx - (x + w - r));
      const dy = Math.max(y + r - yy, 0, yy - (y + h - r));
      if (dx * dx + dy * dy <= r * r) setPixel(canvas, xx, yy, color);
    }
  }
}

function strokeRoundRect(canvas, x, y, w, h, r, width, color) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      const outer = inRoundRect(xx, yy, x, y, w, h, r);
      const inner = inRoundRect(xx, yy, x + width, y + width, w - width * 2, h - width * 2, Math.max(1, r - width));
      if (outer && !inner) setPixel(canvas, xx, yy, color);
    }
  }
}

function inRoundRect(xx, yy, x, y, w, h, r) {
  const dx = Math.max(x + r - xx, 0, xx - (x + w - r));
  const dy = Math.max(y + r - yy, 0, yy - (y + h - r));
  return dx * dx + dy * dy <= r * r;
}

function lineSeg(canvas, x1, y1, x2, y2, width, color) {
  const minX = Math.floor(Math.min(x1, x2) - width);
  const maxX = Math.ceil(Math.max(x1, x2) + width);
  const minY = Math.floor(Math.min(y1, y2) - width);
  const maxY = Math.ceil(Math.max(y1, y2) + width);
  const len2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const t = Math.max(0, Math.min(1, ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / len2));
      const px = x1 + t * (x2 - x1);
      const py = y1 + t * (y2 - y1);
      if ((x - px) ** 2 + (y - py) ** 2 <= (width / 2) ** 2) setPixel(canvas, x, y, color);
    }
  }
}

function polyline(canvas, points, width, color) {
  for (let i = 0; i < points.length - 1; i += 1) {
    lineSeg(canvas, points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], width, color);
  }
}

function polygon(canvas, points, color) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  for (let y = Math.min(...ys); y <= Math.max(...ys); y += 1) {
    for (let x = Math.min(...xs); x <= Math.max(...xs); x += 1) {
      if (insidePolygon(x, y, points)) setPixel(canvas, x, y, color);
    }
  }
}

function star(canvas, cx, cy, outer, inner, color) {
  const points = [];
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const r = i % 2 === 0 ? outer : inner;
    points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }
  polygon(canvas, points, color);
}

function insidePolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const xi = points[i][0];
    const yi = points[i][1];
    const xj = points[j][0];
    const yj = points[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function encodePng(canvas) {
  const rows = Buffer.alloc((canvas.width * 4 + 1) * canvas.height);
  for (let y = 0; y < canvas.height; y += 1) {
    rows[y * (canvas.width * 4 + 1)] = 0;
    for (let x = 0; x < canvas.width * 4; x += 1) {
      rows[y * (canvas.width * 4 + 1) + 1 + x] = canvas.pixels[y * canvas.width * 4 + x];
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr(canvas.width, canvas.height)),
    chunk("IDAT", zlib.deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function ihdr(width, height) {
  const buf = Buffer.alloc(13);
  buf.writeUInt32BE(width, 0);
  buf.writeUInt32BE(height, 4);
  buf[8] = 8;
  buf[9] = 6;
  return buf;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

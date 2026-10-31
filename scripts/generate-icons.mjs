import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crcBuf]);
}

function generateIconPNG(size) {
  const width = size;
  const height = size;
  const rows = [];

  const center = size / 2;
  const radius = size * 0.46;
  const cornerR = size * 0.22;

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;

      // 判斷圓角矩形邊界 (SDF)
      const dx = Math.max(0, Math.abs(x - center) - (center - cornerR));
      const dy = Math.max(0, Math.abs(y - center) - (center - cornerR));
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > cornerR) {
        // 透明背景
        row[idx] = 0;
        row[idx + 1] = 0;
        row[idx + 2] = 0;
        row[idx + 3] = 0;
        continue;
      }

      // 底色漸層：左上深海藍 (0x1e3a8a) -> 右下翡翠綠 (0x059669)
      const t = (x + y) / (width + height);
      let r = Math.round(30 + t * (5 - 30));
      let g = Math.round(58 + t * (150 - 58));
      let b = Math.round(138 + t * (105 - 138));

      // 金黃色邊框 (寬度 4% size)
      const borderThick = size * 0.045;
      if (dist > cornerR - borderThick || (x < borderThick || x > width - borderThick || y < borderThick || y > height - borderThick)) {
        r = 250; g = 204; b = 21; // #facc15
      }

      // 中心對角分割線與圖示
      const relX = (x - center) / (size * 0.5);
      const relY = (y - center) / (size * 0.5);
      const dCenter = Math.sqrt(relX * relX + relY * relY);

      // 左側白棒球圓 (棒球版)
      const bbX = relX + 0.35;
      const bbY = relY;
      const bbDist = Math.sqrt(bbX * bbX + bbY * bbY);
      if (bbDist < 0.42) {
        r = 254; g = 243; b = 199; // 米白
        // 棒球紅色縫線
        const seamL = Math.abs(bbDist - 0.28);
        if (seamL < 0.04 && Math.abs(bbY) < 0.3) {
          r = 239; g = 68; b = 68; // 紅線
        }
      }

      // 右側綠寶石/方塊 (麥塊版)
      const mcX = relX - 0.35;
      const mcY = relY;
      if (Math.abs(mcX) < 0.32 && Math.abs(mcY) < 0.32) {
        const isCore = Math.abs(mcX) < 0.22 && Math.abs(mcY) < 0.22;
        r = isCore ? 56 : 16;
        g = isCore ? 189 : 185;
        b = isCore ? 248 : 129; // 鑽石藍青色 (0x38bdf8 / 0x10b981)
      }

      row[idx] = r;
      row[idx + 1] = g;
      row[idx + 2] = b;
      row[idx + 3] = 255;
    }
    rows.push(row);
  }

  const rawScanlines = Buffer.concat(rows);
  const compressed = zlib.deflateSync(rawScanlines, { level: 9 });

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  return Buffer.concat([
    sig,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', Buffer.alloc(0))
  ]);
}

const iconsDir = path.resolve('icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const png192 = generateIconPNG(192);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);
console.log('✅ Generated icons/icon-192.png (' + png192.length + ' bytes)');

const png512 = generateIconPNG(512);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);
console.log('✅ Generated icons/icon-512.png (' + png512.length + ' bytes)');

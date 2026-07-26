import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const assetsDir = path.join(process.cwd(), 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Helper to calculate CRC32 for PNG chunks
function crc32(buf) {
  let c = 0xffffffff;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let curr = n;
    for (let k = 0; k < 8; k++) {
      curr = curr & 1 ? 0xedb88320 ^ (curr >>> 1) : curr >>> 1;
    }
    table[n] = curr;
  }
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crcBuf]);
}

// Generates a 256x256 RGBA PNG buffer given a pixel drawer function (x, y) => [r, g, b, a]
function createPng(width, height, pixelFn) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type 6 (RGBA)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw pixel data with filter byte (0) before each scanline
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // No filter
    for (let x = 0; x < width; x++) {
      const [r, g, b, a = 255] = pixelFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Color palette definitions and pixel generators
const assetsToGenerate = [
  // Countries
  {
    name: 'nigeria.png',
    fn: (x, y, w, h) => {
      // Green White Green vertical stripes
      if (x < w / 3 || x >= (2 * w) / 3) return [0, 135, 81];
      return [255, 255, 255];
    }
  },
  {
    name: 'usa.png',
    fn: (x, y, w, h) => {
      // Blue canton top left, red/white stripes
      if (x < w * 0.45 && y < h * 0.5) return [60, 59, 110];
      const stripe = Math.floor(y / (h / 7));
      return stripe % 2 === 0 ? [178, 34, 52] : [255, 255, 255];
    }
  },
  {
    name: 'uk.png',
    fn: (x, y, w, h) => {
      // Union Jack style blue bg with red & white cross
      const cx = w / 2, cy = h / 2;
      if (Math.abs(x - cx) < 18 || Math.abs(y - cy) < 18) return [200, 16, 46];
      if (Math.abs(x - cx) < 28 || Math.abs(y - cy) < 28) return [255, 255, 255];
      if (Math.abs(x - y) < 12 || Math.abs(x + y - w) < 12) return [200, 16, 46];
      if (Math.abs(x - y) < 20 || Math.abs(x + y - w) < 20) return [255, 255, 255];
      return [1, 33, 105];
    }
  },
  {
    name: 'southafrica.png',
    fn: (x, y, w, h) => {
      // Green V with Red top, Blue bottom, Black triangle
      if (x < y && x < h - y) return [0, 0, 0]; // black triangle
      if (y < h / 2 - 12) return [222, 56, 49]; // red top
      if (y > h / 2 + 12) return [0, 35, 149]; // blue bottom
      return [0, 122, 77]; // green middle
    }
  },

  // Services
  {
    name: 'gcash.png',
    fn: (x, y, w, h) => {
      // GCash bright blue background with white circular emblem
      const dx = x - w/2, dy = y - h/2;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 60 && dist > 35) return [255, 255, 255];
      return [0, 122, 255];
    }
  },
  {
    name: 'cashapp.png',
    fn: (x, y, w, h) => {
      // Cash App vibrant green background
      const dx = Math.abs(x - w/2), dy = Math.abs(y - h/2);
      if ((dx < 12 && dy < 60) || (dy < 12 && dx < 40)) return [255, 255, 255];
      return [0, 214, 79];
    }
  },
  {
    name: 'paypal.png',
    fn: (x, y, w, h) => {
      // PayPal dark blue/light blue gradient effect
      if (x > w/3 && x < (2*w)/3 && y > h/4 && y < (3*h)/4) return [0, 121, 193];
      return [0, 48, 135];
    }
  },
  {
    name: 'wallets.png',
    fn: (x, y, w, h) => {
      // Crypto wallets purple background with gold emblem
      const dx = x - w/2, dy = y - h/2;
      if (Math.abs(dx) + Math.abs(dy) < 55) return [247, 147, 26]; // gold diamond
      return [112, 52, 235]; // purple
    }
  },

  // Banks
  {
    name: 'access.png',
    fn: (x, y, w, h) => {
      // Access Bank orange chevron & navy background
      if (y > x - 20 && y < x + 20) return [243, 112, 33];
      return [10, 25, 47];
    }
  },
  {
    name: 'gtbank.png',
    fn: (x, y, w, h) => {
      // GTBank iconic orange with white square
      if (x > w/3 && x < (2*w)/3 && y > h/3 && y < (2*h)/3) return [255, 255, 255];
      return [221, 74, 21];
    }
  },
  {
    name: 'uba.png',
    fn: (x, y, w, h) => {
      // UBA vibrant red background with white letter accent
      if (x > w/4 && x < (3*w)/4 && y > h/3 && y < (2*h)/3) return [255, 255, 255];
      return [211, 17, 27];
    }
  },
  {
    name: 'zenith.png',
    fn: (x, y, w, h) => {
      // Zenith Bank white bg with bold red Z stripe
      if (Math.abs(x + y - w) < 25 && x > 40 && x < w - 40) return [227, 24, 55];
      return [248, 249, 250];
    }
  },
  {
    name: 'firstbank.png',
    fn: (x, y, w, h) => {
      // FirstBank navy blue & gold elephant brand
      if (x > w/3 && x < (2*w)/3 && y > h/3 && y < (2*h)/3) return [212, 175, 55]; // Gold
      return [0, 32, 91]; // Navy
    }
  },
  {
    name: 'fidelity.png',
    fn: (x, y, w, h) => {
      // Fidelity Bank green & navy blue split
      if (x < w/2) return [0, 142, 68];
      return [0, 51, 102];
    }
  },
  {
    name: 'stanbic.png',
    fn: (x, y, w, h) => {
      // Stanbic IBTC cobalt blue bg with white shield accent
      const dx = x - w/2, dy = y - h/2;
      if (dx*dx + dy*dy < 2500) return [255, 255, 255];
      return [0, 51, 161];
    }
  },
  {
    name: 'opay.png',
    fn: (x, y, w, h) => {
      // OPay bright green ring with blue accent
      const dx = x - w/2, dy = y - h/2;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 60 && dist > 30) return [16, 185, 129];
      return [15, 23, 42];
    }
  },
  {
    name: 'palmpay.png',
    fn: (x, y, w, h) => {
      // PalmPay deep purple with yellow emblem
      const dx = x - w/2, dy = y - h/2;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 50) return [253, 224, 71];
      return [109, 40, 217];
    }
  },
  {
    name: 'moniepoint.png',
    fn: (x, y, w, h) => {
      // Moniepoint dark blue with yellow symbol
      const dx = x - w/2, dy = y - h/2;
      if (Math.abs(dx) + Math.abs(dy) < 45) return [245, 158, 11];
      return [30, 58, 138];
    }
  },
  {
    name: 'kuda.png',
    fn: (x, y, w, h) => {
      // Kuda Bank signature rich purple with white K accent
      if (x > w/3 && x < (2*w)/3 && y > h/4 && y < (3*h)/4) return [255, 255, 255];
      return [64, 25, 130];
    }
  }
];

console.log('Generating PNG assets...');
for (const item of assetsToGenerate) {
  const filePath = path.join(assetsDir, item.name);
  const buf = createPng(128, 128, item.fn);
  fs.writeFileSync(filePath, buf);
  console.log(`Generated: ${item.name} (${buf.length} bytes)`);
}
console.log('All assets generated successfully!');

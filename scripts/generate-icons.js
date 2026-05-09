// Generates minimal PNG icons using only Node.js built-ins (no dependencies)
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([lenBuf, typeBuffer, data, crcBuf]);
}

function createSolidPNG(size, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  // compression, filter, interlace = 0

  const rowSize = 1 + size * 3;
  const raw = Buffer.alloc(size * rowSize);
  for (let y = 0; y < size; y++) {
    const offset = y * rowSize;
    raw[offset] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      raw[offset + 1 + x * 3] = r;
      raw[offset + 1 + x * 3 + 1] = g;
      raw[offset + 1 + x * 3 + 2] = b;
    }
  }

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', zlib.deflateSync(raw));
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const iconsDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);

// #b85c38 = RGB(184, 92, 56)
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createSolidPNG(192, 184, 92, 56));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createSolidPNG(512, 184, 92, 56));

console.log('✓ icons/icon-192.png');
console.log('✓ icons/icon-512.png');

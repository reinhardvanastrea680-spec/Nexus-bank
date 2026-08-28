/**
 * Generates PWA PNG icons using pure Node.js (no canvas dependency)
 * Creates proper PNG files with the Nexus Bank "N" logo
 * Run: node generate-icons.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(__dirname, "public/icons"), { recursive: true });

// Minimal PNG encoder
function createPNG(size) {
  const width = size, height = size;

  // Create pixel data (RGBA)
  const pixels = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const cx = x - width / 2, cy = y - height / 2;
      const r = size * 0.47;

      // Rounded rect mask
      const rx = size * 0.2, inRect =
        Math.abs(cx) <= width / 2 - rx && Math.abs(cy) <= height / 2 - rx ||
        Math.abs(cx) <= width / 2 - rx && Math.abs(cy) <= height / 2 ||
        Math.abs(cx) <= width / 2 && Math.abs(cy) <= height / 2 - rx ||
        (Math.abs(cx) - (width / 2 - rx)) ** 2 + (Math.abs(cy) - (height / 2 - rx)) ** 2 <= rx * rx;

      if (!inRect) {
        pixels[idx + 3] = 0; // transparent
        continue;
      }

      // Gradient: top-left #1D4ED8 → bottom-right #0EA5E9
      const t = (x + y) / (width + height);
      pixels[idx]     = Math.round(0x1D + (0x0E - 0x1D) * t); // R
      pixels[idx + 1] = Math.round(0x4E + (0xA5 - 0x4E) * t); // G
      pixels[idx + 2] = Math.round(0xD8 + (0xE9 - 0xD8) * t); // B
      pixels[idx + 3] = 255;

      // Draw "N" letter
      const lx = cx / (size * 0.5), ly = cy / (size * 0.5);
      const stroke = 0.12;
      const inN =
        (lx >= -0.28 && lx <= -0.28 + stroke) || // left vertical
        (lx >= 0.28 - stroke && lx <= 0.28) ||   // right vertical
        (lx >= -0.28 && lx <= 0.28 &&             // diagonal
          Math.abs(ly - (-lx * 0.85 + 0.02)) <= stroke * 0.7);

      if (inN && Math.abs(lx) <= 0.28 && Math.abs(ly) <= 0.62) {
        pixels[idx]     = 255;
        pixels[idx + 1] = 255;
        pixels[idx + 2] = 255;
      }
    }
  }

  return encodePNG(width, height, pixels);
}

function encodePNG(width, height, pixels) {
  const { adler32, crc32, deflate } = pngUtils();

  // PNG signature
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const ihdrChunk = chunk("IHDR", ihdr);

  // IDAT — filter + compress
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0; // no filter
    pixels.copy
      ? pixels.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4)
      : Buffer.from(pixels).copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = zlibDeflate(raw);
  const idatChunk = chunk("IDAT", compressed);

  // IEND
  const iendChunk = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);

  function chunk(type, data) {
    const typeBuf = Buffer.from(type, "ascii");
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const crcVal = Buffer.alloc(4);
    crcVal.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcVal]);
  }
}

function pngUtils() {
  const CRC_TABLE = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    CRC_TABLE[i] = c;
  }
  const crc32 = (buf) => {
    let c = 0xFFFFFFFF;
    for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  };
  return { crc32 };
}

// Simple zlib DEFLATE using Node's built-in zlib
import { deflateSync } from "zlib";
function zlibDeflate(buf) { return deflateSync(buf, { level: 6 }); }

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
for (const size of sizes) {
  const png = createPNG(size);
  writeFileSync(join(__dirname, `public/icons/icon-${size}.png`), png);
  console.log(`✓ icon-${size}.png (${png.length} bytes)`);
}
console.log("All icons generated!");

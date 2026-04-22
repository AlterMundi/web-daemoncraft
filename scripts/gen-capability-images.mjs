#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'img', 'capabilities');

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error('Falta GEMINI_API_KEY. Ejecutá: node --env-file=.env scripts/gen-capability-images.mjs');
  process.exit(1);
}

const MODEL = 'gemini-2.5-flash-image';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

const STYLE = [
  'Isometric voxel-art scene in authentic Minecraft blocky style',
  'square 1:1 composition, centered subject, soft warm cinematic lighting',
  'consistent palette: cream background (#F5E6C8), grass green, earth tones, soft blues',
  'two Minecraft player characters: one is Steve (classic blue shirt, brown hair, cyan pants), the other is Hermes (an AI companion with gold/bronze trim, a small glowing hermes/caduceus emblem on chest, warm amber accents)',
  'clean edges, no text, no UI, no watermark, no logos',
  'slight pixel aliasing, chunky voxel forms, subtle ambient occlusion',
].join(', ');

const scenes = [
  {
    id: 'mine',
    prompt: `${STYLE}. Scene: Steve and Hermes mining together inside a torch-lit cave, swinging iron pickaxes at a wall of stone and coal ore blocks, small sparks flying, a minecart with coal nearby, soft orange torchlight glow.`,
  },
  {
    id: 'build',
    prompt: `${STYLE}. Scene: Steve and Hermes co-building a medieval castle on a grassy hill, a floating stone block being placed by Hermes, stacks of cobblestone and oak planks beside them, half-finished tower with wooden scaffolding, blue sky with pixel clouds.`,
  },
  {
    id: 'chat',
    prompt: `${STYLE}. Scene: Steve and Hermes standing face to face on a green grass plain near a small oak tree, two pixel-art speech bubbles floating above them (empty, no text, just rounded white chat-bubble shapes with tails), friendly pose, warm sunset light.`,
  },
  {
    id: 'fight',
    prompt: `${STYLE}. Scene: Steve and Hermes back-to-back at night fighting a zombie and a skeleton, Steve with diamond sword raised, Hermes drawing a bow with a glowing arrow, moonlit forest, torches on the ground, tense action pose.`,
  },
  {
    id: 'quest',
    prompt: `${STYLE}. Scene: an open glowing storybook floating over a grass field, epic fantasy structures emerging from its pages (a purple end portal, a dragon silhouette, a small dungeon tower), Steve and Hermes looking up in wonder, magical golden particles.`,
  },
  {
    id: 'memory',
    prompt: `${STYLE}. Scene: Hermes standing inside a cozy pixel library with oak bookshelves, floating memory items orbiting around him (a diamond, a red flower, a rolled map, a music disc, a crafting table icon) connected by thin golden light threads, warm lantern light, Steve visible in the doorway.`,
  },
];

mkdirSync(OUT_DIR, { recursive: true });

async function generate(scene) {
  const body = {
    contents: [{ role: 'user', parts: [{ text: scene.prompt }] }],
    generationConfig: { responseModalities: ['IMAGE'] },
  };

  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }

  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inlineData?.data);
  if (!imgPart) {
    throw new Error(`Sin imagen en respuesta: ${JSON.stringify(json).slice(0, 400)}`);
  }

  const mime = imgPart.inlineData.mimeType || 'image/png';
  const ext = mime.includes('jpeg') ? 'jpg' : mime.includes('webp') ? 'webp' : 'png';
  const buf = Buffer.from(imgPart.inlineData.data, 'base64');
  const outPath = join(OUT_DIR, `${scene.id}.${ext}`);
  writeFileSync(outPath, buf);
  return outPath;
}

const only = process.argv.slice(2);
const todo = only.length ? scenes.filter((s) => only.includes(s.id)) : scenes;

console.log(`Generando ${todo.length} imágenes → ${OUT_DIR}`);
for (const scene of todo) {
  process.stdout.write(`  ${scene.id} ... `);
  try {
    const path = await generate(scene);
    console.log(`✓ ${path.split('/').slice(-3).join('/')}`);
  } catch (e) {
    console.log(`✗ ${e.message}`);
  }
}

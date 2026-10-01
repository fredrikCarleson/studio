#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');

const REQUIRED_VIDEOS = [
  'videos/Sunrise_over_Stockholm_202604071643.mp4',
  'videos/Modern_tech_office_202604071647.mp4',
  'videos/slide-3-the-swarm.mp4',
  'videos/slide-4-the-knowledge-splitv2.mp4',
  'videos/slide-5-the-automation.mp4',
  'videos/slide-6-the-verdict.mp4',
  'videos/slide-7-the-wisdom.mp4',
  'videos/slide-8-the-future.mp4',
];

const REQUIRED_ASSETS = [
  'audio/blueprint-narration.mp3',
  'images/flowInfluencer.png',
  'images/influencerJail.png',
];

console.log('🔍 Checking Presentation Media Assets...\n');

let missing = 0;

for (const video of REQUIRED_VIDEOS) {
  const filePath = path.join(publicDir, video);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const mb = (stats.size / (1024 * 1024)).toFixed(1);
    console.log(`  ✅ [VIDEO] /${video} (${mb} MB)`);
  } else {
    console.error(`  ❌ [MISSING VIDEO] /${video}`);
    missing++;
  }
}

for (const asset of REQUIRED_ASSETS) {
  const filePath = path.join(publicDir, asset);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const kb = (stats.size / 1024).toFixed(1);
    console.log(`  ✅ [ASSET] /${asset} (${kb} KB)`);
  } else {
    console.error(`  ❌ [MISSING ASSET] /${asset}`);
    missing++;
  }
}

console.log('');
if (missing === 0) {
  console.log('🎉 All 11 stage media assets are present and ready for playback!');
  process.exit(0);
} else {
  console.error(`⚠️ Found ${missing} missing asset(s)!`);
  process.exit(1);
}

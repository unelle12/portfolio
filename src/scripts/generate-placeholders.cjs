const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', '..', 'public', 'assets', 'parallax');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Color palette
const colors = {
  teal: '#C1EBE9',
  yellow: '#FFF7C5',
  orange: '#F4AE52',
  burgundy: '#4F252E',
};

// Generate a simple SVG placeholder for each parallax layer
const layers = [
  {
    name: 'layer-1-bg.svg',
    width: 1920,
    height: 1080,
    content: `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.teal};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${colors.yellow};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.orange};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg-grad)"/>
  <circle cx="960" cy="540" r="300" fill="${colors.burgundy}" opacity="0.08"/>
  <circle cx="300" cy="200" r="150" fill="${colors.orange}" opacity="0.1"/>
  <circle cx="1600" cy="800" r="200" fill="${colors.teal}" opacity="0.15"/>
</svg>`,
  },
  {
    name: 'layer-2-shapes.svg',
    width: 1920,
    height: 1080,
    content: `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <!-- Geometric shapes for parallax depth -->
  <rect x="200" y="150" width="120" height="120" rx="16" fill="${colors.burgundy}" opacity="0.12" transform="rotate(15 260 210)"/>
  <circle cx="1600" cy="300" r="80" fill="${colors.orange}" opacity="0.15"/>
  <polygon points="960,100 1020,200 900,200" fill="${colors.burgundy}" opacity="0.08"/>
  <rect x="1400" y="700" width="180" height="180" rx="24" fill="${colors.teal}" opacity="0.12" transform="rotate(-10 1490 790)"/>
  <circle cx="400" cy="750" r="60" fill="${colors.yellow}" opacity="0.2"/>
  <rect x="800" y="600" width="100" height="100" rx="12" fill="${colors.burgundy}" opacity="0.06" transform="rotate(30 850 650)"/>
  <circle cx="1200" cy="500" r="40" fill="${colors.orange}" opacity="0.18"/>
  <rect x="100" y="500" width="80" height="80" rx="8" fill="${colors.teal}" opacity="0.1" transform="rotate(-20 140 540)"/>
</svg>`,
  },
  {
    name: 'layer-3-illustration.svg',
    width: 1920,
    height: 1080,
    content: `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <!-- Main illustration elements -->
  <rect x="760" y="340" width="400" height="400" rx="32" fill="${colors.burgundy}" opacity="0.15"/>
  <rect x="780" y="360" width="360" height="360" rx="24" fill="${colors.yellow}" opacity="0.3"/>
  <circle cx="960" cy="540" r="120" fill="${colors.orange}" opacity="0.2"/>
  <text x="960" y="560" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="48" font-weight="600" fill="${colors.burgundy}" opacity="0.6">Portfolio</text>
</svg>`,
  },
  {
    name: 'layer-4-overlay.svg',
    width: 1920,
    height: 1080,
    content: `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <!-- Subtle texture overlay -->
  <defs>
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="2" fill="${colors.burgundy}" opacity="0.05"/>
    </pattern>
  </defs>
  <rect width="1920" height="1080" fill="url(#dots)"/>
</svg>`,
  },
];

// Generate hero image placeholder
const heroPlaceholder = {
  name: 'hero-placeholder.svg',
  width: 800,
  height: 600,
  content: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.teal};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.yellow};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#hero-grad)"/>
  <circle cx="400" cy="300" r="150" fill="${colors.burgundy}" opacity="0.1"/>
  <text x="400" y="310" text-anchor="middle" font-family="sans-serif" font-size="24" fill="${colors.burgundy}" opacity="0.5">Replace with your image</text>
</svg>`,
};

// Write all placeholder files
const allFiles = [...layers, heroPlaceholder];

allFiles.forEach(({ name, content }) => {
  const filePath = path.join(outputDir, name);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Created: ${name}`);
});

console.log(`\nGenerated ${allFiles.length} placeholder files in ${outputDir}`);

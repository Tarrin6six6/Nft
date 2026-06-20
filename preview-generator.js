/**
 * NFL Player NFT Preview Generator
 * Creates a visual preview of all generated NFT images
 */

const fs = require('fs');
const path = require('path');
const canvas = require('canvas');
const { StreetArtGenerator } = require('./street-art-generator');
const { SAMPLE_PLAYERS, NFL_TEAMS } = require('./nfl-player-generator');

/**
 * Generate a single preview image
 */
function generatePreview(playerName, teamCode, jerseyNumber = 10) {
  const team = NFL_TEAMS[teamCode];
  const positions = ['QB', 'RB', 'WR', 'TE', 'DL', 'LB', 'CB', 'S'];
  const position = positions[Math.floor(Math.random() * positions.length)];

  const generator = new StreetArtGenerator(1000, 1000);
  return generator.generatePlayerImage(playerName, position, teamCode, jerseyNumber);
}

/**
 * Create grid preview of multiple players
 */
function createGridPreview(players, outputPath = './nft_preview_grid.png') {
  const cols = 3;
  const rows = Math.ceil(players.length / cols);
  const thumbnailSize = 400;
  
  const gridWidth = cols * thumbnailSize;
  const gridHeight = rows * thumbnailSize;

  const previewCanvas = canvas.createCanvas(gridWidth, gridHeight);
  const ctx = previewCanvas.getContext('2d');

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, gridWidth, gridHeight);

  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (index >= players.length) break;

      const player = players[index];
      const generator = new StreetArtGenerator(thumbnailSize, thumbnailSize);
      const playerCanvas = generator.generatePlayerImage(
        player.name,
        ['QB', 'RB', 'WR'][index % 3],
        player.team,
        (index % 99) + 1
      );

      const x = col * thumbnailSize;
      const y = row * thumbnailSize;

      ctx.drawImage(playerCanvas, x, y, thumbnailSize, thumbnailSize);

      // Add border
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, thumbnailSize, thumbnailSize);

      index++;
    }
  }

  // Save grid
  const stream = fs.createWriteStream(outputPath);
  previewCanvas.createPNGStream().pipe(stream);

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log(`✅ Grid preview saved: ${outputPath}`);
      resolve(outputPath);
    });
    stream.on('error', reject);
  });
}

/**
 * Create individual player preview with metadata
 */
function createDetailedPreview(player, outputPath = './preview_detailed.png') {
  const canvasWidth = 1200;
  const canvasHeight = 1400;
  
  const previewCanvas = canvas.createCanvas(canvasWidth, canvasHeight);
  const ctx = previewCanvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('NFL STREET ART NFT PREVIEW', canvasWidth / 2, 50);

  // Generate and draw main image
  const generator = new StreetArtGenerator(900, 900);
  const playerCanvas = generator.generatePlayerImage(
    player.name,
    'WR',
    player.team,
    23
  );

  ctx.drawImage(playerCanvas, 150, 100, 900, 900);

  // Metadata section
  const team = NFL_TEAMS[player.team];
  const metadataY = 1050;

  ctx.fillStyle = team.color;
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Player: ${player.name}`, 60, metadataY);
  
  ctx.fillStyle = '#FFFF00';
  ctx.fillText(`Team: ${team.name}`, 60, metadataY + 50);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`Position: WR | Jersey: 23`, 60, metadataY + 100);
  
  ctx.fillStyle = '#888888';
  ctx.font = '18px Arial';
  ctx.fillText('© NFT Street Art Generator - Powered by Canvas', 60, canvasHeight - 30);

  // Save
  const stream = fs.createWriteStream(outputPath);
  previewCanvas.createPNGStream().pipe(stream);

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log(`✅ Detailed preview saved: ${outputPath}`);
      resolve(outputPath);
    });
    stream.on('error', reject);
  });
}

/**
 * Generate all preview types
 */
async function generateAllPreviews() {
  console.log('🎨 Generating NFT previews...\n');

  try {
    // Create preview directory
    if (!fs.existsSync('./previews')) {
      fs.mkdirSync('./previews', { recursive: true });
    }

    // Generate grid preview
    console.log('📊 Creating grid preview...');
    await createGridPreview(SAMPLE_PLAYERS, './previews/grid_preview.png');

    // Generate individual previews for first 3 players
    console.log('📸 Creating individual previews...');
    for (let i = 0; i < Math.min(3, SAMPLE_PLAYERS.length); i++) {
      const player = SAMPLE_PLAYERS[i];
      await createDetailedPreview(
        player,
        `./previews/${player.name.replace(/\s+/g, '_')}_preview.png`
      );
    }

    console.log('\n✅ All previews generated successfully!');
    console.log('📁 Check the ./previews folder for:\n');
    console.log('  - grid_preview.png (all players grid)');
    console.log('  - Individual player previews');

  } catch (error) {
    console.error('❌ Error generating previews:', error);
    process.exit(1);
  }
}

module.exports = {
  generatePreview,
  createGridPreview,
  createDetailedPreview,
  generateAllPreviews
};

// CLI
if (require.main === module) {
  generateAllPreviews();
}

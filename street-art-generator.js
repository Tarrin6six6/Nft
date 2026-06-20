/**
 * NFL Player NFT Street Art Image Generator
 * Creates street art/graffiti style images for NFT players
 * Uses canvas to generate unique artwork in NFL street style
 */

const fs = require('fs');
const path = require('path');
const canvas = require('canvas');

// Register fonts if available
const fontPath = path.join(__dirname, 'fonts');
if (fs.existsSync(fontPath)) {
  canvas.registerFont(path.join(fontPath, 'graffiti.ttf'), { family: 'Graffiti' });
}

const { NFL_TEAMS, POSITIONS } = require('./nfl-player-generator');

/**
 * Street Art Color Palettes (inspired by urban art)
 */
const STREET_ART_PALETTES = {
  vibrant: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'],
  dark: ['#1B1B3F', '#2D3142', '#16213E', '#0F3460', '#533483'],
  neon: ['#00FF00', '#FF00FF', '#00FFFF', '#FFFF00', '#FF0080'],
  graffiti: ['#E31937', '#003594', '#FFD700', '#FF6600', '#8B0000']
};

/**
 * Generate a street art inspired NFT image
 */
class StreetArtGenerator {
  constructor(width = 1000, height = 1000) {
    this.width = width;
    this.height = height;
    this.canvas = canvas.createCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Create distressed/graffiti background
   */
  createGraffitiBackground(teamColor) {
    // Background base
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Add concrete texture
    this.addConcreteTexture();

    // Add spray paint drips
    this.addSprayDrips(teamColor);

    // Add street art style borders
    this.addBorders(teamColor);
  }

  /**
   * Add concrete/wall texture
   */
  addConcreteTexture() {
    const imageData = this.ctx.createImageData(this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 30;
      data[i] += noise;     // R
      data[i + 1] += noise; // G
      data[i + 2] += noise; // B
      data[i + 3] = 255;    // A
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Add spray paint drips effect
   */
  addSprayDrips(color) {
    const dripCount = 15;
    
    for (let i = 0; i < dripCount; i++) {
      const x = Math.random() * this.width;
      const startY = -50;
      const length = 50 + Math.random() * 200;

      this.ctx.strokeStyle = color;
      this.ctx.globalAlpha = 0.3 + Math.random() * 0.4;
      this.ctx.lineWidth = 3 + Math.random() * 8;
      this.ctx.lineCap = 'round';

      this.ctx.beginPath();
      this.ctx.moveTo(x, startY);
      
      // Create dripping effect
      let currentY = startY;
      let currentX = x;
      
      for (let j = 0; j < 10; j++) {
        currentX += (Math.random() - 0.5) * 10;
        currentY += length / 10;
        this.ctx.lineTo(currentX, currentY);
      }
      
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Add street art style borders
   */
  addBorders(color) {
    const borderWidth = 8;

    // Outer thick border
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = borderWidth;
    this.ctx.globalAlpha = 0.9;
    this.ctx.strokeRect(borderWidth / 2, borderWidth / 2, 
                        this.width - borderWidth, this.height - borderWidth);

    // Inner glow border
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = 0.4;
    this.ctx.strokeRect(borderWidth + 10, borderWidth + 10,
                        this.width - (borderWidth + 10) * 2, 
                        this.height - (borderWidth + 10) * 2);

    this.ctx.globalAlpha = 1;
  }

  /**
   * Draw player number in graffiti style
   */
  drawPlayerNumber(number, color) {
    const x = this.width / 2;
    const y = this.height / 2;

    // Shadow effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.font = 'bold 300px Arial Black';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(number, x + 8, y + 8);

    // Main number with gradient
    const gradient = this.ctx.createLinearGradient(x - 100, y - 150, x + 100, y + 150);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, '#FFFF00');
    gradient.addColorStop(1, color);

    this.ctx.fillStyle = gradient;
    this.ctx.fillText(number, x, y);

    // Outline
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 3;
    this.ctx.strokeText(number, x, y);
  }

  /**
   * Draw player info in street art style
   */
  drawPlayerInfo(playerName, position, team, color) {
    const topPadding = 80;
    const bottomPadding = 80;

    // Player name - top
    this.ctx.font = 'bold 48px Arial Black';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = 0.9;
    this.ctx.fillText(playerName.toUpperCase(), this.width / 2, topPadding);

    // Position badge - bottom left
    this.ctx.font = 'bold 36px Arial Black';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.globalAlpha = 0.95;
    
    const posX = 60;
    const posY = this.height - bottomPadding;
    
    this.ctx.fillText(position, posX, posY);

    // Team badge - bottom right
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = color;
    const teamX = this.width - 60;
    this.ctx.fillText(team, teamX, posY);

    this.ctx.globalAlpha = 1;
  }

  /**
   * Add geometric street art elements
   */
  addGeometricElements(color) {
    this.ctx.globalAlpha = 0.15;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;

    // Add random triangles and lines
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 20 + Math.random() * 100;

      if (Math.random() > 0.5) {
        // Triangle
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + size, y + size);
        this.ctx.lineTo(x - size, y + size);
        this.ctx.closePath();
        this.ctx.stroke();
      } else {
        // Rectangle
        this.ctx.strokeRect(x, y, size, size);
      }
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Generate complete player image
   */
  generatePlayerImage(playerName, position, teamCode, jerseyNumber) {
    const team = NFL_TEAMS[teamCode];
    const teamColor = team.color;

    // Create background
    this.createGraffitiBackground(teamColor);

    // Add geometric elements
    this.addGeometricElements(teamColor);

    // Draw player number
    this.drawPlayerNumber(jerseyNumber, teamColor);

    // Draw player info
    this.drawPlayerInfo(playerName, position, team.name, teamColor);

    // Add watermark/signature style text
    this.ctx.font = 'italic 20px Arial';
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillText('© NFL STREET ART', this.width - 30, this.height - 30);

    return this.canvas;
  }

  /**
   * Save image to file
   */
  saveImage(filepath) {
    const stream = fs.createWriteStream(filepath);
    this.canvas.createPNGStream().pipe(stream);
    
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filepath));
      stream.on('error', reject);
    });
  }

  /**
   * Get image as buffer
   */
  toBuffer() {
    return this.canvas.toBuffer('image/png');
  }
}

/**
 * Batch generate images for all players
 */
async function generateAllPlayerImages(players, outputDir = './nft_images') {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = [];

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const jerseyNumber = (i % 99) + 1;

    try {
      const generator = new StreetArtGenerator(1000, 1000);
      const canvas = generator.generatePlayerImage(
        player.name,
        Object.keys(POSITIONS)[Math.floor(Math.random() * POSITIONS.length)],
        player.team,
        jerseyNumber
      );

      const filename = `${player.name.replace(/\s+/g, '_').toLowerCase()}_${player.team}.png`;
      const filepath = path.join(outputDir, filename);

      await generator.saveImage(filepath);
      
      results.push({
        success: true,
        player: player.name,
        file: filename,
        path: filepath
      });

      console.log(`✅ Generated: ${player.name}`);
    } catch (error) {
      results.push({
        success: false,
        player: player.name,
        error: error.message
      });

      console.error(`❌ Error generating ${player.name}:`, error.message);
    }
  }

  return results;
}

module.exports = {
  StreetArtGenerator,
  generateAllPlayerImages,
  STREET_ART_PALETTES
};

// CLI Usage
if (require.main === module) {
  const { SAMPLE_PLAYERS } = require('./nfl-player-generator');
  
  generateAllPlayerImages(SAMPLE_PLAYERS)
    .then(results => {
      const successful = results.filter(r => r.success).length;
      console.log(`\n✅ Generated ${successful}/${results.length} player images`);
    })
    .catch(error => console.error('Fatal error:', error));
}

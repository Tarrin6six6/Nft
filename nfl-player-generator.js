/**
 * NFL Player NFT Metadata Generator
 * Generates unique NFT metadata for each active NFL player
 */

const fs = require('fs');
const path = require('path');

// NFL Teams and their data
const NFL_TEAMS = {
  // AFC East
  'BUF': { name: 'Buffalo Bills', conference: 'AFC', division: 'East', color: '#00338D' },
  'MIA': { name: 'Miami Dolphins', conference: 'AFC', division: 'East', color: '#008E97' },
  'NE': { name: 'New England Patriots', conference: 'AFC', division: 'East', color: '#002244' },
  'NYJ': { name: 'New York Jets', conference: 'AFC', division: 'East', color: '#125740' },
  
  // AFC North
  'BAL': { name: 'Baltimore Ravens', conference: 'AFC', division: 'North', color: '#241773' },
  'CIN': { name: 'Cincinnati Bengals', conference: 'AFC', division: 'North', color: '#FB4F14' },
  'CLE': { name: 'Cleveland Browns', conference: 'AFC', division: 'North', color: '#311D00' },
  'PIT': { name: 'Pittsburgh Steelers', conference: 'AFC', division: 'North', color: '#FFB612' },
  
  // AFC South
  'HOU': { name: 'Houston Texans', conference: 'AFC', division: 'South', color: '#03202F' },
  'IND': { name: 'Indianapolis Colts', conference: 'AFC', division: 'South', color: '#002C5F' },
  'JAX': { name: 'Jacksonville Jaguars', conference: 'AFC', division: 'South', color: '#006687' },
  'TEN': { name: 'Tennessee Titans', conference: 'AFC', division: 'South', color: '#0C2C56' },
  
  // AFC West
  'DEN': { name: 'Denver Broncos', conference: 'AFC', division: 'West', color: '#FB4F14' },
  'KC': { name: 'Kansas City Chiefs', conference: 'AFC', division: 'West', color: '#E31937' },
  'LAC': { name: 'Los Angeles Chargers', conference: 'AFC', division: 'West', color: '#0080B4' },
  'LV': { name: 'Las Vegas Raiders', conference: 'AFC', division: 'West', color: '#000000' },
  
  // NFC East
  'DAL': { name: 'Dallas Cowboys', conference: 'NFC', division: 'East', color: '#003594' },
  'PHI': { name: 'Philadelphia Eagles', conference: 'NFC', division: 'East', color: '#004687' },
  'WAS': { name: 'Washington Commanders', conference: 'NFC', division: 'East', color: '#5A1C15' },
  'NYG': { name: 'New York Giants', conference: 'NFC', division: 'East', color: '#0B2342' },
  
  // NFC North
  'CHI': { name: 'Chicago Bears', conference: 'NFC', division: 'North', color: '#0B162A' },
  'DET': { name: 'Detroit Lions', conference: 'NFC', division: 'North', color: '#0076B6' },
  'GB': { name: 'Green Bay Packers', conference: 'NFC', division: 'North', color: '#203731' },
  'MIN': { name: 'Minnesota Vikings', conference: 'NFC', division: 'North', color: '#4F2683' },
  
  // NFC South
  'ATL': { name: 'Atlanta Falcons', conference: 'NFC', division: 'South', color: '#A71930' },
  'CAR': { name: 'Carolina Panthers', conference: 'NFC', division: 'South', color: '#0085CA' },
  'NO': { name: 'New Orleans Saints', conference: 'NFC', division: 'South', color: '#D3BC8D' },
  'TB': { name: 'Tampa Bay Buccaneers', conference: 'NFC', division: 'South', color: '#092C5F' },
  
  // NFC West
  'ARI': { name: 'Arizona Cardinals', conference: 'NFC', division: 'West', color: '#97233F' },
  'LA': { name: 'Los Angeles Rams', conference: 'NFC', division: 'West', color: '#003594' },
  'SF': { name: 'San Francisco 49ers', conference: 'NFC', division: 'West', color: '#AA0000' },
  'SEA': { name: 'Seattle Seahawks', conference: 'NFC', division: 'West', color: '#002244' }
};

const POSITIONS = [
  'QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P'
];

const STAT_RANGES = {
  'QB': { passingYards: [2000, 5000], touchdowns: [10, 50], interceptions: [0, 25] },
  'RB': { rushingYards: [300, 2000], touchdowns: [0, 15], receptions: [10, 100] },
  'WR': { receivingYards: [300, 1500], touchdowns: [0, 15], receptions: [20, 150] },
  'TE': { receivingYards: [200, 1000], touchdowns: [0, 12], receptions: [20, 100] },
  'OL': { gamesPlayed: [1, 17], blocksPerGame: [5, 12] },
  'DL': { sacks: [0, 20], tackles: [10, 80], forcedFumbles: [0, 5] },
  'LB': { tackles: [50, 150], sacks: [0, 10], interceptions: [0, 5] },
  'CB': { interceptions: [0, 8], passesDefended: [5, 20], tackles: [20, 100] },
  'S': { interceptions: [0, 5], tackles: [50, 120], passesDefended: [5, 20] },
  'K': { fieldGoalsMade: [15, 35], pointsScored: [45, 150] },
  'P': { averagePuntYards: [40, 50], puntAttempts: [40, 80] }
};

/**
 * Generate random player stats based on position
 */
function generatePlayerStats(position) {
  const stats = { position };
  const ranges = STAT_RANGES[position] || {};
  
  Object.keys(ranges).forEach(stat => {
    const [min, max] = ranges[stat];
    stats[stat] = Math.floor(Math.random() * (max - min + 1)) + min;
  });
  
  return stats;
}

/**
 * Generate a single NFL player NFT metadata object
 */
function generatePlayerNFT(playerName, teamCode, tokenId) {
  const team = NFL_TEAMS[teamCode];
  const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
  const stats = generatePlayerStats(position);
  
  return {
    name: `${playerName} - ${team.name}`,
    description: `${playerName} is an active ${position} for the ${team.name}. ${team.conference} Conference, ${team.division} Division.`,
    image: `ipfs://YOUR_IPFS_HASH/players/${playerName.replace(/\s+/g, '-').toLowerCase()}.png`,
    external_url: `https://nfl.com/players/${playerName.replace(/\s+/g, '-').toLowerCase()}`,
    attributes: [
      {
        trait_type: 'Team',
        value: team.name
      },
      {
        trait_type: 'Conference',
        value: team.conference
      },
      {
        trait_type: 'Division',
        value: team.division
      },
      {
        trait_type: 'Position',
        value: position
      },
      {
        trait_type: 'Jersey Number',
        value: Math.floor(Math.random() * 99) + 1
      },
      {
        trait_type: 'Experience Years',
        value: Math.floor(Math.random() * 15) + 1
      },
      ...Object.entries(stats).map(([key, value]) => ({
        trait_type: key.charAt(0).toUpperCase() + key.slice(1),
        value: value
      }))
    ],
    properties: {
      category: 'sports',
      sport: 'NFL',
      team_color: team.color,
      rarity: Math.random() > 0.8 ? 'legendary' : Math.random() > 0.6 ? 'rare' : 'common'
    }
  };
}

/**
 * Generate NFT metadata for all players
 */
function generateAllPlayerNFTs(players) {
  const metadata = [];
  
  players.forEach((player, index) => {
    const nft = generatePlayerNFT(player.name, player.team, index);
    metadata.push({
      tokenId: index,
      ...nft
    });
  });
  
  return metadata;
}

/**
 * Sample NFL players (you can expand this or fetch from an API)
 */
const SAMPLE_PLAYERS = [
  { name: 'Patrick Mahomes', team: 'KC' },
  { name: 'Josh Allen', team: 'BUF' },
  { name: 'Lamar Jackson', team: 'BAL' },
  { name: 'Jalen Hurts', team: 'PHI' },
  { name: 'Dak Prescott', team: 'DAL' },
  { name: 'Travis Kelce', team: 'KC' },
  { name: 'Justin Jefferson', team: 'MIN' },
  { name: 'Tyreek Hill', team: 'MIA' },
  { name: 'Christian McCaffrey', team: 'SF' },
  { name: 'Saquon Barkley', team: 'PHI' }
];

/**
 * Main export functions
 */
module.exports = {
  generatePlayerNFT,
  generateAllPlayerNFTs,
  SAMPLE_PLAYERS,
  NFL_TEAMS,
  POSITIONS
};

// CLI Usage
if (require.main === module) {
  const outputDir = path.join(__dirname, 'nft_metadata');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate metadata for all players
  const allMetadata = generateAllPlayerNFTs(SAMPLE_PLAYERS);
  
  // Save to individual files
  allMetadata.forEach(metadata => {
    const filename = path.join(outputDir, `${metadata.tokenId}.json`);
    fs.writeFileSync(filename, JSON.stringify(metadata, null, 2));
  });
  
  // Save master metadata file
  fs.writeFileSync(
    path.join(outputDir, 'metadata.json'),
    JSON.stringify(allMetadata, null, 2)
  );
  
  console.log(`✅ Generated ${allMetadata.length} NFT metadata files in ${outputDir}`);
}

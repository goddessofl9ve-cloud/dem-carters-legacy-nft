const fs = require("fs");
const path = require("path");

// Collection themes configuration
const THEMES = {
  1: { name: "Founder's Place", edition: "Genesis", rarity: "Legendary", range: [1, 100] },
  2: { name: "Gold Legacy", edition: "Premium", rarity: "Epic", range: [101, 200] },
  3: { name: "Beyond Limits", edition: "Visionary", rarity: "Rare", range: [201, 300] },
  4: { name: "Made to Impact", edition: "Dynamic", rarity: "Uncommon", range: [301, 400] },
  5: { name: "Legacy Loading", edition: "Evolution", rarity: "Common", range: [401, 500] }
};

const DESCRIPTIONS = {
  1: "The foundation of the movement. Built Different for family legacy. Genesis edition.",
  2: "Premium gold collection celebrating generational wealth and cultural legacy.",
  3: "Visionary holders who see beyond conventional limits and boundaries.",
  4: "Dynamic creators making tangible impact on culture and legacy.",
  5: "The evolution continues. Building the future, loading the legacy."
};

const TRAIT_COLORS = {
  1: "Gold",
  2: "Purple Gold",
  3: "Midnight Black",
  4: "Magenta Energy",
  5: "Royal Purple"
};

function getThemeByTokenId(tokenId) {
  for (const [key, theme] of Object.entries(THEMES)) {
    if (tokenId >= theme.range[0] && tokenId <= theme.range[1]) {
      return theme;
    }
  }
  return THEMES[5];
}

function generateMetadata(tokenId) {
  const theme = getThemeByTokenId(tokenId);
  const imageUrl = `https://raw.githubusercontent.com/goddessofl9ve-cloud/dem-carters-legacy-nft/main/images/${String(tokenId).padStart(3, "0")}.png`;

  return {
    name: `DEM CARTER'S PLACE #${String(tokenId).padStart(3, "0")} — ${theme.name}`,
    description: DESCRIPTIONS[Object.keys(THEMES).find(k => THEMES[k].name === theme.name)],
    image: imageUrl,
    external_url: "https://demcarters.com",
    attributes: [
      {
        trait_type: "Theme",
        value: theme.name
      },
      {
        trait_type: "Edition",
        value: theme.edition
      },
      {
        trait_type: "Rarity",
        value: theme.rarity
      },
      {
        trait_type: "Color Scheme",
        value: TRAIT_COLORS[Object.keys(THEMES).find(k => THEMES[k].name === theme.name)]
      },
      {
        trait_type: "Legacy Collection",
        value: "DEM CARTER'S PLACE"
      },
      {
        trait_type: "Royalty Beneficiary",
        value: "THE CARTERS FAMILY REVOCABLE LIVING TRUST"
      }
    ],
    properties: {
      creators: ["DEM CARTER'S BRAND"],
      collection: "Built Different Legacy Collection",
      maxSupply: 500
    }
  };
}

function main() {
  console.log("🎨 Generating metadata for 500 NFTs...");

  const metadataDir = path.join(__dirname, "../metadata");
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir, { recursive: true });
  }

  // Generate metadata for all 500 tokens
  for (let tokenId = 0; tokenId < 500; tokenId++) {
    const metadata = generateMetadata(tokenId);
    const filename = path.join(metadataDir, `${tokenId}.json`);
    fs.writeFileSync(filename, JSON.stringify(metadata, null, 2));

    if ((tokenId + 1) % 50 === 0) {
      console.log(`✓ Generated ${tokenId + 1}/500 metadata files`);
    }
  }

  console.log(`\n✅ Metadata generation complete!`);
  console.log(`📁 All files saved to: ${metadataDir}`);
  console.log(`\n📊 Distribution:`);
  Object.entries(THEMES).forEach(([key, theme]) => {
    const count = theme.range[1] - theme.range[0] + 1;
    console.log(`   ${theme.name}: ${count} NFTs (${theme.rarity})`);
  });
}

main();
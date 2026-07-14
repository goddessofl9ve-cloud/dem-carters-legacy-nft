const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════════════╗");
  console.log("║                                                                    ║");
  console.log("║         🚀 DEM CARTER'S PLACE - NFT COLLECTION LAUNCH 🚀           ║");
  console.log("║                                                                    ║");
  console.log("║              Built Different. Legacy in the Making.                ║");
  console.log("║                                                                    ║");
  console.log("╚════════════════════════════════════════════════════════════════════╝");
  console.log("\n");

  // Get deployment account
  const [deployer] = await ethers.getSigners();
  console.log(`📍 Deploying from: ${deployer.address}`);
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} MATIC\n`);

  // Configuration
  const TRUST_ADDRESS = process.env.TRUST_WALLET_ADDRESS || "0x0000000000000000000000000000000000000000";
  const BASE_URI = process.env.BASE_URI || "https://raw.githubusercontent.com/goddessofl9ve-cloud/dem-carters-legacy-nft/main/metadata";

  console.log("📋 ─────────────────── COLLECTION CONFIGURATION ───────────────────");
  console.log(`   🏆 Collection: DEM CARTER'S PLACE - Built Different Legacy`);
  console.log(`   👑 Symbol: DCP`);
  console.log(`   📊 Total Supply: 500 NFTs (Limited Drop)`);
  console.log(`   💰 Royalty Rate: 8% on all secondary sales`);
  console.log(`   🏛️  Royalty Recipient: THE CARTERS FAMILY REVOCABLE LIVING TRUST`);
  console.log(`   🔗 Trust Wallet: ${TRUST_ADDRESS}`);
  console.log(`   🌐 Network: ${hre.network.name === 'polygon' ? 'Polygon Mainnet' : 'Polygon Mumbai Testnet'}`);
  console.log(`   📍 Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);
  console.log("────────────────────────────────────────────────────────────────────\n");

  // Validate trust address
  if (TRUST_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("\n❌ CRITICAL ERROR: TRUST_WALLET_ADDRESS not set in environment variables!\n");
  }

  // Show themes
  console.log("🎨 ─────────────────────── COLLECTION THEMES ────────────────────────");
  console.log(`   1️⃣  Founder's Place (Genesis)    [#1-100]      🟫 Legendary`);
  console.log(`   2️⃣  Gold Legacy                  [#101-200]    🟨 Epic`);
  console.log(`   3️⃣  Beyond Limits                [#201-300]    🟪 Rare`);
  console.log(`   4️⃣  Made to Impact               [#301-400]    🟧 Uncommon`);
  console.log(`   5️⃣  Legacy Loading               [#401-500]    🟩 Common`);
  console.log("────────────────────────────────────────────────────────────────────\n");

  // Deploy contract
  console.log("⏳ ─────────────────── DEPLOYING SMART CONTRACT ────────────────────");
  console.log(`   📦 Compiling DemCartersLegacy contract...`);
  
  const DemCartersLegacy = await hre.ethers.getContractFactory("DemCartersLegacy");
  console.log(`   ✅ Compilation successful\n`);
  console.log(`   🚀 Deploying to ${hre.network.name}...`);
  
  const contract = await DemCartersLegacy.deploy(TRUST_ADDRESS, BASE_URI);
  console.log(`   📝 Transaction: ${contract.deploymentTransaction().hash}`);
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  const deploymentBlock = await ethers.provider.getBlockNumber();

  console.log(`   ✅ Deployment successful!\n`);

  // Verify contract details
  console.log("✅ ─────────────────── CONTRACT VERIFICATION ──────────────────────");
  const trustAddr = await contract.TRUST_ADDRESS();
  const maxSupply = await contract.remainingSupply();
  const [royaltyAddr, royaltyAmount] = await contract.royaltyInfo(0, ethers.parseEther("1"));

  console.log(`   ✅ Contract Address: ${contractAddress}`);
  console.log(`   ✅ Trust Address: ${trustAddr}`);
  console.log(`   ✅ Royalty Recipient: ${royaltyAddr}`);
  console.log(`   ✅ Royalty Rate: 8% (800 basis points)`);
  console.log(`   ✅ Max Supply: 500 NFTs`);
  console.log(`   ✅ Available to Mint: ${maxSupply}`);
  console.log(`   ✅ Interface Support: ERC721 ✓ ERC2981 ✓`);
  console.log("────────────────────────────────────────────────────────────────────\n");

  // Save deployment info
  const deploymentsDir = "deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentInfo = {
    name: "DEM CARTER'S PLACE - Built Different Legacy Collection",
    symbol: "DCP",
    contract: contractAddress,
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    trustWallet: TRUST_ADDRESS,
    baseURI: BASE_URI,
    deploymentBlock: deploymentBlock,
    deploymentTx: contract.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
    maxSupply: 500,
    royaltyPercent: "8%",
    themes: {
      "Founder's Place": { range: "1-100", rarity: "Legendary" },
      "Gold Legacy": { range: "101-200", rarity: "Epic" },
      "Beyond Limits": { range: "201-300", rarity: "Rare" },
      "Made to Impact": { range: "301-400", rarity: "Uncommon" },
      "Legacy Loading": { range: "401-500", rarity: "Common" }
    }
  };

  const filename = `${deploymentsDir}/${hre.network.name}_${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));

  console.log("💾 ─────────────────────── DEPLOYMENT SAVED ────────────────────────");
  console.log(`   📁 Saved to: ${filename}\n`);

  // Next steps
  console.log("📖 ─────────────────────── NEXT STEPS ─────────────────────────────");
  
  if (hre.network.name === "mumbai") {
    console.log(`\n   🧪 TESTNET DEPLOYMENT SUCCESSFUL!\n`);
    console.log(`   1. Verify on PolygonScan Mumbai:`);
    console.log(`      https://mumbai.polygonscan.com/address/${contractAddress}\n`);
    console.log(`   2. Test minting and transfers\n`);
    console.log(`   3. When ready, deploy to mainnet:`);
    console.log(`      npm run deploy:polygon\n`);
  } else if (hre.network.name === "polygon") {
    console.log(`\n   🎉 MAINNET DEPLOYMENT SUCCESSFUL!\n`);
    console.log(`   1. Verify on PolygonScan:`);
    console.log(`      https://polygonscan.com/address/${contractAddress}\n`);
    console.log(`   2. Register on OpenSea:`);
    console.log(`      https://opensea.io/collections/create\n`);
    console.log(`   3. Begin minting:`);
    console.log(`      await contract.batchMint([address1, address2, ...])\n`);
    console.log(`   4. Monitor royalties on Dune Analytics\n`);
  }

  console.log("🚀 ──────────────────── MINTING COMMANDS ──────────────────────────");
  console.log(`\n   // Mint single NFT:`);
  console.log(`   await contract.mint("0xAddress", 0)\n`);
  console.log(`   // Batch mint (recommended):`);
  console.log(`   await contract.batchMint(["0xAddr1", "0xAddr2", ...])\n`);
  console.log(`   // Auto-increment mint:`);
  console.log(`   await contract.autoMint("0xAddress")\n`);

  console.log("📊 ────────────────────── IMPORTANT LINKS ─────────────────────────");
  console.log(`\n   📍 Contract Address: ${contractAddress}`);
  console.log(`   🔗 PolygonScan: https://polygonscan.com/address/${contractAddress}`);
  console.log(`   🏪 OpenSea: https://opensea.io/collections/dem-carters-place`);
  console.log(`   📈 Dune Dashboard: https://dune.com (setup royalty tracking)`);
  console.log(`   📖 GitHub: https://github.com/goddessofl9ve-cloud/dem-carters-legacy-nft\n`);

  console.log("╔════════════════════════════════════════════════════════════════════╗");
  console.log("║                                                                    ║");
  console.log("║              ✨ DEM CARTER'S PLACE IS LIVE! ✨                     ║");
  console.log("║                                                                    ║");
  console.log("║         Confidence. Creativity. Culture. Built Different.          ║");
  console.log("║              Legacy in the Making. Now on Blockchain.              ║");
  console.log("║                                                                    ║");
  console.log("╚════════════════════════════════════════════════════════════════════╝");
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("\n❌ DEPLOYMENT ERROR:", error.message);
    console.error("\nStack trace:", error);
    process.exit(1);
  });
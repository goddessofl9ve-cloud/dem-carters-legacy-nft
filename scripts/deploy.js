const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 DEM CARTER'S PLACE - NFT Deployment Starting...");

  // Get deployment account
  const [deployer] = await ethers.getSigners();
  console.log(`📍 Deploying from: ${deployer.address}`);
  console.log(`💰 Account balance: ${ethers.formatEther(await deployer.getBalance())} MATIC`);

  // Configuration
  const TRUST_ADDRESS = process.env.TRUST_WALLET_ADDRESS || "0x0000000000000000000000000000000000000000";
  const BASE_URI = process.env.BASE_URI || "https://raw.githubusercontent.com/goddessofl9ve-cloud/dem-carters-legacy-nft/main/metadata";

  console.log(`\n📋 Configuration:`);
  console.log(`   Trust Wallet: ${TRUST_ADDRESS}`);
  console.log(`   Base URI: ${BASE_URI}`);

  // Validate trust address
  if (TRUST_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("❌ TRUST_WALLET_ADDRESS not set in environment variables!");
  }

  // Deploy contract
  console.log(`\n⏳ Deploying DemCartersLegacy contract...`);
  const DemCartersLegacy = await hre.ethers.getContractFactory("DemCartersLegacy");
  const contract = await DemCartersLegacy.deploy(TRUST_ADDRESS, BASE_URI);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log(`✅ Contract deployed at: ${contractAddress}`);
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);

  // Save deployment info
  const deploymentInfo = {
    contract: contractAddress,
    network: hre.network.name,
    deployer: deployer.address,
    trustWallet: TRUST_ADDRESS,
    baseURI: BASE_URI,
    deploymentBlock: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    maxSupply: 500,
    royaltyPercent: "8%"
  };

  if (!fs.existsSync("deployments")) {
    fs.mkdirSync("deployments", { recursive: true });
  }

  fs.writeFileSync(
    `deployments/${hre.network.name}_${Date.now()}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`\n📁 Deployment info saved to deployments/`);

  console.log(`\n✨ Deployment Complete! ✨`);
  console.log(`📖 Next steps:`);
  console.log(`   1. Verify on PolygonScan: https://polygonscan.com/address/${contractAddress}`);
  console.log(`   2. Update metadata URI if needed`);
  console.log(`   3. Begin minting via batchMint() function`);
  console.log(`   4. List on OpenSea and other marketplaces`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
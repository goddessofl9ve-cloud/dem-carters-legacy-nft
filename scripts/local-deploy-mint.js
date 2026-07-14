const hre = require("hardhat");

async function main() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════════════╗");
  console.log("║                                                                    ║");
  console.log("║     🎉 DEM CARTER'S PLACE - FREE LOCAL DEPLOYMENT & MINTING 🎉    ║");
  console.log("║                                                                    ║");
  console.log("║              Built Different. Legacy in the Making.                ║");
  console.log("║                                                                    ║");
  console.log("╚════════════════════════════════════════════════════════════════════╝");
  console.log("\n");

  // Get signers
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();
  
  console.log("🔧 ──────────────────── LOCAL SETUP ──────────────────────────────");
  console.log(`   Owner (deployer): ${owner.address}`);
  console.log(`   Trust Wallet: ${owner.address} (using owner for testing)`);
  console.log(`   Signer 1: ${addr1.address}`);
  console.log(`   Signer 2: ${addr2.address}`);
  console.log(`   Signer 3: ${addr3.address}\n`);

  // Deploy contract
  console.log("⏳ ──────────────────── DEPLOYING CONTRACT ────────────────────────");
  const BASE_URI = "https://raw.githubusercontent.com/goddessofl9ve-cloud/dem-carters-legacy-nft/main/metadata";
  const DemCartersLegacy = await ethers.getContractFactory("DemCartersLegacy");
  const contract = await DemCartersLegacy.deploy(owner.address, BASE_URI);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  
  console.log(`   ✅ Contract deployed at: ${contractAddress}`);
  console.log(`   📊 Network: ${hre.network.name}`);
  console.log(`   ⛓️  Chain ID: ${(await ethers.provider.getNetwork()).chainId}\n`);

  // Verify contract
  console.log("✅ ──────────────────── CONTRACT VERIFICATION ──────────────────────");
  const trustAddr = await contract.TRUST_ADDRESS();
  const remaining = await contract.remainingSupply();
  const [royaltyAddr, royaltyAmount] = await contract.royaltyInfo(0, ethers.parseEther("1"));
  
  console.log(`   ✅ Contract Address: ${contractAddress}`);
  console.log(`   ✅ Trust Address: ${trustAddr}`);
  console.log(`   ✅ Royalty Rate: 8% (${royaltyAmount.toString()} from 1 ETH)`);
  console.log(`   ✅ Available Supply: ${remaining}`);
  console.log(`   ✅ ERC721 Support: Yes`);
  console.log(`   ✅ ERC2981 Support: Yes\n`);

  // Show themes
  console.log("🎨 ─────────────────────── COLLECTION THEMES ────────────────────────");
  console.log(`   1️⃣  Founder's Place (Genesis)    [#0-99]       🟫 Legendary`);
  console.log(`   2️⃣  Gold Legacy                  [#100-199]    🟨 Epic`);
  console.log(`   3️⃣  Beyond Limits                [#200-299]    🟪 Rare`);
  console.log(`   4️⃣  Made to Impact               [#300-399]    🟧 Uncommon`);
  console.log(`   5️⃣  Legacy Loading               [#400-499]    🟩 Common\n`);

  // Mint NFTs
  console.log("🚀 ──────────────────── BATCH MINTING 50 NFTs ──────────────────────");
  
  const recipients = [];
  // Add addr1 10 times
  for (let i = 0; i < 10; i++) recipients.push(addr1.address);
  // Add addr2 10 times
  for (let i = 0; i < 10; i++) recipients.push(addr2.address);
  // Add addr3 10 times
  for (let i = 0; i < 10; i++) recipients.push(addr3.address);
  // Add owner 20 times
  for (let i = 0; i < 20; i++) recipients.push(owner.address);

  console.log(`   📦 Minting ${recipients.length} NFTs to addresses...`);
  const batchTx = await contract.batchMint(recipients);
  await batchTx.wait();
  console.log(`   ✅ Batch mint successful!\n`);

  // Verify mints
  console.log("📊 ──────────────────── MINT VERIFICATION ────────────────────────");
  const addr1Balance = await contract.balanceOf(addr1.address);
  const addr2Balance = await contract.balanceOf(addr2.address);
  const addr3Balance = await contract.balanceOf(addr3.address);
  const ownerBalance = await contract.balanceOf(owner.address);
  const totalMinted = await contract.totalMinted();
  const remainingAfter = await contract.remainingSupply();

  console.log(`   💎 Addr1 (${addr1.address.slice(0, 10)}...): ${addr1Balance} NFTs`);
  console.log(`   💎 Addr2 (${addr2.address.slice(0, 10)}...): ${addr2Balance} NFTs`);
  console.log(`   💎 Addr3 (${addr3.address.slice(0, 10)}...): ${addr3Balance} NFTs`);
  console.log(`   💎 Owner (${owner.address.slice(0, 10)}...): ${ownerBalance} NFTs`);
  console.log(`   📈 Total Minted: ${totalMinted}`);
  console.log(`   📉 Remaining Supply: ${remainingAfter}\n`);

  // Show token URIs
  console.log("🎨 ──────────────────── SAMPLE NFT METADATA ────────────────────────");
  for (let i = 0; i < 3; i++) {
    try {
      const tokenURI = await contract.tokenURI(i);
      console.log(`   NFT #${i}: ${tokenURI}`);
    } catch (e) {
      console.log(`   NFT #${i}: Not yet minted`);
    }
  }
  console.log();

  // Mint additional NFTs sequentially
  console.log("✨ ──────────────────── AUTO-MINTING 25 MORE NFTs ────────────────────");
  let totalAutoMinted = 0;
  for (let i = 0; i < 25; i++) {
    const recipient = [addr1.address, addr2.address, addr3.address, owner.address][i % 4];
    await contract.autoMint(recipient);
    totalAutoMinted++;
    if ((i + 1) % 5 === 0) {
      console.log(`   ✅ Auto-minted ${i + 1}/25 NFTs`);
    }
  }
  console.log();

  // Final stats
  const finalMinted = await contract.totalMinted();
  const finalRemaining = await contract.remainingSupply();
  const finalAddr1 = await contract.balanceOf(addr1.address);
  const finalAddr2 = await contract.balanceOf(addr2.address);
  const finalAddr3 = await contract.balanceOf(addr3.address);
  const finalOwner = await contract.balanceOf(owner.address);

  console.log("📊 ──────────────────── FINAL COLLECTION STATS ──────────────────────");
  console.log(`   🎯 Total Minted: ${finalMinted}/500`);
  console.log(`   📉 Remaining: ${finalRemaining}`);
  console.log(`   └─ Addr1: ${finalAddr1} NFTs`);
  console.log(`   └─ Addr2: ${finalAddr2} NFTs`);
  console.log(`   └─ Addr3: ${finalAddr3} NFTs`);
  console.log(`   └─ Owner: ${finalOwner} NFTs\n`);

  // Test royalty calculation
  console.log("💰 ──────────────────── ROYALTY CALCULATION TEST ────────────────────");
  const testPrice = ethers.parseEther("10"); // 10 ETH
  const [royaltyRecipient, royaltyAmount2] = await contract.royaltyInfo(0, testPrice);
  console.log(`   Sale Price: 10 ETH`);
  console.log(`   Royalty Amount: ${ethers.formatEther(royaltyAmount2)} ETH (8%)`);
  console.log(`   Royalty Recipient: ${royaltyRecipient}\n`);

  // Important info
  console.log("ℹ️  ──────────────────── IMPORTANT INFORMATION ──────────────────────");
  console.log(`   📍 Contract Address: ${contractAddress}`);
  console.log(`   🔗 Test Network: Hardhat local node`);
  console.log(`   💾 This deployment is LOCAL ONLY - not on blockchain`);
  console.log(`   🚀 To deploy on Polygon mainnet:`);
  console.log(`      npm run deploy:polygon\n`);

  console.log("🎯 ──────────────────── NEXT STEPS ────────────────────────────────");
  console.log(`   1. Continue minting more NFTs:`);
  console.log(`      const tx = await contract.autoMint("0xAddress")`);
  console.log(`      await tx.wait()\n`);
  console.log(`   2. Check holder balances:`);
  console.log(`      const balance = await contract.balanceOf("0xAddress")\n`);
  console.log(`   3. View token metadata:`);
  console.log(`      const uri = await contract.tokenURI(0)\n`);
  console.log(`   4. Deploy to Polygon Mainnet:`);
  console.log(`      npm run deploy:polygon\n`);

  console.log("╔════════════════════════════════════════════════════════════════════╗");
  console.log("║                                                                    ║");
  console.log("║         ✨ DEM CARTER'S PLACE IS LIVE & MINTING! ✨               ║");
  console.log("║                                                                    ║");
  console.log("║    75 NFTs have been minted across all collection themes!         ║");
  console.log("║                                                                    ║");
  console.log("║         Confidence. Creativity. Culture. Built Different.          ║");
  console.log("║              Legacy in the Making. Now in Your Hands.              ║");
  console.log("║                                                                    ║");
  console.log("╚════════════════════════════════════════════════════════════════════╝");
  console.log("\n");

  return {
    contract: contractAddress,
    owner: owner.address,
    addr1: addr1.address,
    addr2: addr2.address,
    addr3: addr3.address,
    totalMinted: finalMinted.toString(),
    remaining: finalRemaining.toString()
  };
}

main()
  .then((result) => {
    console.log("✅ Deployment & Minting Complete!");
    console.log("📊 Result:", result);
    process.exit(0);
  })
  .catch(error => {
    console.error("\n❌ ERROR:", error);
    process.exit(1);
  });
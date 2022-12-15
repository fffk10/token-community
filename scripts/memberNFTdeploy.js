const fs = require("fs");

const main = async () => {
  const addr1 = "0x6dfAD5AA101Ef44D11b14103458189B087c374ee";
  const addr2 = "0x83E682714c094B7d5AC021C6Fd8646aF9a0Ff669";
  const addr3 = "0xb1Ba42Bb05d857dDbeaF6cdBa88AEa30893F3fd3";

  const tokenURI1 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata1.json";
  const tokenURI2 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata2.json";
  const tokenURI3 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata3.json";
  const tokenURI4 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata4.json";
  const tokenURI5 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata5.json";

  // deploy
  MemberNFT = await ethers.getContractFactory("MemberNFT");
  memberNFT = await MemberNFT.deploy();
  await memberNFT.deployed();

  console.log(`Contract deployed to; https://goerli.etherscan.io/address/${memberNFT.address}`);

  // NFT mint
  // transaction publishing
  let tx = await memberNFT.nftMint(addr1, tokenURI1);
  await tx.wait();
  console.log("NFT#1 minted...");

  tx = await memberNFT.nftMint(addr1, tokenURI2);
  await tx.wait();
  console.log("NFT#2 minted...");

  tx = await memberNFT.nftMint(addr2, tokenURI3);
  await tx.wait();
  console.log("NFT#3 minted...");

  tx = await memberNFT.nftMint(addr2, tokenURI4);
  await tx.wait();
  console.log("NFT#4 minted...");

  // Contract Address write to file
  fs.writeFileSync("./memberNFTContract.js",
    `
    module.exports = "${memberNFT.address}"
    `
  );
}

const memberNFTDeploy = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

memberNFTDeploy();
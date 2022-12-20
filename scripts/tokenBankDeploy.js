const fs = require("fs");
const memberNFTAddress = require("../memberNFTContract");

const main = async () => {
  const addr1 = "0x6dfAD5AA101Ef44D11b14103458189B087c374ee";
  const addr2 = "0x83E682714c094B7d5AC021C6Fd8646aF9a0Ff669";
  const addr3 = "0xb1Ba42Bb05d857dDbeaF6cdBa88AEa30893F3fd3";
  const addr4 = "0xb9661bE278C884C9A54253740ee833920429eA84";

  // deploy
  const TokenBank = await ethers.getContractFactory("TokenBank");
  const tokenBank = await TokenBank.deploy("TokenBank", "TBK", memberNFTAddress);
  await tokenBank.deployed();

  console.log(`Contract deployed to; https://goerli.etherscan.io/address/${tokenBank.address}.`);

  // token transfer
  let tx = await tokenBank.transfer(addr2, 300);
  await tx.wait();
  console.log("transferred to addr2.")

  tx = await tokenBank.transfer(addr3, 200);
  await tx.wait();
  console.log("transferred to addr3.")

  tx = await tokenBank.transfer(addr4, 100);
  await tx.wait();
  console.log("transferred to addr4.")

  // generated argument.js for Verify
  fs.writeFileSync("./argument.js",
    `
    module.exports = [
      "TokenBank",
      "TBK",
      "${memberNFTAddress}"
    ]
    `
  );

  // generated contracts.js for frontend application
  fs.writeFileSync("./contracts.js",
    `
    export const memberNFTAddress = "${memberNFTAddress}"
    export const tokenBankAddress = "${tokenBank.address}"
    `
  );

}

const tokenBankDeploy = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

tokenBankDeploy();
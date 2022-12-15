const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemberNFT Contract", function () {
  let MemberNFT;
  let memberNFT;
  const name = "MemberNFT";
  const symbol = "MEM";
  const tokenURI1 = "hoge1";
  const tokenURI2 = "hoge2";
  let owner;
  let addr1;

  beforeEach(async function () {
    // getSigners => get all accounts
    // first to owner
    // second to addr1
    [owner, addr1] = await ethers.getSigners();
    // contract is deploy
    MemberNFT = await ethers.getContractFactory("MemberNFT");
    memberNFT = await MemberNFT.deploy();
    // wait deploy
    await memberNFT.deployed();
  });

  it("Token name and symbol shuold be set.", async function () {
    expect(await memberNFT.name()).to.equal(name);
    expect(await memberNFT.symbol()).to.equal(symbol);
  });
  it("Deploy address shuold be set to owner.", async function () {
    expect(await memberNFT.owner()).to.equal(owner.address);
  });
  it("The owner should be able to NFT mint.", async function () {
    await memberNFT.nftMint(addr1.address, tokenURI1);
    expect(await memberNFT.ownerOf(1)).to.equal(addr1.address);
  });
  it("TokenId should be incremented every time NFT is created.", async function () {
    await memberNFT.nftMint(addr1.address, tokenURI1);
    await memberNFT.nftMint(addr1.address, tokenURI2);
    expect(await memberNFT.tokenURI(1)).to.equal(tokenURI1);
    expect(await memberNFT.tokenURI(2)).to.equal(tokenURI2);
  });
  it("Non-owner should fail to create NFT.", async function () {
    await expect(memberNFT.connect(addr1).nftMint(addr1.address, tokenURI1))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });
  it("Event publishing after NFT created.", async function () {
    await expect(memberNFT.nftMint(addr1.address, tokenURI1))
      .to.emit(memberNFT, "TokenURIChanged").withArgs(addr1.address, 1, tokenURI1);
  });
})
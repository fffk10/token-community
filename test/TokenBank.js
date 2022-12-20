const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenBank Contract", function () {
    let MemberNFT;
    let memberNFT;
    const tokenURI1 = "hoge1";
    const tokenURI2 = "hoge2";
    const tokenURI3 = "hoge3";
    const tokenURI4 = "hoge4";
    const tokenURI5 = "hoge5";
    let TokenBank;
    let tokenBank;
    const name = "Token";
    const symbol = "TBK";
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    let owner;
    let addr1;
    let addr2;
    let addr3;

    beforeEach(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        MemberNFT = await ethers.getContractFactory("MemberNFT");
        memberNFT = await MemberNFT.deploy();
        await memberNFT.deployed();
        await memberNFT.nftMint(owner.address, tokenURI1);
        await memberNFT.nftMint(addr1.address, tokenURI2);
        await memberNFT.nftMint(addr1.address, tokenURI3);
        await memberNFT.nftMint(addr2.address, tokenURI4);

        TokenBank = await ethers.getContractFactory("TokenBank");
        tokenBank = await TokenBank.deploy(name, symbol, memberNFT.address);
        await tokenBank.deployed();
    });

    describe("deploy", function () {
        it("Token name and symbol should be set.", async function () {
            expect(await tokenBank.name()).to.equal(name);
            expect(await tokenBank.symbol()).to.equal(symbol);
        });
        it("Deploy address should be set to owner.", async function () {
            expect(await tokenBank.owner()).to.equal(owner.address);
        });
        it("Total supply should be set to owner.", async function () {
            const ownerBalance = await tokenBank.balanceOf(owner.address);
            expect(await tokenBank.totalSupply()).to.equal(ownerBalance);
        });
        it("TokenBank amount deposit should be  0.", async function () {
            expect(await tokenBank.bankTotalDeposit()).to.equal(0);
        });
    });

    describe("inter-address transaction", function () {
        // send 500token to addr1.
        beforeEach(async function () {
            await tokenBank.transfer(addr1.address, 500);
        });

        it("Tokens can be transferred.", async function () {
            const startAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const startAddr2Balance = await tokenBank.balanceOf(addr2.address);
            await tokenBank.connect(addr1).transfer(addr2.address, 100)
            const endAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const endAddr2Balance = await tokenBank.balanceOf(addr2.address);

            expect(endAddr1Balance).to.equal(startAddr1Balance.sub(100));
            expect(endAddr2Balance).to.equal(startAddr2Balance.add(100));
        });
        it("To zero address transfer should fail.", async function () {
            await expect(tokenBank.transfer(zeroAddress, 100)).to.be.revertedWith("Zero address cannot be specified for 'to'!");
        });
        it("Insufficient balance should fail.", async function () {
            await expect(tokenBank.connect(addr1).transfer(addr2.address, 510)).to.be.revertedWith("Insufficient balance!");
        });
        it("Event should be emitted after transfer.", async function () {
            await expect(tokenBank.connect(addr1).transfer(addr2.address, 100))
                .emit(tokenBank, "TokenTransfer").withArgs(addr1.address, addr2.address, 100);
        });
    });
    describe("Bank transaction", function () {
        beforeEach(async function () {
            await tokenBank.transfer(addr1.address, 500);
            await tokenBank.transfer(addr2.address, 200);
            await tokenBank.transfer(addr3.address, 100);
            await tokenBank.connect(addr1).deposit(100);
            await tokenBank.connect(addr2).deposit(200);
        });

        it("Token deposit should be able to execute.", async function () {
            const addr1Balance = await tokenBank.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(400);

            const addr1BankBalance = await tokenBank.bankBalanceOf(addr1.address);
            expect(addr1BankBalance).to.equal(100);
        });
        it("Token transfer should be possible after deposit.", async function () {
            const startAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const startAddr2Balance = await tokenBank.balanceOf(addr2.address);
            await tokenBank.connect(addr1).transfer(addr2.address, 100)
            const endAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const endAddr2Balance = await tokenBank.balanceOf(addr2.address);

            expect(endAddr1Balance).to.equal(startAddr1Balance.sub(100));
            expect(endAddr2Balance).to.equal(startAddr2Balance.add(100));
        });
        it("Token deposit event should be emitted after deposit.", async function () {
            await expect(tokenBank.connect(addr1).deposit(100))
                .emit(tokenBank, "TokenDeposit").withArgs(addr1.address, 100);
        });
        it("Token withdraw should be able to execute.", async function () {
            const startBankBalance = await tokenBank.connect(addr1).bankBalanceOf(addr1.address);
            const startTotalBankBalance = await tokenBank.connect(addr1).bankTotalDeposit();

            await tokenBank.connect(addr1).withdraw(100);

            const endBankBalance = await tokenBank.connect(addr1).bankBalanceOf(addr1.address);
            const endTotalBankBalance = await tokenBank.connect(addr1).bankTotalDeposit();

            expect(endBankBalance).to.equal(startBankBalance.sub(100));
            expect(endTotalBankBalance).to.equal(startTotalBankBalance.sub(100));
        });
        it("Withdrawal should fail if deposit tokens are insufficient.", async function () {
            await expect(tokenBank.connect(addr1).withdraw(101))
                .to.be.revertedWith("An amount greater than your tokenBank balance!");
        });
        it("Token withdraw event should be emitted after withdraw.", async function () {
            await expect(tokenBank.connect(addr1).withdraw(100))
                .emit(tokenBank, "TokenWithdraw").withArgs(addr1.address, 100);
        });
    });
});
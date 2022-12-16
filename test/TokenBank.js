const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenBank Contract", function () {
    let TokenBank;
    let tokenBank;
    const name = "Token";
    const symbol = "TBK";
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        TokenBank = await ethers.getContractFactory("TokenBank");
        tokenBank = await TokenBank.deploy(name, symbol);
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
        it("Total supply should be set to owner", async function () {
            const ownerBalance = await tokenBank.balanceOf(owner.address);
            expect(await tokenBank.totalSupply()).to.equal(ownerBalance);
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

})
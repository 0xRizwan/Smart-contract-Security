const {loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { useLoaderData } = require("react-router");
  
  describe("SmallWallet", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContract() {  
  
      // Contracts are deployed using the first signer/account by default
      const [owner, attacker, user] = await ethers.getSigners();
  
      const SmallWalletContract = await ethers.getContractFactory("SmallWallet", owner);
      const smallWalletContract = await SmallWalletContract.deploy();
      await smallWalletContract.deployed();

      const AttackerContract = await ethers.getContractFactory("Attacker", attacker);
      const attackerContract = await AttackerContract.deploy(smallWalletContract.address);
      await attackerContract.deployed();
  
      return { owner, attackerContract, smallWalletContract, attacker, user };
    }


    describe("Small wallet", () => {
        it("Should accept deposit", async function(){
            const {smallWalletContract, user} = await loadFixture(deployContract);
            expect(await ethers.provider.getBalance(smallWalletContract.address)).to.eq(10000);
        });

        it("Should be able to execute withdrawAll function", async function(){
            const {smallWalletContract, user} = await loadFixture(deployContract);
            const initialBalance = await ethers.provider.getBalance(user.address);

            await smallWalletContract.withdrawAll(user.address);

            expect(await ethers.provider.getBalance(smallWalletContract.address)).to.eq(0);
            expect(await ethers.provider.getBalance(user.address)).to.eq(initialBalance.add(10000));

        });

        it("Should revert if withdrawAll is called from any other account other than owner", async function(){
            const {smallWalletContract, attacker} = await loadFixture(deployContract);
            await expect(smallWalletContract.connect(attacker).withdrawAll(attacker.address)).to.be.revertedWith("Caller is not authorized");
            
        })

    });

})
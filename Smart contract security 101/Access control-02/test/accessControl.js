const {loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
  
  describe("AgreedPrice", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContract() {  
  
      // Contracts are deployed using the first signer/account by default
      const [owner, attacker, user] = await ethers.getSigners();
  
      const AgreedPrice = await ethers.getContractFactory("AgreedPrice");
      const agreedPrice = await AgreedPrice.deploy(100);
      await agreedPrice.deployed();
  
      return { owner, attacker, agreedPrice, user };
    }

    describe("AgreedPrice", () => {
        it("should set price at deployment", async function(){
            const { agreedPrice} = await loadFixture(deployContract);
            expect(await agreedPrice.price()).to.eq(100);
        });

        it("should be possible for the owner to change the price", async function(){
            const { agreedPrice} = await loadFixture(deployContract);
            await agreedPrice.updatePrice(1000);
            expect(await agreedPrice.price()).to.eq(1000);
        });

        it("should be possible for the owner to transfer ownership", async function(){
            const {agreedPrice, user} = await loadFixture(deployContract);
            await agreedPrice.transferOwnership(user.address);
            expect(await agreedPrice.owner()).to.eq(user.address);
        });

        it("should be possible for the new owner to call updateprice function", async function(){
            const{user, agreedPrice} = await loadFixture(deployContract);
            await agreedPrice.transferOwnership(user.address);
            await agreedPrice.connect(user).updatePrice(2000);
            expect(await agreedPrice.price()).to.eq(2000);
        })

        it("should be not be possible other than the owner to transfer ownerdship", async function(){
            const{agreedPrice, attacker} = await loadFixture(deployContract);
            await expect(agreedPrice.connect(attacker).transferOwnership(attacker.address)).to.be.revertedWith("Ownable: caller is not the owner");
        })

        it("Should not be possinble for anyone other than Owner to update the price", async function(){
            const{agreedPrice, attacker} = await loadFixture(deployContract);
            await expect(agreedPrice.connect(attacker).updatePrice(100)).to.be.revertedWith("Ownable: caller is not the owner")
            
        })
    }

  );

















})
const { ethers } = require("hardhat"); 
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers"); 
const { expect } = require("chai"); 

describe("Token Contract", function() {
    async function deployedTokenFixture() {
        const [ owner, addressOne, addressTwo ] = await ethers.getSigners(); 
        const tokenContract = await ethers.getContractFactory("Token"); 
        const deployedTokenContract = await tokenContract.deploy(); 

        await deployedTokenContract.deployed(); 

        return { tokenContract, deployedTokenContract, owner, addressOne, addressTwo };
    }

    it("Deployment should assign the total supply of tokens to the owner", async function() {
        const { deployedTokenContract, owner } = await loadFixture(deployedTokenFixture); 

        const ownerBalance = await deployedTokenContract.balanceOf(owner.address); 
        expect(await deployedTokenContract.totalSupply()).to.equal(ownerBalance); 
    });

    it("Should transfer tokens between accounts", async function () {
        const { deployedTokenContract, owner, addressOne, addressTwo } = await loadFixture(deployedTokenFixture);
        
        await expect(
            deployedTokenContract.transfer(addressOne.address, 50)
        ).to.changeTokenBalances(deployedTokenContract, [owner, addressOne], [-50, 50]); 

        await expect(
            deployedTokenContract.connect(addressOne).transfer(addressTwo.address, 50)
        ).to.changeTokenBalances(deployedTokenContract, [addressOne, addressTwo], [-50, 50]); 
      
    }); 

    it("Should emit transfer events", async function() {
        const { deployedTokenContract, owner, addressOne, addressTwo } = await loadFixture(deployedTokenFixture); 

        await expect(deployedTokenContract.transfer(addressOne.address, 50))
         .to.emit(deployedTokenContract, "Transfer")
         .withArgs(owner.address, addressOne.address, 50); 
        
        await expect(deployedTokenContract.connect(addressOne).transfer(addressTwo.address, 50)) 
          .to.emit(deployedTokenContract, "Transfer") 
          .withArgs(addressOne.address, addressTwo.address, 50); 
        
    }); 

    // it("Should fail if sender doesn't have enough tokens", async function () {
    //     const { deployedTokenContract, owner, addressOne } = await loadFixture(deployedTokenFixture); 
        
    //     const initialOwnerBalance = await deployedTokenContract.balanceOf(owner); 

    //     await expect(deployedTokenContract.connect(addressOne).transfer(owner.address, 1)
    //     ).to.be.revertedWith("Not enough tokens"); 

    //     expect(deployedTokenContract.balanceOf(owner.address)).to.equal(initialOwnerBalance); 
    // }); 

    it("Should fail if sender doesn't have enough tokens", async function () {
        const { deployedTokenContract, owner, addressOne } = await loadFixture(
          deployedTokenFixture
        );
        const initialOwnerBalance = await deployedTokenContract.balanceOf(owner.address);
  
        // Try to send 1 token from addressOne (0 tokens) to owner.
        // `require` will evaluate false and revert the transaction.
        await expect(
          deployedTokenContract.connect(addressOne).transfer(owner.address, 1)
        ).to.be.revertedWith("Not enough tokens");
  
        // Owner balance shouldn't have changed.
        expect(await deployedTokenContract.balanceOf(owner.address)).to.equal(
          initialOwnerBalance
        );
    });
}); 
const { ethers } = require("hardhat");

async function main () {
   const [ deployer ]  = await ethers.getSigners(); 
   console.log("Deploying contract with the account: ", deployer.address);

   const accountBalance = await (deployer.getBalance()).toString(); 
   console.log("Account balance: ", accountBalance); 


   const tokenContract = await ethers.getContractFactory("Token"); 
   const deployedTokenContract = await tokenContract.deploy(); 
   await deployedTokenContract.deployed(); 

   console.log("Contract address: ", deployedTokenContract.address); 
} 

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
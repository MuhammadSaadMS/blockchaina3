const hre = require("hardhat");

async function main() {
  if (hre.network.name !== "sepolia") {
    console.warn(`Warning: deploying on '${hre.network.name}'. Expected 'sepolia'.`);
  }

  const ContractFactory = await hre.ethers.getContractFactory("MuhammadSaadSupplyChain");
  const contract = await ContractFactory.deploy();

  await contract.waitForDeployment();

  const deploymentTx = contract.deploymentTransaction();
  const contractAddress = await contract.getAddress();

  console.log("Network:", hre.network.name);
  console.log("Contract deployed to:", contractAddress);
  console.log("Deployment transaction hash:", deploymentTx.hash);
  console.log("Explorer:", `https://sepolia.etherscan.io/address/${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
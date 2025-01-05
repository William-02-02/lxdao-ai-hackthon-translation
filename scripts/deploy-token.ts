import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // 部署 USDT 代币合约
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.waitForDeployment();

  console.log("MockUSDT deployed to:", await mockUSDT.getAddress());

  // 部署 TranslationDAO 合约
  const TranslationDAO = await ethers.getContractFactory("TranslationDAO");
  const translationDAO = await TranslationDAO.deploy(await mockUSDT.getAddress());
  await translationDAO.waitForDeployment();

  console.log("TranslationDAO deployed to:", await translationDAO.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
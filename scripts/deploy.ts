import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TranslationDAO = await ethers.getContractFactory("TranslationDAO");
  // 这里需要传入支付代币的地址
  const translationDAO = await TranslationDAO.deploy("YOUR_PAYMENT_TOKEN_ADDRESS");

  await translationDAO.waitForDeployment();

  console.log("TranslationDAO deployed to:", await translationDAO.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
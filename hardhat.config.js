require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
require("dotenv").config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  allowUnlimitedContractSize: true,
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  networks: {
    // localhost网络通常用于连接一个独立运行的以太坊客户端，比如ganache或通过npx hardhat node启动的本地Hardhat节点
    localhost: {
      chainId: 1337,
    },
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

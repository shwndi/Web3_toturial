require("@nomicfoundation/hardhat-toolbox");
//install dotenv
// require("dotenv").config()
require("@chainlink/env-enc").config()
const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //defaultNetwork: "hardhat",//默认harthad网络
  solidity: "0.8.28",
  networks: {
    sepolia:{
      //url: Alchemy(alchemy.com) Infura, QulickNode
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111 
    }
  },

  //手动
  // etherscan: {
  //   // Your API key for Etherscan
  //   // Obtain one at https://etherscan.io/
  //   apiKey: ETHERSCAN_APIKEY

  // },
  //自动化部署验证
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_APIKEY
    }
  }
  
};

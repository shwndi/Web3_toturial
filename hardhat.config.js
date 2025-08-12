require("@nomicfoundation/hardhat-toolbox");
//install dotenv
// require("dotenv").config()
require("@chainlink/env-enc").config()
// require("./tasks/deploy-fundMe")
// require("./tasks/interact-fundMe")
require("./tasks")
//-------------------------------------------
//hardhat deploy
require('hardhat-deploy');
// -------------------------------
// hardhat deploy ethers
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //defaultNetwork: "hardhat",//默认harthad网络
  solidity: "0.8.24",
  defaultNetwork: "hardhat", //默认hardhat网络
  mocha:{
    timeout:300000
  },
  networks: {
    sepolia:{
      //url: Alchemy(alchemy.com) Infura, QulickNode
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_2],
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
  },

  namedAccounts: {
    firstAccount: {
      default: 0, //这里的0是指第一个账户
      },
    secondAccount: {
      default: 1, //这里的1是指第二个账户
    },
  },
  gasReporter:{
    enabled: false
  }

};

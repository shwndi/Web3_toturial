require("@nomicfoundation/hardhat-toolbox");
//install dotenv
// require("dotenv").config()
require("@chainlink/env-enc").config()
const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //defaultNetwork: "hardhat",//默认harthad网络
  solidity: "0.8.28",
  networks: {
    sepolia:{
      //url: Alchemy(alchemy.com) Infura, QulickNode
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "842WN84IU1ZJ8CNSC16IEI1P23SF7CDBAV"
  },
};

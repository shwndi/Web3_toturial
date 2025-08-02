require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //defaultNetwork: "hardhat",//默认harthad网络
  solidity: "0.8.28",
  networks: {
    sepolia:{
      //url: Alchemy(alchemy.com) Infura, QulickNode
      url: "https://eth-sepolia.g.alchemy.com/v2/6bcT10xWViZ-FuWmQe5Sf",
      accounts:["c1096fd93c110a22efb5d401baaec65c92e36ac462d37eqrsdfasfasdfas"]
    }
  }
};

// 01-deploy :第一个部署脚本
// version:1
// function deployFunction(){
//     console.log("this is a deploy function")
// }
// module.exports = deployFunction
// verison:2 simple deploy script
// module.exports = async function (){
//     console.log("this is a deploy function")
// }
// version:3 add some information from hre


// const { getNamedAccounts } = require("hardhat")

// module.exports = async function (hre) {
//     const getNameAccount = hre.getNameAccount
//     const deployments = hre.deployments
//     console.log("this is a deploy function")
// }
//version:4  symple add some information from hre
const { network } = require("hardhat")
const { LOCK_TIME, development, networkConfig, CONFIRMATIONS } = require("../helper-hardhat-config.js");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const firstAccount = (await getNamedAccounts()).firstAccount
    console.log("FundMe deployed by:", firstAccount)
    const { deploy } = deployments
    let dataFeedAddr
    let confermations
    if (development.includes(network.name)) {
        dataFeedAddr = (await deployments.get("MockV3Aggregator")).address
        confermations = 0 //本地测试网络不需要确认数
    } else {
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
        confermations = CONFIRMATIONS //测试网络需要设置确认数
    }
    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, dataFeedAddr],
        log: true,
        waitConfirmations: confermations
    })
    console.log("FundMe deployed successfully")
    // remore deployments directory or add --reset flag if you redeploy the contract

    if (network.config.chainId == 11155111 && process.env.ETHERSCAN_APIKEY) {
        // console.log("waiting for 5 confirmations");
        // await fundMe.waitForDeployment();
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TIME, dataFeedAddr],
        });
    } else {
        console.log("network is not sepolia, verification skipped..");
    }
}
module.exports.tags = ["all", "fundMe"] //设置标签，方便在终端中使用命令进行部署

const { network } = require("hardhat");
const { development, DECIMAL, INITIAL_ANSWER } = require("../helper-hardhad-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
    if (development.includes(network.name)) {
        const firstAccount = (await getNamedAccounts()).firstAccount
        const { deploy } = deployments

        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true
        })
        console.log("mock deployed successfully")
    }else{
        console.log("environment is not local，mock contract deploment is skipped..")
    }
}
module.exports.tags = ["all", "mock"] //设置标签，方便在终端中使用命令进行部署
const { ethers, deployments, network } = require("hardhat")
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const { development } = require("../../helper-hardhat-config")

//集成测试中测试单元测试中无法覆盖的场景
development.includes(network.name)
    ? describe.skip
    : describe("test fundMe contract", async function () {
        let fundMe
        let firstAccount

        beforeEach(async function () {
            await deployments.fixture(["all"]) //加载所有的部署脚本
            firstAccount = (await getNamedAccounts()).firstAccount
            const deployment = await deployments.get("FundMe")
            fundMe = await ethers.getContractAt("FundMe", deployment.address)
        })
        // test fund and getFund successfully
        it("test fund and getFund successfully", async function () {
            //make sure target reached
            await fundMe.fund({ value: ethers.parseEther("0.5") }) //4200*0.5 = 2100
            // make sure window closed
            await new Promise(resolve => setTimeout(resolve, 180 * 1000))
            //make sure we can get reseipt
            const getFundTx = await fundMe.getFund()
            const reseipt = await getFundTx.wait()
            expect(reseipt).to
                .emit(fundMe, "FundMeWithdrawByOwner")
                .withArgs(ethers.parseEther("0.5"))

        })
        // test fund and reFund successfully
        it("test fund and reFund successfully", async function () {
            await fundMe.fund({ value: ethers.parseEther("0.1") }) //4200*0.1 = 420
            await new Promise(resolve => setTimeout(resolve, 181 * 1000))
            const reFundTx = await fundMe.refund()
            const resolve = await reFundTx.wait()
            expect(resolve).to.emit(fundMe, "RefundByFunder")
                .withArgs(firstAccount, ethers.parseEther("0.1"))
        })


    })
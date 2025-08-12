const { ethers, deployments } = require("hardhat")
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const {development} = require("../../helper-hardhat-config.js")

//you can only test where network is normal

// describe("test fundMe contract",async function(){
// this.timeout(1800000);

// it("test if the owner is msg.sender",async function () {
//     console.log("test begining..")
//     // this.timeout(1800000);
//     const [firstAccount] = await ethers.getSigners()
//     console.log("get first account")
//     const fundMeFactory = await ethers.getContractFactory("FundMe");
//     console.log("get contract factory")
//     const fundMe = await fundMeFactory.deploy(180);
//     console.log("waiting deploy..")
//     await fundMe.waitForDeployment();
//     console.log("fundme had deployed")
// // if terminal report " fundMe.owner() is not a function ",please check out FundMe.sol.
// // The owner variable must be in the public scope.
//     assert.equal((await fundMe.owner()), firstAccount.address)
// })
// it("test if the fundFeed is assigned correctly ",async function () {
//     // this.timeout(1800000);
//     const fundMeFactory = await ethers.getContractFactory("FundMe");
//     const fundMe = await fundMeFactory.deploy(180);
//     await fundMe.waitForDeployment();
//     assert.equal((await fundMe.fundFeed()), "0x694AA1769357215DE4FAC081bf1f309aDC325306")
// })
!development.includes(network.name)?describe.skip:
describe("test fundMe contract", async function () {
    let fundMe
    let fundMeSecondAccount
    let firstAccount
    let mockV3Aggregator
    let secondAccount
    beforeEach(async function () {
        await deployments.fixture(["all"]) //加载所有的部署脚本
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount
        const deployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", deployment.address)
        fundMeSecondAccount = await ethers.getContract("FundMe", secondAccount)
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        console.log("after fixture:", await ethers.provider.getBalance(fundMe.target));
    })

    it("test if the owner is msg.sender", async function () {
        await fundMe.waitForDeployment();
        assert.equal((await fundMe.owner()), firstAccount)
    })

    it("test if the fundFeed is assigned correctly ", async function () {
        await fundMe.waitForDeployment();
        assert.equal((await fundMe.fundFeed()), mockV3Aggregator.address)
    })
    // fund ,getFund, refund
    // unit test for fund function
    //  window open, value greater than minimun value, funder balance
    it("window closed, value greater than minimun value, fund failed",
        async function () {
            await helpers.time.increase(200) //增加时间
            await helpers.mine()
            await expect(fundMe.fund({ value: ethers.parseEther("0.1") }))
                .to.be.revertedWith("window not closed")
        }
    )
    it("window open, value less than minimun value, fund failed",
        async function () {
            expect(fundMe.fund({ value: ethers.parseEther("0.01") }))
                .to.be.revertedWith("send more ETH")
        }
    )
    it("window open, value greater than minimun value, not funder balance",
        async function () {
            await fundMe.fund({ value: ethers.parseEther("0.1") })
            const balance = await fundMe.funderToAmount(firstAccount)
            expect(balance).to.equal(ethers.parseEther("0.1"))
        }
    )
    // unit test for getFund function
    // only owner, window closed, target reached
    it("not owner ,window closed, target reached,getFund failed", async function () {
        // make sure the target is reached
        await fundMe.fund({ value: ethers.parseEther("1") })
        //make sure the window is closed
        await helpers.time.increase(200) //增加时间
        await helpers.mine()
        //use second account to call getFund
        expect(fundMeSecondAccount.getFund()).to.be.revertedWith("this function can only be called by owner")
    })
    it("only owner  ,window open, target reached, getFund failed", async function () {
        // make sure the target is reached
        await fundMe.fund({ value: ethers.parseEther("1") })
        await expect(fundMe.getFund())
            .to.be.revertedWith("window is not closed")
    })
    it("only owner, window closed, target not reached, getFund failed ", async function () {
        // make sure the target not reached
        await fundMe.fund({ value: ethers.parseEther("0.1") })
        //make sure the window is closed
        await helpers.time.increase(200) //增加时间
        await helpers.mine()
        await expect(fundMe.getFund()).to.be.revertedWith("Target is not reached")
    })
    it("only owner, window closed ,target reached ,getFund successed", async function () {
       
        console.log("before: the balance of first account  "+ (await fundMe.funderToAmount(firstAccount)))
        await fundMe.fund({ value: ethers.parseEther("1") })
        console.log("after: the balance of first account  "+ (await fundMe.funderToAmount(firstAccount)))
        await helpers.time.increase(200)
        await helpers.mine()
        await expect(fundMe.getFund())
            .to.emit(fundMe, "FundMeWithdrawByOwner")
            .withArgs(ethers.parseEther("1"))
    })
    // refund
    //window closed, target not reached, funder has balance
    it("window open,target not reached ,refund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") })
        await expect(fundMe.refund()).to.be.revertedWith("window is not closed")
    })

    it("window closed, target reached, funder has balance, refund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("1") })
        await helpers.time.increase(200)
        await helpers.mine()
        await expect(fundMe.refund()).to.be.revertedWith("target is reached")
    })

    it("window closed, target not reached, funder hasn`t balance, refund failed", async function () {
        await fundMe.fund({value: ethers.parseEther("0.1")})
        await helpers.time.increase(200)
        await helpers.mine()
        await expect(fundMeSecondAccount.refund())
            .to.be.revertedWith("there is no fund for you")
    })
    it("window closed, target not reached, funder has balance", async function () {
        it("window closed, target not reached, funder hasn`t balance, refund failed", async function () {
            await fundMe.fund({ value: ethers.parseEther("0.1") })
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(fundMe.refund())
            .to.emit(fundMe,"RefundByFunder")
            .withArgs(firstAccount, ethers.parseEther("0.1"))
        })
    })
})
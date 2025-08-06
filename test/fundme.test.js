const { ethers } = require("hardhat")
const {assert}  = require("chai")

//you can only test where network is normal

describe("test fundMe contract",async function(){
    // this.timeout(1800000);
    it("test if the owner is msg.sender",async function () {
        console.log("test begining..")
        // this.timeout(1800000);
        const [firstAccount] = await ethers.getSigners()
        console.log("get first account")
        const fundMeFactory = await ethers.getContractFactory("FundMe");
        console.log("get contract factory")
        const fundMe = await fundMeFactory.deploy(180);
        console.log("waiting deploy..")
        await fundMe.waitForDeployment();
        console.log("fundme had deployed")
    // if terminal report " fundMe.owner() is not a function ",please check out FundMe.sol.
    // The owner variable must be in the public scope.
        assert.equal((await fundMe.owner()), firstAccount.address)
    })
    it("test if the fundFeed is assigned correctly ",async function () {
        // this.timeout(1800000);
        const fundMeFactory = await ethers.getContractFactory("FundMe");
        const fundMe = await fundMeFactory.deploy(180);
        await fundMe.waitForDeployment();
        assert.equal((await fundMe.fundFeed()), "0x694AA1769357215DE4FAC081bf1f309aDC325306")
    })
})
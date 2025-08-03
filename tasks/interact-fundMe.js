const { ethers } = require("hardhat");
const {task} = require("hart/config")

task("interact-fundMe")
.addParam("addr","fundMe contract address")
.setAction(async(taskArgs,her)=>{
   const fundMeFactory =  await ethers.getContractFactory()
   const fundMe =  fundMeFactory.attach(taskArgs.addr)
// step 1: init 2 accounts
  const [firstAccount, secondAccount] = await ethers.getSigners();
  // step 2: funt contract with first account
  //parseEthre 对数字进行转换
  const fundTx = await fundMe.fund({ value: ethers.parseEther("0.5") });
  await fundTx.wait()
  // step 3: check balance of contract
  const balanceOfContrant = await ethers.provider.getBalance(fundMe.target)
  console.log(`balance of the constant is ${balanceOfContrant}`)

  // step 4: funt contract with second account
  // console.log("Second account address:", secondAccount.address);
  // const secondAccountBalance = await ethers.provider.getBalance(secondAccount.address);
  // console.log("Second account ETH balance:", ethers.formatEther(secondAccountBalance));

  const secondFundTX = await fundMe.connect(secondAccount).fund({ value: ethers.parseEther("0.5") })
  await secondFundTX.wait()
  // step 5 :check balance of contract
  const balanceOfContract2 = await ethers.provider.getBalance(fundMe.target)
  console.log(`balance of the contract is ${balanceOfContract2}`)
  // step 6 :check mapping fundersToAmount
  const firstAccountbalanceInFundMe = await fundMe.funderToAmount(firstAccount.address)
  const secondAccountbalanceInFundMe = await fundMe.funderToAmount(secondAccount.address)
  console.log(`the first account balance ${firstAccount.address} is ${firstAccountbalanceInFundMe}`)
  console.log(`the second account balance ${secondAccount.address} is ${secondAccountbalanceInFundMe}`)

})

module.export = {}
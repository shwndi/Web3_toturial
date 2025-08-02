// import ether.js
//create main function
//execute main functionyt

const { ethers } = require("hardhat")

async function main() {
  //create contract
  const fundMeFactory = await ethers.getContractFactory("FundMe")
  console.log("contract deploying")

  //deploy the contract
  const fundMe = await fundMeFactory.deploy(300);
  await fundMe.waitForDeployment();

  console.log("contract has been deployed successfully, contract address is " + fundMe.target)
  // console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`)


  // 判断用的哪个网络，本地测试不用验证,测试网找网络id：chainlist
  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_APIKEY) {
    // verify fundme
    await fundMe.deploymentTransaction().wait(5);
    console.log("waiting for 5 confirmations")
    await verifyFundMe(fundMe.target, 300)
  } else {
    console.log("verification skipped..")
  }
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

}

async function verifyFundMe(fundMeAddr, args) {
  await hre.run("verify:verify", {
    address: fundMeAddr,
    constructorArguments: [args],
  });
}
//main 表示将函数作为参数
//mian()表示要执行该函数
main().then().catch((error) => {
  console.error(error)
  //正常结束用0 ，异常结束用1
  process.exit(1)
})
// import ether.js
//create main function
//execute main functionyt

const { ethers } = require("hardhat")

async function main(){
//create contract
  const  fundMeFactory  = await ethers.getContractFactory("FundMe")
  console.log("contract deploying")
//deploy the contract
    const fundMe = await fundMeFactory.deploy(10);
    await fundMe.waitForDeployment();
    console.log("contract has been deployed successfully, contract address is " + fundMe.target )
    console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`)
}
//main 表示将函数作为参数
//mian()表示要执行该函数
main().then().catch((error)=>{
  console.error(error)
  //正常结束用0 ，异常结束用1
  process.exit(1)
})
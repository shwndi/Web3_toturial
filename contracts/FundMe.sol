// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

//发布出现问题看这里！！！

// 这里使用Remix在线编写，同时使用了DOC 因此要部署到测试网络上，环境选择Injected Provider - MetaMask
//我在选择环境的时候找不到走了很多弯路，在这里只需要先提交 git (防止代码丢失)，然后浏览器清缓存、刷新页面、换个类型浏览器，差不多就解决问题了！
//我是从 Edge 换成 Chrome 解决的，edge 太卡了 环境刷新出来，下面的账户连不上！

/*
1、require  ：满足条件继续执行，不满足显示指定的错误
2、oracle   : 为什么使用预言机（off-chain 随机、on-chain 共识 进行交互）
    目前的合约中 oracle 的作用是提供给合约当前 Eth 的价格
3、Eth 和 Usd 的转换：预言机funtFeed.latestRoundData() 获取价格Eth/Usd
    Eth/Usd 不同于数学除法表达，这里省略了倒数写法，表示一个Eth = N * Usd
    其中：answer 有八位小数例如：ETH/USD 的价格为 2000.12345678 美元，预言机就返回200012345678
    这时我们想要将以太币转换为美元 ，就需要将以太币乘以 200012345678 然后除以 10
    10^8 表示 10 的 8 次方，即amoun *（ 200012345678 / 10^8） 
4、 变量后续不会修改的使用constant来表修饰，转化为常量

*/ 
contract FundMe{
    // 1、创建一个筹款功能
    // 2、记录参与筹款的名称
    // 3、在锁定期内，达到目标，生产商提款
    // 4、在锁定期外，未达成目标的投资人退款
    uint256 constant MAX_VALUE = 100 * 10 ** 18;

    mapping(address funder => uint256 amount) public funderToAmount;
    AggregatorV3Interface public fundFeed;

    uint256 constant TARGET = 1000 * 10 ** 18;

    address public owner;

    uint256 deploymentTimestamp;

    uint256 lockTime;

    address erc20Addr;

    bool public getFundSuccess = false;
    
    constructor(uint256 _lockTime) {
        fundFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);    
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }
    
    //因为是测试合约，这里留了一个后门，防止测试币取不出来
    function transferOut() external {
        payable(msg.sender).transfer(address(this).balance);
    }

    function setErc20Addr(address _erc20Addr) public onlyOwner{
        erc20Addr = _erc20Addr;
    }

    function setFunderToAmount(address funder,uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr , "you do not have permission to call this function !");
        funderToAmount[funder] = amountToUpdate;
    }

    function fund() external payable {
        //断言语句，如果为false 执行“，”后里的内容
        require(converEthToUsd(msg.value) >= MAX_VALUE,"send more ETH");
        require(block.timestamp < deploymentTimestamp + lockTime,"window not closed");
        funderToAmount[msg.sender] = msg.value;
    }

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = fundFeed.latestRoundData();
        return answer;
    }

    function converEthToUsd(uint256 amount) private view returns (uint256){
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return amount*ethPrice/10**8;
    }

    function transferOwnerShip(address newOwner) external onlyOwner{
        owner = newOwner;
    }


    function getFund() external  windowClosed onlyOwner{
        require(converEthToUsd(address(this).balance) >= TARGET, "Target is not reached");

        /*
        三种转账方式：
        1、transfer ：纯转账 transfer eth and revert if tx failed
        2、send     ：纯转账 transfer eth and return false if tx failed 
        3、call     ：转账+调用/带有数据操作
        */ 
        //payable(msg.sender).transfer(address(this).balance);
        //bool success = payable(msg.sender).send(address(this).balance);
        bool success;
        (success,) = payable(msg.sender).call{value: address(this).balance}("");
        require(success,"tx is failed");  
        funderToAmount[msg.sender] = 0;
        getFundSuccess = true;
    }

     function refund() external windowClosed {
        require(converEthToUsd(address(this).balance) < TARGET,"target is reached");   
        require(funderToAmount[msg.sender] != 0,"there is no fund for you");
        bool success;
        (success,) = payable(msg.sender).call{value: funderToAmount[msg.sender]}("");
        require(success,"tx is failed");
        funderToAmount[msg.sender] = 0;
    }
    // _;  ： 放在 require 下面表示先执行 require ，再执行修饰函数部分，放在上面顺序反过来
    modifier windowClosed{
        require(block.timestamp >= deploymentTimestamp + lockTime,"window is not closed");
        _;
    }
    modifier onlyOwner{
       require(msg.sender == owner ,"this functon can only be called by owner");
       _; 
    }

    
}
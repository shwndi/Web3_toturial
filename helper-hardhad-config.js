const DECIMAL = 8
const INITIAL_ANSWER = 300000000000
LOCK_TIME = 180
development = ["hardhat", "localhost"]
networkConfig = {
    11155111: {
        ethUsdDataFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    97: {
        ethUsdDataFeed: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e"
    }
}
const CONFIRMATIONS = 5 //设置确认数

module.exports = {
    DECIMAL,
    INITIAL_ANSWER,
    LOCK_TIME,
    development,
    CONFIRMATIONS,
    networkConfig
}
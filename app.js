const fs = require('fs'); // to access filesystem
const data = require('./binanceHistData') //module to get historical data
const exchange = 'BIN';   // Supported exchange: BIN
const pair = 'BTCUSDT';   // pairs to trade
const interval = '1d';   // Supported Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
const sellpercent = 1.05; // how much to buy
const buypercent = 1.05; // how much to sell

var moment = require('moment');
var initialFunds = 1000; // starting balance
var funds = initialFunds;
var coins = 0; // holds purchased coins
var historicalData = {}; // object to hold the json file data
var openedPositions = 0; // holds number of trading positions open
var buyPrice = 0;
var sellPrice = 0;
var position = 0; // if position is open, we start with no open positions
var totalProfit = 0;

function loadJson() {
    historicalData = JSON.parse(fs.readFileSync(__dirname + '/data/' + exchange + '_' + pair + '_' + interval + '.json', 'utf8'));
    console.log('JSON loaded')
    main();
}

function main() {
for (index = 1; index < historicalData.length; index++) { 
    if (position == 0) { // Buy
        if (parseFloat(historicalData[index][4]) < parseFloat(historicalData[index-1][4] * buypercent)) { // if current price is less than previous
            buyPrice = parseFloat(historicalData[index][4]);
            var buyDate = new Date(historicalData[index][0]);
            coins = funds / buyPrice;
            position = 1;
            openedPositions ++ ;
            funds = funds - coins * buyPrice;
            console.log(moment(buyDate).format('LLL') + ', ' + pair + ', ' + 'BUY ' + ', ' + coins.toFixed(2) + ' @ ' + buyPrice.toFixed(2) + ', ' + 'balance=' + funds.toFixed(2));
        }
    }
    if (position == 1) { // Sell
        if (parseFloat(historicalData[index][4]) >= (buyPrice * sellpercent)) {
            sellPrice = parseFloat(historicalData[index][4]);
            var sellDate = new Date(historicalData[index][0]);
            funds = sellPrice * coins;
            var profit = funds - initialFunds;
            position = 0;
            console.log(moment(sellDate).format('LLL') + ', ' + pair + ', ' + 'SELL' + ', ' + coins.toFixed(2) + ' @ ' + sellPrice.toFixed(2) + ', ' + 'profit=' +profit.toFixed(2) + ', ' + 'balance=' + funds.toFixed(2));
            coins = 0;
            totalProfit = profit;
            profit = 0;
        }
    }
}
// Show some text in the console with red Color
console.log("[31mSTATS[39m");
console.log('Total positions opened', openedPositions);
console.log('Total Profit', totalProfit.toFixed(2));
console.log('End Balance', funds);
console.log('Interval', interval);
}

data.getHistoricalData(exchange, pair, interval, (errorMessage, results) => { // need to improve the error handling
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        loadJson();
    }
});
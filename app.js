// module includes

const fs = require('fs');  // to access filesystem
const data = require('./binanceHistData')  // My module to get historical data
const moment = require('moment'); // for date formatting

// change these as required

const exchange = 'BIN';  // Supported exchange: BIN
const pair = 'BTCUSDT';  // Supported pairs: too many look in the documentation
const interval = '1m';  // Supported Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
const sellpercent = 1.10; // When price goes up by this much, sell.
const buypercent = 1.05; // When price goes down by this much, buy.
const initialFunds = 10000; // Starting balance

// app variables

var funds = initialFunds; // used in profit calculation
var coins = 0; // holds purchased coins
var historicalData = {}; // object to hold the json file data
var openedPositions = 0; // holds number of trading positions open
var buyPrice = 0; // holds buy price
var sellPrice = 0; // holds sell price
var position = 0; // if position is open, we start with no open positions
var totalProfit = 0; // holds profit made

// load historical data from file


function loadJson() {
    historicalData = JSON.parse(fs.readFileSync(__dirname + '/data/' + exchange + '_' + pair + '_' + interval + '.json', 'utf8'));
    main();
}

// main

console.log('Starting Portfolio =', initialFunds);

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

// console logging // summary

var startDate = new Date(historicalData[0][0]);
var end = historicalData.length;
//var endDate = new Date(historicalData[end][0]);
console.log(historicalData.length);
console.log('Start date', moment(startDate).format('LLL'));
//console.log('End date', moment(endDate).format('LLL'));
console.log('Total positions opened', openedPositions);
console.log('Total Profit', totalProfit.toFixed(2));
console.log('End Balance', funds);
console.log('Interval', interval);
}

// get latest data from binance

data.getHistoricalData(exchange, pair, interval, (errorMessage, results) => { // need to improve the error handling
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        loadJson();
    }
});
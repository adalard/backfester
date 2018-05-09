const fs = require('fs'); // to access filesystem
const data = require('./binanceHistData') //module to get historical data
const exchange = 'BIN';   // Supported exchange: BIN
const pair = 'BTCUSDT';   // pairs to trade
const interval = '1d';   // Supported Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
const sellpercent = 1.30; // how much to buy
const buypercent =1.30;

var coinBalance = 0;
var historicalData = {}; // object to hold the json file data
var openedPositions = 0; // holds number of trading positions open
var openedPositionPrice = 0;
var position = 0; // if position is open, we start with no open positions

function loadJson() {
    historicalData = JSON.parse(fs.readFileSync(__dirname + '/data/' + exchange + '_' + pair + '_' + interval + '.json', 'utf8'));
    console.log('JSON loaded')
    main();
}

function main() {
for (index = 1; index < historicalData.length; index++) { 
    if (position == 1) { // if we have an open position - look to sell
        if (parseInt(historicalData[index][4]) >= (openedPositionPrice * sellpercent)) {
            console.log(historicalData[index][0], index, pair, 'sold at', parseInt(historicalData[index][4]))
            coinBalance = coinBalance + (historicalData[index][4] - openedPositionPrice)
            position = 0;
        }
    }
    if (position == 0) { // if we dont have an open position look to buy
        if (parseInt(historicalData[index][4]) < parseInt(historicalData[index-1][4] * buypercent)) { // if current price is less than previous
            openedPositionPrice = parseInt(historicalData[index][4]);
            console.log(historicalData[index][0], index, pair, 'bought at', openedPositionPrice);
            position = 1;
            openedPositions ++ ;
        }
    }
}
console.log('Total positions opened', openedPositions);
console.log('Total profit', coinBalance);
console.log('Interval', interval);
}

data.getHistoricalData(exchange, pair, interval, (errorMessage, results) => { // need to improve error handling
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        loadJson();
    }
});
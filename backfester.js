const fs = require('fs'); // to access filesystem
var data = require('./binanceHistData')
const exchange = 'BIN';   // Supported: BIN
const pair = 'BTCUSDT';   // pairs to trade
const interval = '1m';   // Supported Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M

var coinBalance = 0;
var historicalData = {}; // object to hold the json file data
var openedPositions = 0; // holds number of trading positions open
var openedPositionPrice = 0;
var position = 0; // if position is open
var sellpercent = 1.10

// read json array in to historicalData array
historicalData = JSON.parse(fs.readFileSync(__dirname + '/data/' + exchange + '_' + pair + '_' + interval + '.json', 'utf8'));

var start = new Date(historicalData[0][0]); // convert to human dates
var end = new Date(historicalData[historicalData.length - 1][0]);

for (index = 1; index < historicalData.length; index++) { 
    if (position == 1) { // if we have an open position - look to sell
        if (parseInt(historicalData[index][4]) >= (openedPositionPrice * sellpercent)) {
            console.log(historicalData[index][0], index, pair, 'sold at', parseInt(historicalData[index][4]))
            coinBalance = coinBalance + (historicalData[index][4] - openedPositionPrice)
            position = 0;
        }
    }
    if (position == 0) { // if we dont have an open position look to buy
        if (parseInt(historicalData[index][4]) < parseInt(historicalData[index-1][4])) { // if current price is less than previous
            openedPositionPrice = parseInt(historicalData[index][4]);
            console.log(historicalData[index][0], index, pair, 'bought at', openedPositionPrice)
            position = 1;
            openedPositions ++;
        }
    }

}

console.log('Total positions opened', openedPositions);
console.log('Total profit', coinBalance);
console.log('Start date', start);
console.log('End date', end);
console.log('Interval', interval);
const fs = require('fs'); // to access filesystem
const data = require('./binanceHistData') //module to get historical data
const exchange = 'BIN';   // Supported exchange: BIN
const pair = 'BTCUSDT';   // pairs to trade
const interval = '1d';   // Supported Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
const sellpercent = 1.20; // how much to buy
const buypercent = 1.20;

var funds = 1000;
var historicalData = {}; // object to hold the json file data
var openedPositions = 0; // holds number of trading positions open
var buyPrice = 0;
var sellPrice = 0;
var position = 0; // if position is open, we start with no open positions

function loadJson() {
    historicalData = JSON.parse(fs.readFileSync(__dirname + '/data/' + exchange + '_' + pair + '_' + interval + '.json', 'utf8'));
    console.log('JSON loaded')
    main();
}
function main() {
for (index = 1; index < historicalData.length; index++) { 
    if (position == 0) { // Sell
        if (parseFloat(historicalData[index][4]) >= (buyPrice * sellpercent)) {
            sellPrice = parseFloat(historicalData[index][4]);
            var poo = new Date(historicalData[index][0]);
            //funds = funds + sellPrice;
            position = 0;
            console.log(poo + ', ' + pair + ', ' + 'SELL' + ', ' + sellPrice + ', ' + 'balance=', funds);
        }
    }
    if (position == 0) { // Buy
        if (parseFloat(historicalData[index][4]) < parseFloat(historicalData[index-1][4] * buypercent)) { // if current price is less than previous
            buyPrice = parseFloat(historicalData[index][4]);
            var poo = new Date(historicalData[index][0]);
            position = 1;
            openedPositions ++ ;
            console.log(poo + ', ' + pair + ', ' + 'BUY ' + ', ' + buyPrice + ', ' + 'balance= ' + funds);
        }
    }
}
console.log('Total positions opened', openedPositions);
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
// Supported Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
const fs = require('fs');
const now = new Date();
var request = require('request-promise');
const options = {
    method: 'GET',
    uri: 'https://api.binance.com/api/v1/klines?',
    qs: {
        symbol: 'BTCUSDT',
        interval: '12h'
    }
};

exports.historicalData = function getHistData () {
request(options)
    .then(function (response) {
        fs.writeFile("BIN_" + options.qs.symbol + "_" + options.qs.interval + ".json", (response), (err) => {
            if (err) {
                console.error(err);
            };
            console.log(now, "BIN_" + options.qs.symbol + "_" + options.qs.interval + ".json has been created :-)")
        });
    })
    .catch(function (err) {
        console.log(err)
    })
}

/* JSON Array formatting:

  1:  1499040000000,      // Open time
  2:  "0.01634790",       // Open
  3:  "0.80000000",       // High
  4:  "0.01575800",       // Low
  5:  "0.01577100",       // Close
  6:  "148976.11427815",  // Volume
  7:  1499644799999,      // Close time
  8:  "2434.19055334",    // Quote asset volume
  9:  308,                // Number of trades
 10:  "1756.87402397",    // Taker buy base asset volume
 11:  "28.46694368",      // Taker buy quote asset volume
 12:  "17928899.62484339" // Ignore

*/
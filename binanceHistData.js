const fs = require('fs');
var request = require('request-promise');

var getHistoricalData = (exchange, pair, interval, callback) => {
    const options = {
        method: 'GET',
        uri: 'https://api.binance.com/api/v1/klines?',
        qs: {
            symbol: pair,
            interval: interval
        }
    };
request(options)
    .then(function (response) {
        fs.writeFile(__dirname + '/data/' + exchange + "_" + pair + "_" + interval + ".json", (response), (err) => {
            if (err) {
                callback('File could not be created ...');
            };
            console.log("BIN_" + options.qs.symbol + "_" + options.qs.interval + ".json has been created :-)")
            callback(undefined, {

            })
        });
    })
    .catch(function (err) {
        console.log(err)
    })
}

module.exports.getHistoricalData = getHistoricalData;

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



 // Supported Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M

*/
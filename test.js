// var Apriori = require('apriori/apriori.js');
// var Apriori = require('apriori/convertToBinary.js');
// var Apriori = require('apriori/I2-apriori.js');
var Apriori = require('apriori');

new Apriori.Algorithm(0.2, 0.6, true).showAnalysisResultFromFile('test.csv');
// new Apriori.Algorithm(0.3, 0.6, true).showAnalysisResultFromFile('database/transaction-5000.csv');

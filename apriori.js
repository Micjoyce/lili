var Apriori = require('apriori');
// new Apriori.Algorithm(0.2, 0.6, true).showAnalysisResultFromFile('test.csv');
// new Apriori.Algorithm(0.3, 0.6, true).showAnalysisResultFromFile('source.csv');
// new Apriori.Algorithm(0.9, 0.6, true).showAnalysisResultFromFile('in1.csv');
// new Apriori.Algorithm(0.15, 0.6, true).showAnalysisResultFromFile('dataset.csv');
// new Apriori.Algorithm(0.05, 0.6, true).showAnalysisResultFromFile('database/T40I10D100K.csv');
new Apriori.Algorithm(0.3, 0.6, true).showAnalysisResultFromFile('database/transaction-25000.csv');
// new Apriori.Algorithm(0.7, 0.6, true).showAnalysisResultFromFile('database/mush-data.csv');

// var async = require("async");
// var Apriori = require("apriori/apriori.js");
// var I2Aprirori = require("apriori/I2-apriori.js");
// var ConvertToBinary = require("apriori/convertToBinary.js");

// var testData = ['database/mush-data.csv'];

// var supportArray = [ 0.6, 0.7, 0.8, 0.9];
// async.waterfall([
//     function(cb) {
//         new Apriori.Algorithm(0.6, true).showAnalysisResultFromFile(testData[0]);
//     	//convertToBinary
//     	// async.each(supportArray, function(support, _cb){    
//     	    // var convertToBinary = new ConvertToBinary.Algorithm(support, true);
//             // var result = convertToBinary.showAnalysisResultFromFile(testData[0]);
//             // if (result) {
//     		  // _cb(undefined);
//             // };
//     	// }, function(err){
//     		// if (err) {console.log(err); return;};
//     		cb(undefined)
//     	// });
//     },
//     function(cb) {
//     	//I2Apriori
//     	async.each(supportArray, function(support, _cb){
    		
//     		_cb(undefined);
//     	}, function(err){
//     		if (err) {console.log(err); return;};
//     		cb(undefined)
//     	});
//     },
//     function(cb) {
//     	//apriori
//     	async.each(supportArray, function(support, _cb){
    		
//     		_cb(undefined);
//     	}, function(err){
//     		if (err) {console.log(err); return;};
//     		cb(undefined)
//     	});
//     }
// ], function(err, result) {
//     if (err) {
//         console.log(err);
//         return;
//     };
//     console.log("done")
// });

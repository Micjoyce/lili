// var Apriori = require('./apriori/zhaoguanbao-bitxor');
// var Apriori = require('./apriori/zhaoguanbao-bitxor-raw-calc');
// var Apriori = require('./apriori/I8-bit-improve-apriori-one');
// var Apriori = require('./apriori/I8-bit-improve-apriori-one-raw-calc');
// var Apriori = require('./apriori/I8-bit-improve-apriori-one-ab-c');
// var Apriori = require('./apriori/I8-bit-improve-apriori-one-ab-c-rm-dup');
// var Apriori = require('./apriori/I8-bit-improve-apriori-one-ab-c-rm-dup-bit-num');
var Apriori = require('./apriori/I8-bit-improve-apriori-one-ab-c-rm-dup-bit-num-filter-citem');
// var Apriori = require('./apriori/apriori');
// new Apriori.Algorithm(0.2, 0.6, true).showAnalysisResultFromFile('test.csv');
// new Apriori.Algorithm(0.3, 0.6, true).showAnalysisResultFromFile('source.csv');
// new Apriori.Algorithm(0.9, 0.6, true).showAnalysisResultFromFile('in1.csv');
// new Apriori.Algorithm(0.15, 0.6, true).showAnalysisResultFromFile('dataset.csv');
// new Apriori.Algorithm(0.4, 0.6, true).showAnalysisResultFromFile('database/T40I10D100K.csv');
// new Apriori.Algorithm(0.10, 0.6, true, './test-result/support').showAnalysisResultFromFile('database/T1014D100K.csv');
// new Apriori.Algorithm(0.3, 0.6, true).showAnalysisResultFromFile('database/transaction-5000.csv');
new Apriori.Algorithm(0.3, 0.6, true, './test-result/support').showAnalysisResultFromFile('database/mush-data.csv');



// var config = {
// 	methods: [
// 		// './apriori/apriori'
// 		'./apriori/zhaoguanbao-bitxor-raw-calc',
// 		'./apriori/I8-bit-improve-apriori-one-ab-c-rm-dup-bit-num'
// 	],
// 	datas: [
// 		{
// 			name: "T1014D100K",
// 			minSupports: [0.02, 0.04, 0.06, 0.08, 0.10]
// 		},
// 		{
// 			name: "mush-data",
// 			minSupports: [0.3, 0.4, 0.5, 0.6, 0.7]
// 		},
// 	],
// 	statisticsFileUrl: "./result-data-0927/statistics.csv"
// }

// var async = require("async");
// var json2csv = require('json2csv');
// var statisticData = [];


// async.eachLimit(config.methods,1,function(method, cb){
// 	var Apriori = require(method);
// 	var methodFileName = method.replace("./apriori", "");
// 	async.eachLimit(config.datas, 1, function(data, _cb){


// 		var minSupports = data.minSupports;
// 		async.eachLimit(minSupports, 1, function(minSupport, __cb){
// 			var saveResultUrl = './result-data-0927' + methodFileName;
// 			var rawDataUrl = 'database/' + data.name + ".csv";
// 			console.log("--------------------休息2秒后再执行------------------------")
// 			var timer = setTimeout(function(){
// 				new Apriori.Algorithm(minSupport, 0.6, true, saveResultUrl).showAnalysisResultFromFile(rawDataUrl, function(calcTime){
// 					var statistics = {
// 						method: method,
// 						dataName: data.name,
// 						minSupport: minSupport,
// 						time: calcTime.value
// 					}

// 					statisticData.push(statistics);
// 					console.log(saveResultUrl, rawDataUrl);
// 					__cb();
// 				});
// 			}, 1);
// 		}, function(__err){

// 			_cb(__err);
// 		});


// 	}, function(_err){

// 		cb(_err);
// 	});

// }, function(err){
// 	if(!err){
// 		console.log("success");
// 		// 保存统计结果
// 		json2csv({
//             data: statisticData,
//             fileds: ['method', 'dataName', 'minSupport' ,'time']
//         }, function(err, csv) {
//             if (err) throw err;
//             console.log("计算结果保存至:",config.statisticsFileUrl);
//             require("fs").writeFile(config.statisticsFileUrl, csv, function(err) {
//                 if (err) throw err;
//                 if (typeof callback === "function") {
//                     callback(calcuTime);
//                 }
//             });
//         });
// 	}
// })

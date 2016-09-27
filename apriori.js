// var Apriori = require('./apriori/zhaoguanbao-bitxor');
// var Apriori = require('./apriori/zhaoguanbao-bitxor-raw-calc');
// var Apriori = require('./apriori/I8-bit-improve-apriori-one');
// var Apriori = require('./apriori/I8-bit-improve-apriori-one-raw-calc');
// var Apriori = require('./apriori/I8-bit-improve-apriori-one-ab-c');
// var Apriori = require('./apriori/I8-bit-improve-apriori-one-ab-c-rm-dup');
// var Apriori = require('./apriori/I8-bit-improve-apriori-one-ab-c-rm-dup-bit-num');
// var Apriori = require('./apriori/apriori');
// new Apriori.Algorithm(0.2, 0.6, true).showAnalysisResultFromFile('test.csv');
// new Apriori.Algorithm(0.3, 0.6, true).showAnalysisResultFromFile('source.csv');
// new Apriori.Algorithm(0.9, 0.6, true).showAnalysisResultFromFile('in1.csv');
// new Apriori.Algorithm(0.15, 0.6, true).showAnalysisResultFromFile('dataset.csv');
// new Apriori.Algorithm(0.4, 0.6, true).showAnalysisResultFromFile('database/T40I10D100K.csv');
// new Apriori.Algorithm(0.10, 0.6, true, './result-data-0927/zhaoguanbao-bitxor-raw-calc').showAnalysisResultFromFile('database/T1014D100K.csv');
// new Apriori.Algorithm(0.3, 0.6, true).showAnalysisResultFromFile('database/transaction-5000.csv');
// new Apriori.Algorithm(0.3, 0.6, true, './result-data-0927/I8-bit-improve-apriori-one-ab-c-rm-dup-bit-num').showAnalysisResultFromFile('database/mush-data.csv');



var config = {
	methods: [
		// './apriori/apriori'
		'./apriori/zhaoguanbao-bitxor-raw-calc',
		'./apriori/I8-bit-improve-apriori-one-ab-c-rm-dup-bit-num'
	],
	datas: [
		{
			name: "T1014D100K",
			minSupports: [0.02, 0.04, 0.06, 0.08, 0.10]
		},
		{
			name: "mush-data",
			minSupports: [0.3, 0.4, 0.5, 0.6, 0.7]
		},
	]
}

var async = require("async");

async.eachLimit(config.methods,1,function(method, cb){
	var Apriori = require(method);
	var methodFileName = method.replace("./apriori", "");
	async.eachLimit(config.datas, 1, function(data, _cb){


		var minSupports = data.minSupports;
		async.eachLimit(minSupports, 1, function(minSupport, __cb){
			var saveResultUrl = './result-data-0927' + methodFileName;
			var rawDataUrl = 'database/' + data.name + ".csv";
			console.log("--------------------休息2秒后再执行------------------------")
			var timer = setTimeout(function(){
				new Apriori.Algorithm(minSupport, 0.6, true, saveResultUrl).showAnalysisResultFromFile(rawDataUrl, function(){
					console.log(saveResultUrl, rawDataUrl);
					__cb();
				});
			}, 2000);
		}, function(__err){

			_cb(__err);
		});


	}, function(_err){

		cb(_err);
	});


}, function(err){
	if(!err){
		console.log("success");
	}
})


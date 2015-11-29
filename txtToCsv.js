var fs = require('fs');
var json2csv = require('json2csv');
var allData;
var removeBlank = function (data){
	var resultArray = [];
	for(var i = 0, len = data.length; i < len; i++){
		var subData = data[i];
		subData = subData.split(" ");
		subData.pop();
		resultArray.push(subData.toString());
	}

	return resultArray;
}
fs.readFile("database/T40I10D100K.txt", 'utf8', function (err, data) {
	if(err){
		throw err
	}  
	else{
		allData = data.split('\n');
		var formatData =  removeBlank(allData);
		var resultStr = "";
		for(var i = 0, len = formatData.length; i < len; i++){
			var item = formatData[i];
			resultStr += item + "\n";
		}
		fs.writeFile("database/T40I10D100K.csv",resultStr, function(err){

		} )
	}
})

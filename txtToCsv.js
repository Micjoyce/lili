var fs = require('fs');
var json2csv = require('json2csv');
var allData;
var removeBlank = function (data){
	var resultArray = [];
	for(var i = 0, len = data.length; i < len; i++){
		var subData = data[i];
		subData = subData.split(" ");
		subData.pop();
		subData = subData.join(',');
		resultArray.push(subData);
	}

	return resultArray;
}
fs.readFile("in.txt", 'utf8', function (err, data) {
	if(err){
		throw err
	}  
	else{
		allData = data.split('\r\n');
		var formatData =  removeBlank(allData);
		var resultStr = "";
		for(var i = 0, len = formatData.length; i < len; i++){
			var item = formatData[i];
			resultStr += item + "\n";
		}
		fs.writeFile("in1.csv",resultStr, function(err){

		} )
	}
})

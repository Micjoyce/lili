var fs = require("fs");
var _ = require("lodash");

var originData = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

var createData = function(rows, maxColumns){
	var returnData = [];
	for (var rowLen = 0; rowLen < rows; rowLen++) {
		var columns = Math.ceil(Math.random() * maxColumns) + 1;
		var insertData = originData = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		// console.log(originData.length, "originData");
		// insertData = originData;
		var columnData = [];
		while(columns > 0){
			var cellDataPosition =Math.ceil(Math.random() * (insertData.length));
			var cellData = insertData.splice(cellDataPosition, 1);
			columnData.push(cellData);
			columns --;
		}
		returnData.push(columnData);
	};
	return returnData;
}

var formatData = function (data){
	var resultStr = "";
	for(var i = 0; i < data.length; i ++){
		var row = data[i];
		resultStr += row.toString() + "\n"
	}
	return resultStr;
}

var saveData = function(rows, maxColumns){
	var resultData = createData(rows, maxColumns);
	var data = formatData(resultData);
	fs.writeFile("source.csv", data, function(err){
		if(err) console.log(err);
	})
}

saveData(25000, 25);


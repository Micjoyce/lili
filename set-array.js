var _ = require('lodash');
var values = [
    [1, 3, 6, 7, 8, 9, 12, 14, 16, 18, 20, 22],
    [2, 5, 6, 7, 8, 9, 12, 14, 16, 18, 20, 22],
    [2, 4, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    [5, 12, 14, 16, 18, 20, 22],
    [1, 2, 4, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    [5, 6, 10, 11, 13, 15, 17, 19, 21]
];
var row = 0;
var column = values.length;
values.forEach(function(value) {
    var maxValue = _.max(value);
    if (maxValue > row) {
        row = maxValue;
    }
});
var createArray = function(column, row) {
    var arr = [];
    var resultArr = [];
    for (var i = 0; i < column; i++) {
        arr.push(0);
    }

    for (var j = 0; j < row; j++) {
        resultArr.push(arr);
    }
    return resultArr;
}
var bitArray = createArray(column, row);

for (var i = 0; i < values.length; i++) {
    var neatArray = values[i];
    for (var j = 0; j < neatArray.length; j++) {
        var position = neatArray[j];
        bitArray[position - 1][i] = 1;
    }
}

console.log(bitArray);

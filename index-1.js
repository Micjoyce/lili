var async = require("async");
var fs = require('fs');
var _ = require('lodash');
var json2csv = require('json2csv');
var _ = require('lodash');
var Combinatorics = require('js-combinatorics');

// var A1 = [{code:"RAD_O",val:219},{code:"RAD_I",val:204},{code:"LAB_I",val:194},{code:"LAB_O",val:207},{code:"ANE_I",val:192},{code:"ANE_O",val:193},{code:"OPE_I",val:298},{code:"OPE_O",val:89},{code:"ORP_O",val:62},{code:"ADM_I",val:70},{code:"ADM_O",val:71}];
// var A2 =[{code:"RAD_O-RAD_I",val:204},{code:"RAD_O-LAB_I",val:154},{code:"RAD_O-LAB_O",val:155},{code:"RAD_O-ANE_I",val:133},{code:"RAD_O-ANE_O",val:133},{code:"RAD_O-OPE_I",val:219},{code:"RAD_O-OPE_O",val:74},{code:"RAD_I-LAB_I",val:147},{code:"RAD_I-LAB_O",val:148},{code:"RAD_I-ANE_I",val:125},{code:"RAD_I-ANE_O",val:125},{code:"RAD_I-OPE_I",val:204},{code:"RAD_I-OPE_O",val:71},{code:"LAB_I-LAB_O",val:194},{code:"LAB_I-ANE_I",val:156},{code:"LAB_I-ANE_O",val:157},{code:"LAB_I-OPE_I",val:194},{code:"LAB_O-ANE_I",val:168},{code:"LAB_O-ANE_O",val:169},{code:"LAB_O-OPE_I",val:207},{code:"LAB_O-OPE_O",val:61},{code:"ANE_I-ANE_O",val:192},{code:"ANE_I-OPE_I",val:192},{code:"ANE_O-OPE_I",val:193},{code:"OPE_I-OPE_O",val:88},{code:"OPE_I-ORP_O",val:62},{code:"OPE_I-ADM_I",val:70},{code:"OPE_I-ADM_O",val:71},{code:"ADM_I-ADM_O",val:70}]; 
// var A3 =[{code:"RAD_O-RAD_I-LAB_I", val:147},{code:"RAD_O-RAD_I-LAB_O", val:148},{code:"RAD_O-RAD_I-ANE_I", val:125},{code:"RAD_O-RAD_I-ANE_O", val:125},{code:"RAD_O-RAD_I-OPE_I", val:204},{code:"RAD_O-RAD_I-OPE_O", val:71},{code:"RAD_O-LAB_I-LAB_O", val:154},{code:"RAD_O-LAB_I-ANE_I", val:124},{code:"RAD_O-LAB_I-ANE_O", val:124},{code:"RAD_O-LAB_I-OPE_I", val:154},{code:"RAD_O-LAB_O-ANE_I", val:124},{code:"RAD_O-LAB_O-ANE_O", val:124},{code:"RAD_O-LAB_O-OPE_I", val:155},{code:"RAD_O-ANE_I-ANE_O", val:133},{code:"RAD_O-ANE_I-OPE_I", val:133},{code:"RAD_O-ANE_O-OPE_I", val:133},{code:"RAD_O-OPE_I-OPE_O", val:74},{code:"RAD_I-LAB_I-LAB_O", val:147},{code:"RAD_I-LAB_I-ANE_I", val:118},{code:"RAD_I-LAB_I-ANE_O", val:118},{code:"RAD_I-LAB_I-OPE_I", val:147},{code:"RAD_I-LAB_O-ANE_I", val:118},{code:"RAD_I-LAB_O-ANE_O", val:118},{code:"RAD_I-LAB_O-OPE_I", val:148},{code:"RAD_I-ANE_I-ANE_O", val:125},{code:"RAD_I-ANE_I-OPE_I", val:125},{code:"RAD_I-ANE_O-OPE_I", val:125},{code:"RAD_I-OPE_I-OPE_O", val:71},{code:"LAB_I-LAB_O-ANE_I", val:156},{code:"LAB_I-LAB_O-ANE_O", val:157},{code:"LAB_I-LAB_O-OPE_I", val:194},{code:"LAB_I-ANE_I-ANE_O", val:156},{code:"LAB_I-ANE_I-OPE_I", val:156},{code:"LAB_I-ANE_O-OPE_I", val:157},{code:"LAB_O-ANE_I-ANE_O", val:168},{code:"LAB_O-ANE_I-OPE_I", val:168},{code:"LAB_O-ANE_O-OPE_I", val:169},{code:"LAB_O-OPE_I-OPE_O", val:61},{code:"ANE_I-ANE_O-OPE_I", val:192},{code:"OPE_I-ADM_I-ADM_O", val:70}];
// var A4 = [{code:"RAD_O-RAD_I-LAB_I-LAB_O",val:147},{code:"RAD_O-RAD_I-LAB_I-ANE_I",val:118},{code:"RAD_O-RAD_I-LAB_I-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_I-OPE_I",val:147},{code:"RAD_O-RAD_I-LAB_O-ANE_I",val:118},{code:"RAD_O-RAD_I-LAB_O-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_O-OPE_I",val:148},{code:"RAD_O-RAD_I-ANE_I-ANE_O",val:125},{code:"RAD_O-RAD_I-ANE_I-OPE_I",val:125},{code:"RAD_O-RAD_I-ANE_O-OPE_I",val:125},{code:"RAD_O-RAD_I-OPE_I-OPE_O",val:71},{code:"RAD_O-LAB_I-LAB_O-ANE_I",val:124},{code:"RAD_O-LAB_I-LAB_O-ANE_O",val:124},{code:"RAD_O-LAB_I-LAB_O-OPE_I",val:154},{code:"RAD_O-LAB_I-ANE_I-ANE_O",val:124},{code:"RAD_O-LAB_I-ANE_I-OPE_I",val:124},{code:"RAD_O-LAB_I-ANE_O-OPE_I",val:124},{code:"RAD_O-LAB_O-ANE_I-ANE_O",val:124},{code:"RAD_O-LAB_O-ANE_I-OPE_I",val:124},{code:"RAD_O-LAB_O-ANE_O-OPE_I",val:124},{code:"RAD_O-ANE_I-ANE_O-OPE_I",val:133},{code:"RAD_I-LAB_I-LAB_O-ANE_I",val:118},{code:"RAD_I-LAB_I-LAB_O-ANE_O",val:118},{code:"RAD_I-LAB_I-LAB_O-OPE_I",val:147},{code:"RAD_I-LAB_I-ANE_I-ANE_O",val:118},{code:"RAD_I-LAB_I-ANE_I-OPE_I",val:118},{code:"RAD_I-LAB_I-ANE_O-OPE_I",val:118},{code:"RAD_I-LAB_O-ANE_I-ANE_O",val:118},{code:"RAD_I-LAB_O-ANE_I-OPE_I",val:118},{code:"RAD_I-LAB_O-ANE_O-OPE_I",val:118},{code:"RAD_I-ANE_I-ANE_O-OPE_I",val:125},{code:"LAB_I-LAB_O-ANE_I-ANE_O",val:156},{code:"LAB_I-LAB_O-ANE_I-OPE_I",val:156},{code:"LAB_I-LAB_O-ANE_O-OPE_I",val:157},{code:"LAB_I-ANE_I-ANE_O-OPE_I",val:156},{code:"LAB_O-ANE_I-ANE_O-OPE_I",val:168}];
// var A5 =[{code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_I",val:118},{code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_I-LAB_O-OPE_I",val:147},{code:"RAD_O-RAD_I-LAB_I-ANE_I-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_I-ANE_I-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_I-ANE_O-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_O-ANE_I-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_O-ANE_I-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_O-ANE_O-OPE_I",val:118},{code:"RAD_O-RAD_I-ANE_I-ANE_O-OPE_I",val:125},{code:"RAD_O-LAB_I-LAB_O-ANE_I-ANE_O",val:124},{code:"RAD_O-LAB_I-LAB_O-ANE_I-OPE_I",val:124},{code:"RAD_O-LAB_I-LAB_O-ANE_O-OPE_I",val:124},{code:"RAD_O-LAB_I-ANE_I-ANE_O-OPE_I",val:124},{code:"RAD_O-LAB_O-ANE_I-ANE_O-OPE_I",val:124},{code:"RAD_I-LAB_I-LAB_O-ANE_I-ANE_O",val:118},{code:"RAD_I-LAB_I-LAB_O-ANE_I-OPE_I",val:118},{code:"RAD_I-LAB_I-LAB_O-ANE_O-OPE_I",val:118},{code:"RAD_I-LAB_I-ANE_I-ANE_O-OPE_I",val:118},{code:"RAD_I-LAB_O-ANE_I-ANE_O-OPE_I",val:118},{code:"LAB_I-LAB_O-ANE_I-ANE_O-OPE_I",val:156}];
// var A6 = [{code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_I-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_I-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_O-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_I-ANE_I-ANE_O-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_O-ANE_I-ANE_O-OPE_I",val:118},{code:"RAD_O-LAB_I-LAB_O-ANE_I-ANE_O-OPE_I",val:124},{code:"RAD_I-LAB_I-LAB_O-ANE_I-ANE_O-OPE_I",val:118}];

var allData = [[{code:"RAD_O",val:219},{code:"RAD_I",val:204},{code:"LAB_I",val:194},{code:"LAB_O",val:207},{code:"ANE_I",val:192},{code:"ANE_O",val:193},{code:"OPE_I",val:298},{code:"OPE_O",val:89},{code:"ORP_O",val:62},{code:"ADM_I",val:70},{code:"ADM_O",val:71}],[{code:"RAD_O-RAD_I",val:204},{code:"RAD_O-LAB_I",val:154},{code:"RAD_O-LAB_O",val:155},{code:"RAD_O-ANE_I",val:133},{code:"RAD_O-ANE_O",val:133},{code:"RAD_O-OPE_I",val:219},{code:"RAD_O-OPE_O",val:74},{code:"RAD_I-LAB_I",val:147},{code:"RAD_I-LAB_O",val:148},{code:"RAD_I-ANE_I",val:125},{code:"RAD_I-ANE_O",val:125},{code:"RAD_I-OPE_I",val:204},{code:"RAD_I-OPE_O",val:71},{code:"LAB_I-LAB_O",val:194},{code:"LAB_I-ANE_I",val:156},{code:"LAB_I-ANE_O",val:157},{code:"LAB_I-OPE_I",val:194},{code:"LAB_O-ANE_I",val:168},{code:"LAB_O-ANE_O",val:169},{code:"LAB_O-OPE_I",val:207},{code:"LAB_O-OPE_O",val:61},{code:"ANE_I-ANE_O",val:192},{code:"ANE_I-OPE_I",val:192},{code:"ANE_O-OPE_I",val:193},{code:"OPE_I-OPE_O",val:88},{code:"OPE_I-ORP_O",val:62},{code:"OPE_I-ADM_I",val:70},{code:"OPE_I-ADM_O",val:71},{code:"ADM_I-ADM_O",val:70}],[{code:"RAD_O-RAD_I-LAB_I", val:147},{code:"RAD_O-RAD_I-LAB_O", val:148},{code:"RAD_O-RAD_I-ANE_I", val:125},{code:"RAD_O-RAD_I-ANE_O", val:125},{code:"RAD_O-RAD_I-OPE_I", val:204},{code:"RAD_O-RAD_I-OPE_O", val:71},{code:"RAD_O-LAB_I-LAB_O", val:154},{code:"RAD_O-LAB_I-ANE_I", val:124},{code:"RAD_O-LAB_I-ANE_O", val:124},{code:"RAD_O-LAB_I-OPE_I", val:154},{code:"RAD_O-LAB_O-ANE_I", val:124},{code:"RAD_O-LAB_O-ANE_O", val:124},{code:"RAD_O-LAB_O-OPE_I", val:155},{code:"RAD_O-ANE_I-ANE_O", val:133},{code:"RAD_O-ANE_I-OPE_I", val:133},{code:"RAD_O-ANE_O-OPE_I", val:133},{code:"RAD_O-OPE_I-OPE_O", val:74},{code:"RAD_I-LAB_I-LAB_O", val:147},{code:"RAD_I-LAB_I-ANE_I", val:118},{code:"RAD_I-LAB_I-ANE_O", val:118},{code:"RAD_I-LAB_I-OPE_I", val:147},{code:"RAD_I-LAB_O-ANE_I", val:118},{code:"RAD_I-LAB_O-ANE_O", val:118},{code:"RAD_I-LAB_O-OPE_I", val:148},{code:"RAD_I-ANE_I-ANE_O", val:125},{code:"RAD_I-ANE_I-OPE_I", val:125},{code:"RAD_I-ANE_O-OPE_I", val:125},{code:"RAD_I-OPE_I-OPE_O", val:71},{code:"LAB_I-LAB_O-ANE_I", val:156},{code:"LAB_I-LAB_O-ANE_O", val:157},{code:"LAB_I-LAB_O-OPE_I", val:194},{code:"LAB_I-ANE_I-ANE_O", val:156},{code:"LAB_I-ANE_I-OPE_I", val:156},{code:"LAB_I-ANE_O-OPE_I", val:157},{code:"LAB_O-ANE_I-ANE_O", val:168},{code:"LAB_O-ANE_I-OPE_I", val:168},{code:"LAB_O-ANE_O-OPE_I", val:169},{code:"LAB_O-OPE_I-OPE_O", val:61},{code:"ANE_I-ANE_O-OPE_I", val:192},{code:"OPE_I-ADM_I-ADM_O", val:70}],[{code:"RAD_O-RAD_I-LAB_I-LAB_O",val:147},{code:"RAD_O-RAD_I-LAB_I-ANE_I",val:118},{code:"RAD_O-RAD_I-LAB_I-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_I-OPE_I",val:147},{code:"RAD_O-RAD_I-LAB_O-ANE_I",val:118},{code:"RAD_O-RAD_I-LAB_O-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_O-OPE_I",val:148},{code:"RAD_O-RAD_I-ANE_I-ANE_O",val:125},{code:"RAD_O-RAD_I-ANE_I-OPE_I",val:125},{code:"RAD_O-RAD_I-ANE_O-OPE_I",val:125},{code:"RAD_O-RAD_I-OPE_I-OPE_O",val:71},{code:"RAD_O-LAB_I-LAB_O-ANE_I",val:124},{code:"RAD_O-LAB_I-LAB_O-ANE_O",val:124},{code:"RAD_O-LAB_I-LAB_O-OPE_I",val:154},{code:"RAD_O-LAB_I-ANE_I-ANE_O",val:124},{code:"RAD_O-LAB_I-ANE_I-OPE_I",val:124},{code:"RAD_O-LAB_I-ANE_O-OPE_I",val:124},{code:"RAD_O-LAB_O-ANE_I-ANE_O",val:124},{code:"RAD_O-LAB_O-ANE_I-OPE_I",val:124},{code:"RAD_O-LAB_O-ANE_O-OPE_I",val:124},{code:"RAD_O-ANE_I-ANE_O-OPE_I",val:133},{code:"RAD_I-LAB_I-LAB_O-ANE_I",val:118},{code:"RAD_I-LAB_I-LAB_O-ANE_O",val:118},{code:"RAD_I-LAB_I-LAB_O-OPE_I",val:147},{code:"RAD_I-LAB_I-ANE_I-ANE_O",val:118},{code:"RAD_I-LAB_I-ANE_I-OPE_I",val:118},{code:"RAD_I-LAB_I-ANE_O-OPE_I",val:118},{code:"RAD_I-LAB_O-ANE_I-ANE_O",val:118},{code:"RAD_I-LAB_O-ANE_I-OPE_I",val:118},{code:"RAD_I-LAB_O-ANE_O-OPE_I",val:118},{code:"RAD_I-ANE_I-ANE_O-OPE_I",val:125},{code:"LAB_I-LAB_O-ANE_I-ANE_O",val:156},{code:"LAB_I-LAB_O-ANE_I-OPE_I",val:156},{code:"LAB_I-LAB_O-ANE_O-OPE_I",val:157},{code:"LAB_I-ANE_I-ANE_O-OPE_I",val:156},{code:"LAB_O-ANE_I-ANE_O-OPE_I",val:168}],[{code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_I",val:118},{code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_I-LAB_O-OPE_I",val:147},{code:"RAD_O-RAD_I-LAB_I-ANE_I-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_I-ANE_I-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_I-ANE_O-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_O-ANE_I-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_O-ANE_I-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_O-ANE_O-OPE_I",val:118},{code:"RAD_O-RAD_I-ANE_I-ANE_O-OPE_I",val:125},{code:"RAD_O-LAB_I-LAB_O-ANE_I-ANE_O",val:124},{code:"RAD_O-LAB_I-LAB_O-ANE_I-OPE_I",val:124},{code:"RAD_O-LAB_I-LAB_O-ANE_O-OPE_I",val:124},{code:"RAD_O-LAB_I-ANE_I-ANE_O-OPE_I",val:124},{code:"RAD_O-LAB_O-ANE_I-ANE_O-OPE_I",val:124},{code:"RAD_I-LAB_I-LAB_O-ANE_I-ANE_O",val:118},{code:"RAD_I-LAB_I-LAB_O-ANE_I-OPE_I",val:118},{code:"RAD_I-LAB_I-LAB_O-ANE_O-OPE_I",val:118},{code:"RAD_I-LAB_I-ANE_I-ANE_O-OPE_I",val:118},{code:"RAD_I-LAB_O-ANE_I-ANE_O-OPE_I",val:118},{code:"LAB_I-LAB_O-ANE_I-ANE_O-OPE_I",val:156}],[{code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_I-ANE_O",val:118},{code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_I-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_O-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_I-ANE_I-ANE_O-OPE_I",val:118},{code:"RAD_O-RAD_I-LAB_O-ANE_I-ANE_O-OPE_I",val:118},{code:"RAD_O-LAB_I-LAB_O-ANE_I-ANE_O-OPE_I",val:124},{code:"RAD_I-LAB_I-LAB_O-ANE_I-ANE_O-OPE_I",val:118}]];


//get up string
var formatJson= function(jsonObj){
  var code = jsonObj.code;
  var codeArr = code.split('-');
  var str = Combinatorics.permutationCombination(codeArr).toArray();
  var resultArr = [];
  for(var i = 0, len = str.length; i< len; i++){
    var temporaryStr = '';
    if(str[i].length === 1){
      resultArr.push(str[i] + '');
      continue;
    }
    else if(str[i].length === codeArr.length){
      continue;
    }
    else{
      for(var j = 0, lenJ = str[i].length; j < lenJ; j++){
        if(j === (lenJ - 1)){
          temporaryStr += str[i][j];
        }
        else{
          temporaryStr += str[i][j] + "-";
        }
      }
      resultArr.push(temporaryStr);
    }
  }
  resultArr.push(jsonObj.code);
  var result = {upStrArr: resultArr, val: jsonObj.val};
  return result;
}

// console.log(formatJson({code:"RAD_O-RAD_I-LAB_I-LAB_O-ANE_I",val:204}));

//format Arr return array [arrStrArr: uparr, val: all val]
var formatArr = function(arr){
  var result = [];
  for(var i = 0, len = arr.length; i < len; i++){
    var temporaryJson = formatJson(arr[i]);
    result.push(temporaryJson);
  }
  return result;
}
// console.log(formatArr(A3));

//get origin up str value
var getUpValue = function(upStr, allData){
  var splitArr = upStr.split('-');
  var originData = allData[splitArr.length -1];
  var resultVal;
  for(var i = 0 , len = originData.length; i < len; i++){
    if(originData[i].code === upStr){
      resultVal = originData[i].val;
      break;
    }
  }
  return resultVal;
}
//getUpValue test
// console.log(getUpValue("RAD_O-RAD_I-LAB_I-LAB_O-ANE_I", allData));
// console.log(getUpValue("RAD_O-LAB_O-LAB_O", allData));

var getDownStr = function (upStr, arr){
  var originStr = arr[arr.length-1];
  var originArr = originStr.split('-');
  var strArr = upStr.split("-");
  var resultArr = _.difference(originArr, strArr);
  var resultStr = "";
  if(resultArr || resultArr.length !== 0){
    for(var i = 0, len = resultArr.length; i < len; i++){
      if(i === (len-1)){
        resultStr += resultArr[i];
      }
      else{
        resultStr += resultArr[i] + "-";
      }
    }
  }
  return resultStr;
}

//test
// console.log(getDownStr("RAD_O", ['RAD_O','LAB_O-LAB_O','RAD_O-LAB_O-LAB_O']))

var matchData = function(arr, val){
  var originStr = arr[arr.length-1];
  var resultArr = [];
  // resultArr.push({code: "origin:" + originStr, val: val});
  for(var i = 0, len = arr.length; i < len -1; i++){
    var upStr = arr[i];
    var upVal = getUpValue(upStr, allData);
    if(!upVal){
      continue;
    }
    var downStr = getDownStr(upStr, arr);
    // console.log(upStr, downStr);
    var combinationStr = upStr + "@" + downStr;
    var returnJson = {};
    returnJson.code = combinationStr;
    returnJson.val = val/upVal;
    resultArr.push(returnJson);
  }
  return resultArr;
}


//arr = A3 ....
var calculatedBySingle = function(arr){
  var originArr = formatArr(arr);
  var resultArr = [];
  for(var i = 0, len = originArr.length; i < len; i++){
    var innerOriginArr = originArr[i].upStrArr;
    var originVal = originArr[i].val;
    resultArr.push(matchData(innerOriginArr, originVal));
  }
  return resultArr;
}

var fileOutput = function(data, src){
  fs.writeFile(src,data,function(err){
        if(err) throw err;
        convetJsonToCsv(src);
  });
}

var convetJsonToCsv = function(src){
  fs.readFile(src, function(err,data){
    var originArr = JSON.parse(data);
    var originJSON = []
    for (var i = 0 ; i < originArr.length; i++) {
       originJSON = originJSON.concat(originArr[i]);
    };
    json2csv({ data: originJSON, fields: ['code', 'val'],del: '@' }, function(err, csv) {
      if (err) throw err;
      var targetPath = src.split('.json')[0] + ".csv";
      targetPath = targetPath.replace('json', 'csv')
      fs.writeFile(targetPath,csv,function(err){
            if(err) throw err;
      });
    });
  });
}

var init = function(allData){
  console.log("start");
  for(var i = 0; i < allData.length; i++){
    fileOutput(JSON.stringify(calculatedBySingle(allData[i])), 'json/' + 'a' + i + '.json');
  }
  console.log("end");
}

init(allData);

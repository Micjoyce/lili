(function(root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define('apriori', [], factory);
    } else {
        root['Apriori'] = factory();
    }
}(this, function() {

    'use strict';
    var Apriori;
    var json2csv = require('json2csv');
    var _ = require('lodash');
    var Combinatorics = require('js-combinatorics');
    (function(Apriori) {
        var AnalysisResult = (function() {
            function AnalysisResult(frequentItemSets, associationRules) {
                this.frequentItemSets = frequentItemSets;
                this.associationRules = associationRules;
            }
            return AnalysisResult;
        })();
        Apriori.AnalysisResult = AnalysisResult;

        var FrequentItemSet = (function() {
            function FrequentItemSet(itemSet, support) {
                this.itemSet = itemSet;
                this.support = support;
            }
            return FrequentItemSet;
        })();
        Apriori.FrequentItemSet = FrequentItemSet;

        var AssociationRule = (function() {
            function AssociationRule(lhs, rhs, confidence) {
                this.lhs = lhs;
                this.rhs = rhs;
                this.confidence = confidence;
            }
            return AssociationRule;
        })();
        Apriori.AssociationRule = AssociationRule;

        var Algorithm = (function() {
            function Algorithm(minSupport, minConfidence, debugMode, resultFileUrl) {
                this.minSupport = minSupport ? minSupport === 0 ? 0 : minSupport : 0.15;
                this.minConfidence = minConfidence ? minConfidence === 0 ? 0 : minConfidence : 0.6;
                this.debugMode = debugMode || false;
                this.resultFileUrl = resultFileUrl;
            }
            Algorithm.prototype.analyze = function(transactions) {
                var self = this;
                var beforeMillis = new Date().getTime();

                var oneItemFrequencyCalcu = ArrayUtils.findOneItemFrequencies(transactions, self.minSupport);
                 //运行时间
                if (self.debugMode) {
                    var startTime = self.getTime(beforeMillis);
                    console.log('Before oneItemFrequencyCalcu: ' + self.getTime(beforeMillis) + ' ms');
                }
                var testPositionItem = oneItemFrequencyCalcu.positionObj;

                var oneItemFrequencyResult = _.keys(testPositionItem)
                //sorted

                oneItemFrequencyResult = oneItemFrequencyResult.sort(function(a, b){
                    return a > b;
                });

                var oneItemFrequecyPositionObject = {}
                for (var i = 0; i < oneItemFrequencyResult.length; i++) {
                    var item = oneItemFrequencyResult[i];
                    oneItemFrequecyPositionObject[item.toString()] = testPositionItem[item.toString()]

                }
                var bitArray = ArrayUtils.convertPositionToBitArray(oneItemFrequecyPositionObject, oneItemFrequencyResult);
                var bitNumbers = ArrayUtils.bitArrayToBitNumber(bitArray);

                // start here
                var originLen = transactions.length;
                var KitemArray = oneItemFrequencyResult;
                var frequentItemSets = oneItemFrequencyCalcu.statisticArray;
                var lItemPositions = oneItemFrequecyPositionObject;
                while (KitemArray.length !== 0) {
                    // ki －－》 c(i+1)
                    var KitemToCitemArray = ArrayUtils.createJoinSets(KitemArray, oneItemFrequencyResult,lItemPositions);
                    var kItemAndStatistic = ArrayUtils.cItemToKitem(KitemToCitemArray, bitNumbers, self.minSupport, oneItemFrequencyResult, originLen, lItemPositions, oneItemFrequecyPositionObject)
                    lItemPositions = kItemAndStatistic.position;
                    KitemArray = kItemAndStatistic.kItem;
                    frequentItemSets = frequentItemSets.concat(kItemAndStatistic.statisticArray)
                }
                if (self.debugMode) {
                    var endTime = self.getTime(beforeMillis);
                    console.log('After finding item sets: ' + self.getTime(beforeMillis) + ' ms');
                }
                return {
                    data: frequentItemSets,
                    startTime: startTime,
                    endTime: endTime,
                };

            };

            Algorithm.prototype.showAnalysisResultFromFile = function(filename, callback) {
                var self = this;
                var resultFilename = self.formatFileName(filename);
                require('fs').readFile(filename, 'utf8', function(err, data) {
                    if (err)
                        throw err;
                    var transactions = ArrayUtils.readCSVToArray(data, ',');
                    var analysisResult = self.analyze(transactions);
                    var formatResult = analysisResult.data;
                    var calcuTime = {
                        key: analysisResult.startTime,
                        value: analysisResult.endTime
                    };
                    formatResult.unshift(calcuTime);
                    json2csv({
                        data: formatResult,
                        fileds: ['key', 'value']
                    }, function(err, csv) {
                        if (err) throw err;
                        console.log("计算结果保存至:",resultFilename);
                        require("fs").writeFile(resultFilename, csv, function(err) {
                            if (err) throw err;
                            if (typeof callback === "function") {
                                callback(calcuTime);
                            }
                        });
                    });
                });
            };

            Algorithm.prototype.getTime = function(initial) {
                return new Date().getTime() - initial;
            };

            Algorithm.prototype.formatFileName = function(filename) {
                // filename database/mush-data.csv
                var originFile = filename.split("/").slice(-1).toString().split(".")[0].toString();

                return this.resultFileUrl + "_" + originFile + "_" + this.addZero() + ".csv";
            };

            Algorithm.prototype.addZero = function() {
                var fixLen = 4;
                var str = (this.minSupport * Math.pow(10, fixLen - 1)).toString();
                for (var i = 0; i < 4 - str.length; i++) {
                    str = "0" + str;
                }
                return str;
            };

            return Algorithm;
        })();
        Apriori.Algorithm = Algorithm;

        var ArrayUtils = (function() {
            function ArrayUtils() {}
            ArrayUtils.readCSVToArray = function(inputString, delimiter) {
                delimiter = delimiter || ',';
                var regexp = new RegExp(("(\\" + delimiter + "|\\r?\\n|\\r|^)" + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + "([^\"\\" + delimiter + "\\r\\n]*))"), 'gi');

                var arrayOfRows = [
                    []
                ];
                var matched;
                while (!!(matched = regexp.exec(inputString))) {
                    var matchedDelimiter = matched[1];
                    if (matchedDelimiter.length && matchedDelimiter !== delimiter) {
                        arrayOfRows.push([]);
                    }
                    var matchedValue = matched[2] ? matched[2].replace(new RegExp('""', 'g'), '"') : matched[3];
                    if (matchedValue.length > 0) {
                        arrayOfRows[arrayOfRows.length - 1].push(matchedValue);
                    }
                }
                return arrayOfRows;
            };
            //this method is return one item frequency
            ArrayUtils.findOneItemFrequencies = function(originTransactions, support) {
                    var self = this;
                    var oneItemFrequency = {};
                    var oneItemFrequencyPostaions = {};
                    var positionObj = {};
                    var itemMeasure = [];
                    var bitArray = [];
                    var initialTime = new Date().getTime();
                    originTransactions.forEach(function(transaction, tIndex) {
                        var rowArray = [];
                        transaction.forEach(function(item) {
                            if (self.isSubItem(item, transaction)) {
                                if (!positionObj[item.toString()]) {
                                    positionObj[item.toString()] = [];
                                    positionObj[item.toString()].push(tIndex);
                                } else {
                                    var exitsArray = positionObj[item.toString()];
                                    if (exitsArray.indexOf(tIndex) === -1) {
                                        positionObj[item.toString()].push(tIndex);
                                    }
                                }
                            }

                        });
                    });
                    console.log(new Date().getTime() - initialTime)
                    var keys = _.keys(positionObj);
                    var result = [];
                    var fileterKeys = [];
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var frequency = positionObj[key].length / originTransactions.length;
                        if (frequency >= support) {
                            result.push({
                                key: key,
                                value: frequency
                            });
                            fileterKeys.push(key);
                        } else {
                            delete positionObj[key];
                        }
                    }

                    return {
                        oneItemFrequency: fileterKeys,
                        statisticArray: result,
                        positionObj: positionObj
                    };
                }
                //this method is convert originTransactions to binary
            ArrayUtils.convertToBitArray = function(originTransactions, oneItemFrequency) {
                var resultArray = [];
                originTransactions.forEach(function(transaction) {
                    var tempArray = [];
                    oneItemFrequency.forEach(function(oneItem) {
                        var foundFlag = false;
                        transaction.forEach(function(item) {
                            if (item.toString() === oneItem.toString()) {
                                foundFlag = true;
                            }
                        })
                        if (foundFlag) {
                            tempArray.push(1)
                        } else {
                            tempArray.push(0)
                        }
                    });
                    resultArray.push(tempArray)
                });
                return resultArray;
            }
            ArrayUtils.toBin = function(dec, arrFlag, len) {
                var bits = [];
                var dividend = parseInt(dec);
                var remainder = 0;
                while (dividend >= 2) {
                    remainder = dividend % 2;
                    bits.push(remainder);
                    dividend = (dividend - remainder) / 2;
                }
                bits.push(dividend);
                bits.reverse();
                if (len) {
                    var zeroCount = len - bits.length;
                    for (var i = 0; i < zeroCount; i++) {
                        bits.unshift(0);
                    }
                    return bits;
                }
                if (arrFlag) {
                    return bits;
                }
                return bits.join("");
            }
            ArrayUtils.toDecimal = function(str) {
                return parseInt(str.toString(), 2);
            }
            ArrayUtils.bitArrayToBitNumber = function(bitArray) {
                    var temp = [];
                    var self = this;
                    bitArray.forEach(function(item) {
                        var joinArray = item.join('');
                        var bitNum = self.toDecimal(joinArray);
                        temp.push(bitNum);
                    });
                    return temp;
                }
                //ki --> Ci+1
            ArrayUtils.createJoinSets = function(itemSets, oneItemFrequency, lItemPositions) {
                var self = this;
                var tempArray = [];
                var startTime = new Date();

                // filterKitemBeforeToCitemForEachItemsFreq
                var itemLen = itemSets[0].length;
                if (itemLen > 2) {
                  itemSets = self.filterKitemBeforeToCitemForEachItemsFreq(itemSets);
                }

                // var isOneItem = false;
                // if (itemSets && itemSets[0] && _.isString(itemSets[0])) {
                //   isOneItem = true;
                // }
                // change for  old method
                // var count = 0;

                var strTempArr = [];
                for (var i = 0; i < itemSets.length - 1; i++) {
                    var itemX = itemSets[i];
                    for (var j = i + 1; j < itemSets.length; j++) {
                        var itemY = itemSets[j];
                        var canJoin = self.oldMethonJoinItems(itemX, itemY);
                        if (canJoin !== false) {
                          var str = canJoin.join("-");
                          if (strTempArr.indexOf(str) === -1) {
                            // count++;
                            var filterArr = this.removeduplicateCitem([canJoin], lItemPositions);
                            if (filterArr.length > 0) {
                              tempArray.push(canJoin);
                              strTempArr.push(str);
                            }
                          }
                        }
                    }
                }
                // tempArray = this.removeduplicateCitem(tempArray, lItemPositions);
                // console.log(new Date() - startTime, "createJoinSets and Remove duplication item------------======");
                // 删除频繁项集合，统计其子项是否包含大于k项
                return tempArray;
            }

            ArrayUtils.oldMethonJoinItems = function(itemX, itemY) {
              var len = itemX.length;
              var result = [];
              if (len === 1) {
                result = [itemX, itemY];
                return result;
              }
              result = _.union(itemX, itemY);
              if (result.length === (itemX.length + 1)) {
                // result.sort(function(a, b){
                //   return a > b;
                // });
                return result;
              }
              return false;
            }

            ArrayUtils.filterKitemBeforeToCitemForEachItemsFreq = function(tempArray) {
              // 生成每一项
              var itemObj = {};
              for (var i = 0; i < tempArray.length; i++) {
                var arrItem = tempArray[i];
                for (var j = 0; j < arrItem.length; j++) {
                  var item = arrItem[j];
                  if (!itemObj[item]) {
                    itemObj[item] = 1;
                  }else {
                    itemObj[item] += 1;
                  }
                }
              }
              // 找出大于K项集的项目
              var filterArray = [];
              var filterLen = tempArray[0].length - 1;
              var items = _.keys(itemObj);
              for (var k = 0; k < items.length; k++) {
                var keyItem = items[k];
                if (itemObj[keyItem] <= filterLen ) {
                  filterArray.push(keyItem);
                }
              }
              // 从tempArray 移除 包含小于出现次数小于k的项
              if (filterArray.length === 0) {
                return tempArray;
              }
              var resultArray = [];
              tempArray.forEach(function(kitem, index){
                var hasItem = false;
                filterArray.forEach(function(item, index){
                  if (_.contains(kitem, item) === true) {
                    hasItem = true;
                  }
                });
                if (hasItem === false) {
                  resultArray.push(kitem);
                }
              });
              return resultArray;
            }

            ArrayUtils.removeduplicateCitem = function(tempArray, lItemPositions){
                if (!tempArray || !tempArray[0] || tempArray[0].length < 3) {
                  return tempArray
                }
                // 判断子集是否为频繁项集
                var fixDuplicationResult = []
                for (var i = 0; i < tempArray.length; i++) {
                  var cItem = tempArray[i];
                  if(this.isSubFrenItems(cItem, lItemPositions) === true){
                    fixDuplicationResult.push(cItem);
                  }
                }
                return fixDuplicationResult;
            }

            ArrayUtils.isSubFrenItems = function(cItem, lItemPositions) {
              var kItem = this.cItemsKitem(cItem);
              for (var i = 0; i < kItem.length; i++) {
                var item = kItem[i].join('-');
                if (!lItemPositions[item]) {
                  return false;
                  break;
                }
              }
              return true;
            }
            ArrayUtils.cItemsKitem = function (cItem){
              if (!_.isArray(cItem)) {
                console.log("Not a Array cItem");
              }
              var len = cItem.length - 1;
              var result = [];
              // [a,b,c] --> [[a,b], [a,c], [b,c]]
              var cmb = Combinatorics.combination(cItem, len);
              return cmb.toArray();
            }
            ArrayUtils.joinItemSet = function(itemX, itemY) {
                var result = []
                if (_.isString(itemX)) {
                    result.push(itemX);
                    result.push(itemY);
                } else {
                    result = _.union(itemX, itemY);
                }
                return result;
            }
            ArrayUtils.createJoinSetsCompare = function(itemXToZero, itemYBitArray) {
                var self = this;
                var itemXToDecimal = self.toDecimal(itemXToZero.join(""));
                var itemYToDecimal = self.toDecimal(itemYBitArray.join(""));
                // console.log(itemXToDecimal, itemYToDecimal);
                if (itemXToDecimal === (itemXToDecimal & itemYToDecimal)) {
                  return true;
                }
                return false
                // var tempArray = [];
                // for (var i = 0; i < itemXToZero.length; i++) {
                //     var andCalcu = itemXToZero[i] & itemYBitArray[i];
                //     tempArray.push(andCalcu);
                // }
                // var compareToDecimal = self.toDecimal(tempArray.join(""));
                // var itemXToDecimal = self.toDecimal(itemXToZero.join(""));
                // if (itemXToDecimal === compareToDecimal) {
                //     return true;
                // }
                // return false;
            }
            ArrayUtils.setLastOneToZero = function(item, oneItemFrequency) {
                    var self = this;
                    var bitArray = [];
                    bitArray = self.kItemToCItemMeture(item, oneItemFrequency);
                    var index = _.lastIndexOf(bitArray, 1);
                    bitArray[index] = 0;
                    return bitArray
                }
                //以频繁一项集来生成标杆进行计算
                //oItemFrenquecy [a,b,c,d,e,f]
                //[a, b, c]
                //[1,1,1,0,0,0]
            ArrayUtils.kItemToCItemMeture = function(item, oneItemFrequency) {
                //如果是一项集进入时，为string，不需要遍历
                var self = this;
                var metureArray = self.createMeture(oneItemFrequency);
                if (_.isString(item)) {
                    var index = _.indexOf(oneItemFrequency, item);
                    metureArray[index] = 1;
                }

                if (_.isArray(item)) {
                    item.forEach(function(ele) {
                        var index = _.indexOf(oneItemFrequency, ele);
                        metureArray[index] = 1;
                    });
                }
                return metureArray;
            }
            ArrayUtils.createMeture = function(oneItemFrequency) {
                var tempArray = [];
                oneItemFrequency.forEach(function(oneItem) {
                    tempArray.push(0);
                });
                return tempArray;
                // var result = new Int8Array(oneItemFrequency.length);
                // return result
            }
            ArrayUtils.cItemToKitem = function(cItems, bitNums, minSupport, oneItemFrequency, originLen, lItemPositions, oneItemFrequecyPositionObject) {
                var self = this;
                var localFrequencies = {};
                var binLength = oneItemFrequency.length;
                var localPositions = {};
                var startTime = new Date();
                cItems.forEach(function(cItem) {
                    var frequencyCount = 0;

                    var subKitemArrStr = cItem.slice(0, cItem.length - 1).join("-");
                    var lastitemStr = cItem.slice(-1).toString();

                    var subKitemArrPositions = lItemPositions[subKitemArrStr];
                    // 如果 n-1项为非频繁项集 则进行下一步计算
                    if (!subKitemArrPositions) {
                      return;
                    }
                    var lastItemPositions = oneItemFrequecyPositionObject[lastitemStr];

                    var interSectionPositions =  _.intersection(subKitemArrPositions, lastItemPositions);

                    localPositions[cItem.join("-").toString()] = interSectionPositions;
                    localFrequencies[cItem.join("-").toString()] = interSectionPositions.length;
                });
                // 移除频繁度小于设定值的项目
                var result = self.removeLessMinSupport(localFrequencies, minSupport, originLen, localPositions)
                // console.log( 'cItemToKitem ---------------------', new Date() - startTime);
                return result;
            }
            ArrayUtils.getMinPositionArray = function(cItem, lItemPositions, oneItemFrequecyPositionObject) {
                var len = cItem.length;
                var lastItem = cItem[len - 1];
                var preItems = cItem.slice(0, len - 1).join("-");
                if (lItemPositions[preItems].length > oneItemFrequecyPositionObject[lastItem].length) {
                    return oneItemFrequecyPositionObject[lastItem];
                }
                return lItemPositions[preItems];
            }
            ArrayUtils.removeLessMinSupport = function(localFrequencies, minSupport, originLen, localPositions) {
                var allKeys = _.keys(localFrequencies);
                // var allValues = _.values(localFrequencies);
                var tempArray = [];
                var statisticArray = [];
                var positionArray = {};
                for (var i = 0; i < allKeys.length; i++) {
                    var key = allKeys[i];
                    if (localFrequencies[key] / originLen >= minSupport) {
                        //在此获得每次从c －－》 k(i+1) 的数据结果
                        statisticArray.push({
                            key: key,
                            value: localFrequencies[key] / originLen
                        })
                        tempArray.push(key.split("-"));
                        positionArray[key] = localPositions[key];
                    }
                }
                return {
                    kItem: tempArray,
                    statisticArray: statisticArray,
                    position: positionArray

                };
            }
            ArrayUtils.andCalcu = function(indexArr, binArr) {
                var result = 1;
                for (var i = 0; i < indexArr.length; i++) {
                    var index = indexArr[i];
                    result = binArr[index] * result;
                    if (result === 0) {
                        break;
                    }
                }
                return result;
            }
            ArrayUtils.getCItemIndexArr = function(cItem, oneItemFrequency) {
                //less to item
                var indexArray = [];
                cItem.forEach(function(item) {
                    var index = _.indexOf(oneItemFrequency, item);
                    return indexArray.push(index);
                });
                return indexArray;
            }
            ArrayUtils.getOneItemPosition = function(oneItemFrequency, transactions) {
                var self = this;
                if (!oneItemFrequency || !transactions) {
                    throw "oneItemFrequency or transactions is undefined"
                }
                var result = {};
                oneItemFrequency.forEach(function(item, index) {
                    transactions.forEach(function(transaction, tIndex) {
                        if (self.isSubItem(item, transaction)) {
                            if (!result[item.toString()]) {
                                result[item.toString()] = [];
                            }
                            result[item.toString()].push(tIndex);
                        }
                    });
                });
                return result;
            }
            ArrayUtils.convertPositionToBitArray = function(oneItemFrequecyPositionObject, oneItemFrequencyResult) {
                var self = this;
                var column = oneItemFrequencyResult.length;
                var values = _.values(oneItemFrequecyPositionObject);
                var row = 0;
                var bitArray = [];
                values.forEach(function(value) {
                    var maxValue = _.max(value);
                    if (maxValue > row) {
                        row = maxValue;
                    }
                });
                var zeroArray = self.createArray(column, row);
                var resultArr = self.setValue(values, zeroArray);
                return resultArr;
            }
            ArrayUtils.setValue = function(values, zeroArray) {
                for (var i = 0; i < values.length; i++) {
                    var neatArray = values[i];
                    for (var j = 0; j < neatArray.length; j++) {
                        var position = neatArray[j];
                        zeroArray[position][i] = 1;
                    }
                }
                return zeroArray;
            }
            ArrayUtils.createArray = function(column, row) {
                var resultArr = [];
                for (var j = 0; j < row + 1; j++) {
                    var arr = [];
                    for (var i = 0; i < column ; i++) {
                        arr.push(0);
                    }
                    resultArr.push(arr);
                }
                return resultArr;
            }
            ArrayUtils.isSubItem = function(item, transaction) {
                var index = transaction.indexOf(item.toString());
                if (index > -1) {
                    return true;
                }
                return false;
            };
            return ArrayUtils;
        })();
        Apriori.ArrayUtils = ArrayUtils;
    })(Apriori || (Apriori = {}));
    //# sourceMappingURL=apriori.js.map


    return Apriori;

}));

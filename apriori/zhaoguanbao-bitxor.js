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
            function Algorithm(minSupport, minConfidence, debugMode) {
                this.minSupport = minSupport ? minSupport === 0 ? 0 : minSupport : 0.15;
                this.minConfidence = minConfidence ? minConfidence === 0 ? 0 : minConfidence : 0.6;
                this.debugMode = debugMode || false;
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
                // console.log(oneItemFrequencyResult);
                var bitArray = ArrayUtils.convertPositionToBitArray(oneItemFrequecyPositionObject, oneItemFrequencyResult);
                 //运行时间
                if (self.debugMode) {
                    var startTime = self.getTime(beforeMillis);
                    console.log('Before bitArray: ' + self.getTime(beforeMillis) + ' ms');
                }
                // console.log(bitArray.length)
                var bitNumbers = ArrayUtils.bitArrayToBitNumber(bitArray);
                 //运行时间
                if (self.debugMode) {
                    var startTime = self.getTime(beforeMillis);
                    console.log('Before bitNumbers: ' + self.getTime(beforeMillis) + ' ms');
                }
                //运行时间
                if (self.debugMode) {
                    var startTime = self.getTime(beforeMillis);
                    console.log('Before finding item sets: ' + self.getTime(beforeMillis) + ' ms');
                }


                // start here
                var originLen = transactions.length;
                // 生成单列数据标尺，长度位 originlen, 各位值为1
                var coluItems = ArrayUtils.generatorColumnVolumeOne(originLen);
                var KitemArray = oneItemFrequencyResult;
                var frequentItemSets = oneItemFrequencyCalcu.statisticArray;
                var lItemPositions = oneItemFrequecyPositionObject;
                while (KitemArray.length !== 0) {
                    // ki －－》 c(i+1)
                    var startDate = new Date();
                    var KitemToCitemArray = ArrayUtils.createJoinSets(KitemArray, oneItemFrequencyResult);

                    // 删除包含非频繁子集的候选项集
                    KitemToCitemArray = ArrayUtils.removeduplicateCitem(KitemToCitemArray, KitemArray);
                    //  ArrayUtils.removeduplicateCitem(KitemToCitemArray, KitemArray);

                    console.log("KitemToCitemArray ==>", startDate - new Date());
                    var kItemAndStatistic = ArrayUtils.cItemToKitem(KitemToCitemArray, bitNumbers, self.minSupport, oneItemFrequencyResult, originLen, coluItems, lItemPositions, oneItemFrequecyPositionObject)
                    lItemPositions = kItemAndStatistic.position;
                    KitemArray = kItemAndStatistic.kItem;
                    console.log("kItemAndStatistic ==>",KitemArray.length, startDate - new Date());
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

            Algorithm.prototype.showAnalysisResultFromFile = function(filename) {
                var self = this;
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
                        require("fs").writeFile("support.csv", csv, function(err) {
                            if (err) throw err;
                        });
                    });
                });
            };

            Algorithm.prototype.getTime = function(initial) {
                return new Date().getTime() - initial;
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
            ArrayUtils.createJoinSets = function(itemSets, oneItemFrequency) {
                var self = this;
                var tempArray = [];
                var tempStrArray = [];
                for (var i = 0; i < itemSets.length - 1; i++) {
                    var itemX = itemSets[i];
                    // 由于之前做过排序处理，
                    var itemXToZero = self.kItemToCItemMeture(itemX, oneItemFrequency);
                    for (var j = i + 1; j < itemSets.length; j++) {
                        var itemY = itemSets[j];
                        var itemYBitArray = [];
                        itemYBitArray = self.kItemToCItemMeture(itemY, oneItemFrequency);
                        var canJoin = self.createJoinSetsCompare(itemXToZero, itemYBitArray);
                        if (canJoin) {
                            var innerTemp = self.joinItemSet(itemX, itemY);
                            var innerStrTemp = innerTemp.toString();
                            if (innerTemp.length > itemX.length) {
                              // 插入之前需要判断是否已经有插入的
                              if(tempStrArray.indexOf(innerStrTemp) < 0){
                                tempArray.push(innerTemp);
                                tempStrArray.push(innerStrTemp);
                              }
                            }
                        }
                    }
                }
                return tempArray;
            }

            ArrayUtils.removeduplicateCitem = function(KitemToCitemArray, KitemArray){
              var self = this;
              //将 KitemArray 每一项转为 string
              var KitemArrayStr = [];
              var resultCitems = [];
              for (var len = 0; len < KitemArray.length; len++) {
                KitemArrayStr.push(KitemArray[len].toString());
              }

              for (var i = 0; i < KitemToCitemArray.length; i++) {
                var cItem = KitemToCitemArray[i];
                var cItemSubKitems = self.cItemsKitem(cItem);
                var hasNotFreqKitem = false;
                for (var j = 0; j < cItemSubKitems.length; j++) {
                  var subKitem = cItemSubKitems[j].toString();
                  // 如果存在非频繁子集则剔除
                  if (KitemArrayStr.indexOf(subKitem) < 0) {
                    hasNotFreqKitem = true;
                  }
                }
                if (!hasNotFreqKitem) {
                  resultCitems.push(cItem);
                }
              }
              console.log("非频繁子集剔除",KitemToCitemArray.length, resultCitems.length);
              return resultCitems;
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
                result = result.sort(function(a, b){
                  return a > b;
                });
                return result;
            }
            // 异或操作有且只有两个1的时候才可以链接（返回 true）
            ArrayUtils.createJoinSetsCompare = function(itemXToZero, itemYBitArray) {
                var self = this;
                var count = 0;

                for (var i = 0; i < itemXToZero.length; i++) {
                    var andCalcu = itemXToZero[i] * itemYBitArray[i];
                    if (itemXToZero[i] !== itemYBitArray[i]) {
                      count ++;
                    }
                }
                if (count === 2) {
                  return true;
                }
                return false;
            }
            // 不将最后一位补零 －－－ 差异
            ArrayUtils.setLastOneToZero = function(item, oneItemFrequency) {
                    var self = this;
                    var bitArray = [];
                    bitArray = self.kItemToCItemMeture(item, oneItemFrequency);
                    var index = _.lastIndexOf(bitArray, 1);
                    bitArray[index] = 0;
                    return bitArray
                }
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
            }
            ArrayUtils.cItemToKitem = function(cItems, bitNums, minSupport, oneItemFrequency, originLen, coluItems, lItemPositions, oneItemFrequecyPositionObject) {
                var self = this;
                var localFrequencies = {};
                var binLength = oneItemFrequency.length;
                var localPositions = {};
                cItems.forEach(function(cItem) {
                    // 迭代行数, 进行与运算
                    var resultColuItems = coluItems;


                    cItem.forEach(function(item, index){
                      // 根据所在位置生成 列  位表
                      var columnIndex = oneItemFrequecyPositionObject[item];
                      var coluItemsBitArr = self.generatorColumnBitArr(columnIndex, coluItems, originLen);
                      resultColuItems = self.andCalcuAndGetArr(coluItemsBitArr, resultColuItems);
                    });

                    // 计算一个数，即为给 citem的支持度。calcResult --> sum and positions
                    var calcResult = self.calcuArr(resultColuItems);
                    var frequencyCount = calcResult.sum;
                    var tempPosition = calcResult.positions;

                    localPositions[cItem.join("-").toString()] = tempPosition;
                    localFrequencies[cItem.join("-").toString()] = frequencyCount;
                });
                // 移除频繁度小于设定值的项目
                console.log(localFrequencies, minSupport, originLen, localPositions);
                var result = self.removeLessMinSupport(localFrequencies, minSupport, originLen, localPositions)
                return result;
            }

            // 差异
            ArrayUtils.generatorColumnVolumeOne = function(len) {
              var result = [];
              if (_.isNumber(len ) && len > 0) {
                for (var i = 0; i < len; i++) {
                  result.push(1);
                }
              }
              return result;
            }
            // 差异
            ArrayUtils.generatorColumnBitArr = function(indexArr, coluItems, originLen) {
              // var result = [];
              // coluItems.forEach(function(item, index){
              //   if (indexArr.indexOf(index) !== -1 ) {
              //     result.push(1);
              //   }else {
              //     result.push(0);
              //   }
              // })
              // return result;
              //
              var initArr = new Int8Array(originLen);
              indexArr.forEach(function(item, index){
                initArr[item] = 1;
              })
              return initArr;
            }
            // 差异
            ArrayUtils.andCalcuAndGetArr = function(arr1, arr2) {
              var result = [];
              // 去除这一部的判定
              // if (arr1.length !== arr2.length) {
              //   console.log(arr1, arr2, "长度不一样");
              //   return;
              // }
              arr1.forEach(function(item, index){
                // result.push(item * arr2[index]);
                result.push(item & arr2[index]);
              });
              return result;
            }
            // 求和
            ArrayUtils.calcuArr = function(arr1) {
              var positions = [];
              var sum = 0;
              arr1.forEach(function(item, index){
                if (item === 1) {
                  positions.push(index);
                  sum += 1;
                }
              })
              return {
                sum: sum,
                positions: positions
              };
            }

            ArrayUtils.getMinPositionArray = function(cItem, lItemPositions, oneItemFrequecyPositionObject) {
                var len = cItem.length;
                var lastItem = cItem[len - 1];
                var preItems = cItem.slice(0, len - 1).join("-");
                // 如果没有就返回空数组
                if (!lItemPositions[preItems]) {
                  return [];
                }
                // 判断其实否包含频繁子集合 -- 改进 差异
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

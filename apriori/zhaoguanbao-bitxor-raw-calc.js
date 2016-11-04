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
                // console.log(oneItemFrequencyResult);
                // convertPositionToBitArray -->
                //   {bitArrayWithVal: resultArr,
                //  columnsNum: columnsNum}
                var convertResult = ArrayUtils.convertPositionToBitArray(oneItemFrequecyPositionObject, oneItemFrequencyResult);
                var bitArray = convertResult.bitArrayWithVal;
                var columnsNum = convertResult.columnsNum;
                var columnsMeture = convertResult.metureBitArrNum
                 //运行时间
                // if (self.debugMode) {
                //     var startTime = self.getTime(beforeMillis);
                //     console.log('Before bitArray: ' + self.getTime(beforeMillis) + ' ms');
                // }
                // // console.log(bitArray.length)
                var bitNumbers = ArrayUtils.bitArrayToBitNumber(bitArray);
                //  //运行时间
                // if (self.debugMode) {
                //     var startTime = self.getTime(beforeMillis);
                //     console.log('Before bitNumbers: ' + self.getTime(beforeMillis) + ' ms');
                // }
                // //运行时间
                // if (self.debugMode) {
                //     var startTime = self.getTime(beforeMillis);
                //     console.log('Before finding item sets: ' + self.getTime(beforeMillis) + ' ms');
                // }


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

                    // console.log("KitemToCitemArray ==>", startDate - new Date());
                    var kItemAndStatistic = ArrayUtils.cItemToKitem(KitemToCitemArray, bitNumbers,columnsNum, self.minSupport, oneItemFrequencyResult, originLen, coluItems,columnsMeture, lItemPositions, oneItemFrequecyPositionObject)
                    lItemPositions = kItemAndStatistic.position;
                    KitemArray = kItemAndStatistic.kItem;
                    // console.log("kItemAndStatistic ==>",KitemArray.length, startDate - new Date());
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
                        // console.log("计算结果保存至:",resultFilename);
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
                if (str.length > 31) {
                    var len = Math.ceil(str.length / 31);
                    var result = [];
                    for (var i = 0; i < len; i++) {
                        var innerStr = str.substr(i, i*31)
                        result.push(parseInt(str.toString(), 2))
                    }
                    return result;
                }
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
                            // 插入之前需要判断是否已经有插入的
                            if(tempStrArray.indexOf(innerStrTemp) < 0){
                                tempArray.push(innerTemp);
                                tempStrArray.push(innerStrTemp);
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
              // console.log("非频繁子集剔除",KitemToCitemArray.length, resultCitems.length);
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
                //
                // for (var i = 0; i < itemXToZero.length; i++) {
                //     if (itemXToZero[i] !== itemYBitArray[i]) {
                //       count ++;
                //     }
                // }
                //
                // 通过位表的方式进行异或运算处理
                if (itemXToZero.length > 31) {
                    for (var i = 0; i < itemXToZero.length; i++) {
                        if (itemXToZero[i] !== itemYBitArray[i]) {
                          count ++;
                        }
                    }
                }else {
                    var itemXToDecimal = self.toDecimal(itemXToZero.join(""));
                    var itemYToDecimal = self.toDecimal(itemYBitArray.join(""));
                    var diffAndCalc = itemXToDecimal ^ itemYToDecimal;
                    while (diffAndCalc !== 0) {
                      count ++;
                      diffAndCalc = diffAndCalc & (diffAndCalc -1);
                      if (count > 2) {
                        return false;
                      }
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
            ArrayUtils.cItemToKitem = function(cItems, bitNums, columnsNum, minSupport, oneItemFrequency, originLen, coluItems, columnsMeture, lItemPositions, oneItemFrequecyPositionObject) {
                var self = this;
                var localFrequencies = {};
                var binLength = oneItemFrequency.length;
                var localPositions = {};
                cItems.forEach(function(cItem) {
                    // 二进制迭代
                    var resultColuItems = columnsMeture;

                    cItem.forEach(function(item, index){
                      // 根据所在位置生成 列  位表
                      // var columnIndex = oneItemFrequecyPositionObject[item];
                      // var coluItemsBitArr = self.generatorColumnBitArr(columnIndex, coluItems, originLen);
                      var itemBitNum = columnsNum[item];
                      resultColuItems = self.andCalcuByRow(resultColuItems, itemBitNum);
                    });

                    // 计算一个数，即为给 citem的支持度。calcResult --> sum and positions
                    // 需要转化为  二进制， 并求和。
                    var calcResult = self.calcuArr(resultColuItems);
                    var frequencyCount = calcResult.sum;
                    var tempPosition = calcResult.positions;

                    localPositions[cItem.join("-").toString()] = tempPosition;
                    localFrequencies[cItem.join("-").toString()] = frequencyCount;
                });
                // 移除频繁度小于设定值的项目
                // console.log(localFrequencies, minSupport, originLen, localPositions);
                var result = self.removeLessMinSupport(localFrequencies, minSupport, originLen, localPositions)
                return result;
            }

            // 差异
            ArrayUtils.generatorColumnVolumeOne = function(len, cpuIntlen) {
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
            // 差异改进  －－》 用原生方法进行二进制运算
            ArrayUtils.andCalcuByRow = function(itemBitNum1, itemBitNum2) {
              if (itemBitNum1.length !== itemBitNum2.length) {
                console.log(itemBitNum1, itemBitNum2, "数据长度不一致");
                return;
              }
              var andResult = [];
              for (var i = 0; i < itemBitNum1.length; i++) {
                var innerResult = itemBitNum1[i] &  itemBitNum2[i];
                if (innerResult < 0 ) {
                  // console.log(itemBitNum1[i] ,  itemBitNum2[i]);
                }
                andResult.push(innerResult);
              }
              // console.log(andResult);
              return andResult;
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
            // 求和 －－》 change
            ArrayUtils.calcuArr = function(arr1) {
              var positions = [];
              var sum = 0;
              var strArr = "";
              arr1.forEach(function(item, index){
                strArr += item.toString(2);
              });
              strArr = strArr.split("");
              strArr.forEach(function(item, index){
                // 转化为二进制字符串
                if (item === "1") {
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
                // console.log(values, "----------------");
                // 根据频繁一项集进行位表简历
                values.forEach(function(value) {
                    var maxValue = _.max(value);
                    if (maxValue > row) {
                        row = maxValue;
                    }
                });
                // console.log(row, "===--------------------");
                var cpuIntlen = 31;
                var columnsNum = self.generatorBitSplitNum(oneItemFrequencyResult, row, oneItemFrequecyPositionObject, cpuIntlen);
                var metureBitArrNum = self.generatorMetureSplitNum(row, cpuIntlen);
                var zeroArray = self.createArray(column, row);
                var resultArr = self.setValue(values, zeroArray);
                return {
                  bitArrayWithVal: resultArr,
                  columnsNum: columnsNum,
                  metureBitArrNum: metureBitArrNum
                };
            }
            ArrayUtils.generatorMetureSplitNum = function(row, cpuIntlen){
              cpuIntlen = cpuIntlen || 31;
              var splitLen =  Math.ceil(row/cpuIntlen);
              var itemBitNum = [];
              var bitArray = new Int8Array(row);
              for (var i = 0; i < bitArray.length; i++) {
                bitArray[i] = 1;
              }
              bitArray = bitArray.join("");
              for (var k = 0; k < splitLen; k++) {
                var subItem = bitArray.substr(k * cpuIntlen, cpuIntlen);
                itemBitNum.push(parseInt(subItem, 2));
              }
              return itemBitNum;
            }
            ArrayUtils.generatorBitSplitNum = function(oneItemFrequencyResult, row, oneItemFrequecyPositionObject, cpuIntlen) {
              var rowIntNumObj = {};
              cpuIntlen = cpuIntlen || 31;
              var splitLen =  Math.ceil(row/cpuIntlen);
              for (var i = 0; i < oneItemFrequencyResult.length; i++) {
                var oneItem = oneItemFrequencyResult[i];
                var positions = oneItemFrequecyPositionObject[oneItem];
                var zeroRowArr = new Int8Array(row);
                for (var j = 0; j < positions.length; j++) {
                  var position = positions[j];
                  zeroRowArr[position] = 1;
                }
                // 分割数据
                var joinArray = zeroRowArr.join('');
                var itemBitNum = [];
                for (var k = 0; k < splitLen; k++) {
                  var subItem = joinArray.substr(k * cpuIntlen, cpuIntlen);
                  itemBitNum.push(parseInt(subItem, 2));
                }
                rowIntNumObj[oneItem] = itemBitNum;
              }
              return rowIntNumObj;
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

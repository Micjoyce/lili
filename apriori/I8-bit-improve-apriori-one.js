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
                var KitemArray = oneItemFrequencyResult;
                var frequentItemSets = oneItemFrequencyCalcu.statisticArray;
                var lItemPositions = oneItemFrequecyPositionObject;
                while (KitemArray.length !== 0) {
                    // ki －－》 c(i+1)
                    var KitemToCitemArray = ArrayUtils.createJoinSets(KitemArray, oneItemFrequencyResult);
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
                for (var i = 0; i < itemSets.length - 1; i++) {
                    var itemX = itemSets[i];
                    // 由于之前做过排序处理，这里的 j 可以从 i+1进行循环便利，及实现itemSets从此项目开始与后面向比较，不需要与排在其
                    // 队列之前的作比较
                    // 将最后为 1 的位置为 0, 110100
                    var itemXToZero = self.setLastOneToZero(itemX, oneItemFrequency);
                    for (var j = i + 1; j < itemSets.length; j++) {
                        var itemY = itemSets[j];
                        var itemYBitArray = [];
                        // 将后一项 以频繁一项集作为标尺，解析位 0、1位位表与前一项，进行 “与” 运算
                        // 当与运算之后的结果与 比较项 十进制 值相同 则表明可以链接 形成c(i+1) 项
                        itemYBitArray = self.kItemToCItemMeture(itemY, oneItemFrequency);
                        var canJoin = self.createJoinSetsCompare(itemXToZero, itemYBitArray);
                        if (canJoin) {
                            var innerTemp = self.joinItemSet(itemX, itemY);
                            if (innerTemp.length > itemX.length) {
                                tempArray.push(innerTemp);
                            }
                        }
                    }
                }
                return tempArray;
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
                var tempArray = [];
                for (var i = 0; i < itemXToZero.length; i++) {
                    var andCalcu = itemXToZero[i] * itemYBitArray[i];
                    tempArray.push(andCalcu);
                }
                var compareToDecimal = self.toDecimal(tempArray.join(""));
                var itemXToDecimal = self.toDecimal(itemXToZero.join(""));
                if (itemXToDecimal === compareToDecimal) {
                    return true;
                }
                return false;
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
            }
            ArrayUtils.cItemToKitem = function(cItems, bitNums, minSupport, oneItemFrequency, originLen, lItemPositions, oneItemFrequecyPositionObject) {
                var self = this;
                var localFrequencies = {};
                var binLength = oneItemFrequency.length;
                var localPositions = {};
                cItems.forEach(function(cItem) {
                    var indexArr = [];
                    indexArr = self.getCItemIndexArr(cItem, oneItemFrequency);
                    var frequencyCount = 0;
                    var positions = self.getMinPositionArray(cItem, lItemPositions, oneItemFrequecyPositionObject);
                    // 从kitem 各项中找出出现次数最短的 位置数组
                    // ===========--------================
                    //cItem: [ 'c', 'e', 'f', 'g' ]
                    //lItemPositions:  { 'a-c-e': [ 0, 6, 7, 12, 14, 16, 18, 20, 22 ],
                    //   'a-c-f': [ 0, 9, 12, 14, 16, 18, 20, 22 ],
                    //   'a-c-g': [ 0, 12, 14, 16, 18, 20, 22 ],
                    //   'a-e-f': [ 0, 12, 14, 16, 18, 20, 22 ],
                    //   'a-e-g': [ 0, 12, 14, 16, 18, 20, 22 ],
                    //   'a-f-g': [ 0, 12, 14, 16, 18, 20, 22 ],
                    //   'c-e-f': [ 0, 2, 12, 14, 16, 18, 20, 22 ],
                    //   'c-e-g': [ 0, 12, 14, 16, 18, 20, 22 ],
                    //   'c-f-g': [ 0, 5, 12, 14, 16, 18, 20, 22 ],
                    //   'd-e-f': [ 10, 11, 13, 15, 17, 19, 21 ],
                    //   'e-f-g': [ 0, 12, 14, 16, 18, 20, 22 ] }
                    //oneItemFrequecyPositionObject:   { a: [ 0, 1, 3, 6, 7, 8, 9, 12, 14, 16, 18, 20, 22 ],
                    //   c: [ 0, 2, 5, 6, 7, 8, 9, 12, 14, 16, 18, 20, 22 ],
                    //   d: [ 3, 5, 6, 10, 11, 13, 15, 17, 19, 21 ],
                    //   e: [ 0, 2, 4, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ],
                    //   f: [ 0, 1, 2, 4, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ],
                    //   g: [ 0, 5, 12, 14, 16, 18, 20, 22 ] }
                    //positions: [ 0, 2, 12, 14, 16, 18, 20, 22 ]
                    // ===========--------================
                    var tempPosition = [];
                    positions.forEach(function(position, index) {
                        var bitNum = bitNums[position];
                        var binArr = self.toBin(bitNum, true, binLength);
                        // 将压缩后的位表（十进制转为二进制）
                        // 根据最短的position，遍历位表（二进制）进行 "与"" 运算，判断在position中是否同时含有各项
                        // 其相当于到position中的每一行查找是否存在各单元项目是否都存在，如果存在则 频繁度 ＋1， 并且将此
                        // position 值保存到tempPosition数组中，形成 lItemPositions
                        var andResult = self.andCalcu(indexArr, binArr);
                        if (andResult === 1) {
                            tempPosition.push(position);
                            frequencyCount += andResult;
                        }
                    });
                    localPositions[cItem.join("-").toString()] = tempPosition;
                    localFrequencies[cItem.join("-").toString()] = frequencyCount;
                });
                // 移除频繁度小于设定值的项目
                var result = self.removeLessMinSupport(localFrequencies, minSupport, originLen, localPositions)
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

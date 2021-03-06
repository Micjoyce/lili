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
                var oneItemFrequencyResult = oneItemFrequencyCalcu.oneItemFrequency;

                //record each oneItemFrequecyResult's position
                var oneItemFrequecyPositionObject= ArrayUtils.getOneItemPosition(oneItemFrequencyResult, transactions);

                //sort oneItemFrequencyResult asc
                oneItemFrequencyResult = oneItemFrequencyResult.sort(function(a, b){
                    return a > b
                });
                var bitArray = ArrayUtils.convertToBitArray(transactions, oneItemFrequencyResult);
                var bitNumbers = ArrayUtils.bitArrayToBitNumber(bitArray);
                //运行时间
                if (self.debugMode) {
                    var startTime = self.getTime(beforeMillis);
                    console.log('Before finding item sets: ' + self.getTime(beforeMillis) + ' ms');
                }



                // start here
                var originLen = transactions.length;
                var KitemArray = oneItemFrequencyResult;
                var frequentItemSets = oneItemFrequencyCalcu.statisticArray;
                while (KitemArray.length !== 0) {
                    var KitemToCitemArray = ArrayUtils.createJoinSets(KitemArray, oneItemFrequencyResult);
                    var kItemAndStatistic = ArrayUtils.cItemToKitem(KitemToCitemArray, bitNumbers, self.minSupport, oneItemFrequencyResult, originLen, oneItemFrequecyPositionObject)
                    KitemArray = kItemAndStatistic.kItem;
                    frequentItemSets = frequentItemSets.concat(kItemAndStatistic.statisticArray)
                }
                if (self.debugMode) {
                    var endTime = self.getTime(beforeMillis);
                    console.log('After finding item sets: ' + self.getTime(beforeMillis) + ' ms');
                }
                //L2-->C3支持度统计优化－－－》
                //----->进一步改善
                //统计算法，统计行数，并进行特定行匹配
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
                        fileds:['key', 'value']
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
            ArrayUtils.findOneItemFrequencies = function(originTransactions, support){
                var oneItemFrequency = {};
                var oneItemFrequencyPostaions = {};
                originTransactions.forEach(function(transaction, index){
                    transaction.forEach(function(item){
                        if (!oneItemFrequency[item.toString()] ) {
                            oneItemFrequency[item.toString()] = 0;    
                        }
                        oneItemFrequency[item.toString()] += 1 ;
                    });
                });
                var keys = _.keys(oneItemFrequency);
                var result = [];
                var fileterKeys = [];
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var frequency =  oneItemFrequency[key]/originTransactions.length;
                    if(frequency >= support){
                        result.push({
                            key: key,
                            value: frequency
                        });
                        fileterKeys.push(key);
                    }
                }
                return {
                    oneItemFrequency: fileterKeys,
                    statisticArray: result
                };
            }
            //this method is convert originTransactions to binary
            ArrayUtils.convertToBitArray = function(originTransactions, oneItemFrequency){
                var resultArray = [];
                originTransactions.forEach(function(transaction){
                    var tempArray = [];
                    oneItemFrequency.forEach(function(oneItem){
                        var foundFlag = false;
                        transaction.forEach(function(item){
                            if (item.toString() === oneItem.toString()) {
                                foundFlag = true;
                            }
                        })
                        if (foundFlag) {
                            tempArray.push(1)
                        }
                        else{
                            tempArray.push(0)
                        }
                    });
                    resultArray.push(tempArray)
                });
                return resultArray;
            }
            ArrayUtils.toBin = function(dec, arrFlag, len){
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
                if(len){
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
            ArrayUtils.toDecimal = function(str){
                return parseInt(str.toString(), 2);
            }
            ArrayUtils.bitArrayToBitNumber = function(bitArray){
                var temp = [];
                var self = this;
                bitArray.forEach(function(item){
                    var joinArray = item.join('');
                    var bitNum = self.toDecimal(joinArray);
                    temp.push(bitNum);
                });
                return temp;
            }
            //ki --> Ci+1
            ArrayUtils.createJoinSets = function(itemSets, oneItemFrequency){
                var self = this;
                var tempArray = [];
                for (var i = 0; i < itemSets.length-1; i++) {
                    var itemX = itemSets[i];
                    var itemXToZero = self.setLastOneToZero(itemX, oneItemFrequency);
                    for (var j = i + 1; j < itemSets.length; j++) {
                        var itemY = itemSets[j];
                        var itemYBitArray = [];
                        itemYBitArray = self.kItemToCItemMeture(itemY, oneItemFrequency);
                        var canJoin = self.createJoinSetsCompare(itemXToZero,itemYBitArray);
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
            ArrayUtils.joinItemSet = function(itemX, itemY){
                var result = []
                if (_.isString(itemX)) {
                    result.push(itemX);
                    result.push(itemY);
                }
                else{
                    result = _.union(itemX, itemY);
                }
                return result;
            }
            ArrayUtils.createJoinSetsCompare = function(itemXToZero, itemYBitArray){
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
            ArrayUtils.setLastOneToZero = function(item, oneItemFrequency){
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
            ArrayUtils.kItemToCItemMeture = function(item, oneItemFrequency){
                //如果是一项集进入时，为string，不需要遍历
                var self = this;
                var metureArray = self.createMeture(oneItemFrequency);
                if (_.isString(item)) {
                    var index = _.indexOf(oneItemFrequency, item);
                    metureArray[index] = 1;
                }

                if (_.isArray(item)) {
                    item.forEach(function(ele){
                        var index = _.indexOf(oneItemFrequency, ele);
                        metureArray[index] = 1;
                    });
                }
                return metureArray;
            }
            ArrayUtils.createMeture = function(oneItemFrequency){
                var tempArray = [];
                oneItemFrequency.forEach(function(oneItem){
                    tempArray.push(0);
                });
                return tempArray;
            }
            ArrayUtils.cItemToKitem = function(cItems, bitNums, minSupport, oneItemFrequency, originLen, oneItemFrequecyPositionObject){
                var self = this;
                var localFrequencies = {};
                var binLength = oneItemFrequency.length;
                cItems.forEach(function(cItem){
                    var indexArr =  [];
                    indexArr = self.getCItemIndexArr(cItem,oneItemFrequency);
                    var frequencyCount = 0;
                    var positions = self.getMinPositionArray(cItem, oneItemFrequecyPositionObject);
                    positions.forEach(function(position, index){
                    	var bitNum = bitNums[position];
                    	var binArr = self.toBin(bitNum, true, binLength);
                        frequencyCount += self.andCalcu(indexArr, binArr);
                    });
                    // bitNums.forEach(function(bitNum){
                    //     var binArr = self.toBin(bitNum, true, binLength);
                    //     frequencyCount += self.andCalcu(indexArr, binArr);
                    // });
                    localFrequencies[cItem.join("-").toString()] = frequencyCount;
                });
                var result = self.removeLessMinSupport(localFrequencies, minSupport, originLen)
                return result;
            }
            ArrayUtils.getMinPositionArray = function(cItem, oneItemFrequecyPositionObject){
            	var minItem = cItem[0];
            	var minLen = oneItemFrequecyPositionObject[minItem].length;
            	for (var i = 1; i < cItem.length; i++) {
            		var item = cItem[i];
            		if (oneItemFrequecyPositionObject[item].length < minLen) {
            			minLen = oneItemFrequecyPositionObject[item].length;
            			minItem = item;
            		}
            	}
            	return oneItemFrequecyPositionObject[minItem];
            }
            ArrayUtils.removeLessMinSupport = function(localFrequencies, minSupport, originLen){
                var allKeys = _.keys(localFrequencies);
                // var allValues = _.values(localFrequencies);
                var tempArray = [];
                var statisticArray = [];
                for (var i = 0; i < allKeys.length; i++) {
                    var key = allKeys[i];
                    if(localFrequencies[key]/originLen >= minSupport){
                        //可以在此进行数据结果
                        statisticArray.push({
                            key: key,
                            value: localFrequencies[key]/originLen
                        })
                        tempArray.push(key.split("-"));
                    }
                }
                return {
                    kItem: tempArray,
                    statisticArray: statisticArray
                };
            }
            ArrayUtils.andCalcu = function(indexArr, binArr){
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
            ArrayUtils.getCItemIndexArr = function(cItem, oneItemFrequency){
                //less to item
                var indexArray = [];
                cItem.forEach(function(item){
                    var index = _.indexOf(oneItemFrequency, item);
                    return indexArray.push(index);
                });
                return indexArray;
            }
            ArrayUtils.getOneItemPosition = function(oneItemFrequency, transactions){
                var self = this;
                if (!oneItemFrequency || !transactions) {
                    throw "oneItemFrequency or transactions is undefined"
                }
                var result = {};
                oneItemFrequency.forEach(function(item, index){
                    transactions.forEach(function(transaction, tIndex){
                        if (self.isSubItem(item, transaction)){
                            if (!result[item.toString()]) {
                                result[item.toString()] = [];
                            }
                            result[item.toString()].push(tIndex);
                        }
                    });
                });
                return result;
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

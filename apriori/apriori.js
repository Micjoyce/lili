(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define('apriori', [], factory);
    }
    else {
        root['Apriori'] = factory();
    }
}(this, function() {

'use strict';
var Apriori;
var json2csv = require('json2csv');
var Combinatorics = require('js-combinatorics');
(function (Apriori) {
    var AnalysisResult = (function () {
        function AnalysisResult(frequentItemSets, associationRules) {
            this.frequentItemSets = frequentItemSets;
            this.associationRules = associationRules;
        }
        return AnalysisResult;
    })();
    Apriori.AnalysisResult = AnalysisResult;

    var FrequentItemSet = (function () {
        function FrequentItemSet(itemSet, support) {
            this.itemSet = itemSet;
            this.support = support;
        }
        return FrequentItemSet;
    })();
    Apriori.FrequentItemSet = FrequentItemSet;

    var AssociationRule = (function () {
        function AssociationRule(lhs, rhs, confidence) {
            this.lhs = lhs;
            this.rhs = rhs;
            this.confidence = confidence;
        }
        return AssociationRule;
    })();
    Apriori.AssociationRule = AssociationRule;

    var Algorithm = (function () {
        function Algorithm(minSupport, minConfidence, debugMode) {
            this.minSupport = minSupport ? minSupport === 0 ? 0 : minSupport : 0.15;
            this.minConfidence = minConfidence ? minConfidence === 0 ? 0 : minConfidence : 0.6;
            this.debugMode = debugMode || false;
        }
        Algorithm.prototype.analyze = function (transactions) {
            var self = this;
            var beforeMillis = new Date().getTime();

            var frequencies = {};
            var frequentItemSets = {};

            var oneElementItemSets = self.toOneElementItemSets(transactions);
            var oneCItemSets = self.findItemSetsMinSupportSatisfied(oneElementItemSets, transactions, self.minSupport, frequencies);
            var currentLItemSets = oneCItemSets;
            var itemSetSize = 1;

            //运行时间
            if (self.debugMode) {
                var startTime = self.getTime(beforeMillis)
                console.log('Before finding item sets: ' + self.getTime(beforeMillis) + ' ms');
            }
            var extractItemSet = function (f) {
                return f.itemSet;
            };
            while (currentLItemSets.length !== 0) {
                frequentItemSets[itemSetSize] = currentLItemSets;
                var joinedSets = ArrayUtils.toFixedSizeJoinedSets(currentLItemSets.map(extractItemSet), itemSetSize + 1);
                currentLItemSets = self.findItemSetsMinSupportSatisfied(joinedSets, transactions, self.minSupport, frequencies);
                itemSetSize += 1;
            }
            if (self.debugMode) {
                var endTime = self.getTime(beforeMillis)
                console.log('After finding item sets: ' + self.getTime(beforeMillis) + ' ms');
            }
            return {data:frequentItemSets, startTime: startTime, endTime:endTime};
        };

        Algorithm.prototype.toOneElementItemSets = function (transactions) {
            //transactions 初始化数据
            var nestedArrayOfItem = [];
            transactions.forEach(function (transaction) {
                transaction.forEach(function (item) {
                    nestedArrayOfItem.push(new Array(item));
                });
            });

            //nestedArrayOfItem 遍历执行所有的数据
            return ArrayUtils.toArraySet(nestedArrayOfItem);
        };

        //
        Algorithm.prototype.findItemSetsMinSupportSatisfied = function (itemSets, transactions, minSupport, frequencies) {
            var filteredItemSets = [], localFrequencies = {};

            itemSets.forEach(function (itemSet) {
                transactions.forEach(function (transaction) {
                    if (ArrayUtils.isSubSetArrayOf(itemSet, transaction)) {
                        if (!frequencies[itemSet.toString()])
                            frequencies[itemSet.toString()] = 0;
                        if (!localFrequencies[itemSet.toString()])
                            localFrequencies[itemSet.toString()] = 0;
                        frequencies[itemSet.toString()] += 1;
                        localFrequencies[itemSet.toString()] += 1;
                    }
                });
            });
            var alreadyAdded = false;
            var setAsAlreadyAddedIfFound = function (f) {
                if (!alreadyAdded)
                    alreadyAdded = f.itemSet.toString() === itemSet.toString();
            };
            for (var strItemSet in localFrequencies) {
                var itemSet = strItemSet.split(',').sort(), localCount = localFrequencies[itemSet.toString()], support = localCount / transactions.length;

                if (support >= minSupport) {
                    alreadyAdded = false;
                    filteredItemSets.forEach(setAsAlreadyAddedIfFound);
                    if (!alreadyAdded) {
                        filteredItemSets.push(new FrequentItemSet(itemSet, support));
                    }
                }
            }
            return filteredItemSets;
        };

        Algorithm.prototype.showAnalysisResultFromFile = function (filename) {
            var self = this;
            require('fs').readFile(filename, 'utf8', function (err, data) {
                if (err)
                    throw err;
                var transactions = ArrayUtils.readCSVToArray(data, ',');
                var analysisResult = self.analyze(transactions);
                var formatResult =  ArrayUtils.formatData(analysisResult.data);
                var calcuTime = {itemSet: analysisResult.startTime, support: analysisResult.endTime};
                formatResult.unshift(calcuTime);
                json2csv({ data: formatResult}, function(err, csv) {
                  if (err) throw err;
                  require("fs").writeFile("support.csv",csv,function(err){
                        if(err) throw err;
                  });
                });
            });
        };

        Algorithm.prototype.getTime = function (initial) {
            return new Date().getTime() - initial;
        };
        return Algorithm;
    })();
    Apriori.Algorithm = Algorithm;

    var ArrayUtils = (function () {
        function ArrayUtils() {
        }
        ArrayUtils.formatData = function (data){
            var resultData = [];
            for(var i = 0 ; i < 100; i++){
                if(data[i]){
                    var innerArray = data[i];
                    for(var j = 0; j < innerArray.length; j++){
                        resultData.push(innerArray[j]);
                    }
                }
            }
            return resultData;
        }
        ArrayUtils.toStringSet = function (array) {
            var uniqueArray = [];
            array.forEach(function (e) {
                if (uniqueArray.indexOf(e) === -1)
                    uniqueArray.push(e);
            });
            return uniqueArray;
        };
        ArrayUtils.toArraySet = function (arrayOfArray) {
            var foundElements = {}, uniqueArray = [];
            arrayOfArray.forEach(function (array) {
                if (!foundElements.hasOwnProperty(array.toString())) {
                    uniqueArray.push(array);
                    foundElements[array.toString()] = true;
                }
            });
            return uniqueArray;
        };
        ArrayUtils.toAllSubSets = function (array) {
            var op = function (n, sourceArray, currentArray, allSubSets) {
                if (n === 0) {
                    if (currentArray.length > 0) {
                        allSubSets[allSubSets.length] = ArrayUtils.toStringSet(currentArray);
                    }
                } else {
                    for (var j = 0; j < sourceArray.length; j++) {
                        var nextN = n - 1, nextArray = sourceArray.slice(j + 1), updatedCurrentSubSet = currentArray.concat([sourceArray[j]]);
                        op(nextN, nextArray, updatedCurrentSubSet, allSubSets);
                    }
                }
            };
            var allSubSets = [];
            array.sort();
            for (var i = 1; i < array.length; i++) {
                op(i, array, [], allSubSets);
            }
            allSubSets.push(array);
            return ArrayUtils.toArraySet(allSubSets);
        };

        
        ArrayUtils.toFixedSizeJoinedSets = function (itemSets, length) {
            var joinedSetArray = [];
            itemSets.forEach(function (itemSetA) {
                itemSets.forEach(function (itemSetB) {
                    if (ArrayUtils.getDiffArray(itemSetA, itemSetB).length > 0) {
                        var mergedArray = [].concat(itemSetA).concat(itemSetB), joinedSet = ArrayUtils.toStringSet(mergedArray);
                        if (joinedSet.length === length)
                            joinedSetArray.push(joinedSet);
                    }
                });
            });
            return ArrayUtils.toArraySet(joinedSetArray);
        };

        //判断其子集是否是频繁集
        ArrayUtils.isSubSetArrayOf = function (targetArray, superSetArray) {
            var isSubSetArray = true;
            targetArray.forEach(function (item) {
                if (isSubSetArray && superSetArray.indexOf(item) === -1)
                    isSubSetArray = false;
            });
            return isSubSetArray;
        };

        ArrayUtils.getDiffArray = function (arrayA, arrayB) {
            var diffArray = [];
            arrayA.forEach(function (e) {
                if (arrayB.indexOf(e) === -1)
                    diffArray.push(e);
            });
            return diffArray;
        };
        ArrayUtils.readCSVToArray = function (inputString, delimiter) {
            delimiter = delimiter || ',';
            var regexp = new RegExp(("(\\" + delimiter + "|\\r?\\n|\\r|^)" + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + "([^\"\\" + delimiter + "\\r\\n]*))"), 'gi');

            var arrayOfRows = [[]];
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
        return ArrayUtils;
    })();
    Apriori.ArrayUtils = ArrayUtils;
})(Apriori || (Apriori = {}));
//# sourceMappingURL=apriori.js.map


return Apriori;

}));

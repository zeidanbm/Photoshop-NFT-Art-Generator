#include "./lib/json2.js";
#include "./helpers/index.jsx";

/**
 * udpate stacked layer rules, returns false if conditions fail
 * @param {string} _layerName
 * @param {string} _layerGroup
 * @param {obj} _stackedRules
 */
 function updateRules(_layerName, _layerGroup, _stackedRules) { 
    var layerRules = CONDITIONS[_layerName];

    if(checkIfContains(_stackedRules.groups, _layerGroup)) {
        if(!checkIfContains(_stackedRules.layers, _layerName)) {
            return false;
        }
    }

    // if no conditions then return old conditions
    if (!layerRules) {      
        return _stackedRules;
    }

    _stackedRules.groups = _stackedRules.groups.concat(layerRules.groups);
    _stackedRules.layers = _stackedRules.layers.concat(layerRules.layers);
    
    return _stackedRules;
}

function pickLayerByWeight(group, groupLength, threshold, groupName, totalWeight, stackedRules) {
    // loop over layers in current group to pick one layer based on the random value
    var breakCheck = false;
    var layerWeight = 0;
    var layerName;
    for (var j = 0; j < groupLength; j++) {
        layerName = cleanName(group.layers[j].name);
        layerWeight = getRWeights(group.layers[j].name) || 1;
        threshold -= layerWeight;
        if (threshold < 0) {
            // check layer rules
            var rules = updateRules(layerName, groupName, stackedRules);
            // // if conditions fail
            if (!rules) {
                if((j+1) === groupLength) {
                    breakCheck = true;
                    break;
                }
                continue;
            }
            group.layers[j].visible = true;
            // logData(JSON.stringify({rules: rules, stackedRules: stackedRules, layerName: layerName, groupName: groupName}), groupIndx);
            return { index: j, layerName: layerName, rules: rules };
        }
    }

    if(breakCheck) {
        // remove the last layer and pick a new threshold
        totalWeight = totalWeight - layerWeight
        threshold = Math.floor(Math.random() * totalWeight);
        groupLength = groupLength - 1;
        return pickLayerByWeight(group, groupLength, threshold, groupName, totalWeight, stackedRules);
    }
}

var CONDITIONS = parseJsonFile('/setup/conditions.json');
var INITAL_GROUPS = parseJsonFile('/setup/groups.json');
main(true);

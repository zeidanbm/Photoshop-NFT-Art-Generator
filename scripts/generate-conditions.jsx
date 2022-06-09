#include "./lib/json2.js";
#include "./helpers/index.jsx";

function resetStackedRules() {
    STACKED_RULES = {
        groups: [],
        layers: []
    };
}

/**
 * udpate stacked layer rules, returns false if conditions fail
 * @param {string} _layerName
 * @param {string} _layerGroup
 */
 function updateRules(_layerName, _layerGroup) { 
    var layerRules = CONDITIONS[_layerName];

    if(checkIfArrayContains(STACKED_RULES.groups, _layerGroup)) {
        if(!checkIfArrayContains(STACKED_RULES.layers, _layerName)) {
            return false;
        }
    }

    // if no conditions for current layer
    if (!layerRules) {      
        return true;
    }

    STACKED_RULES.groups = STACKED_RULES.groups.concat(layerRules.groups);
    STACKED_RULES.layers = STACKED_RULES.layers.concat(layerRules.layers);
    
    return true;
}

function pickLayerByWeight(group, groupLength, threshold, groupName, totalWeight) {
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
            var rules = updateRules(layerName, groupName);
            // // if conditions fail
            if (!rules) {
                if((j+1) === groupLength) {
                    breakCheck = true;
                    break;
                }
                continue;
            }
            group.layers[j].visible = true;
            // logData(JSON.stringify({rules: rules, stackedRules: STACKED_RULES, layerName: layerName, groupName: groupName}), groupIndx, 'logs');
            return { index: j, layerName: layerName, rules: rules };
        }
    }

    if(breakCheck) {
        // remove the last layer and pick a new threshold
        totalWeight = totalWeight - layerWeight
        threshold = Math.floor(Math.random() * totalWeight);
        groupLength = groupLength - 1;
        return pickLayerByWeight(group, groupLength, threshold, groupName, totalWeight);
    }
}

var STACKED_RULES = {
    groups: [],
    layers: []
};
var CONDITIONS = parseJsonFile('/setup/conditions.json');
var INITAL_GROUPS = parseJsonFile('/setup/groups.json');

app.doForcedProgress("Generating NFTs...", 'main(true)');

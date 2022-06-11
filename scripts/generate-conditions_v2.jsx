#include "./lib/json2.js";
#include "./helpers/index.jsx";

function resetStackedRules() {
    STACKED_RULES = {
        rejected: [],
        only: {}
    };
}

/**
 * udpate stacked layer rules, returns false if conditions fail
 * @param {string} _layerName
 */
 function checkLayerRules(_layerName, groupName) { 
    var layerRules = CONDITIONS[_layerName];
    var onlyFlag = false; // if we detected layer in only, i.e only takes precedence over rejected

    // check if the layer is among the only accepted for the current groupName
    if(STACKED_RULES.only[groupName]) {
        if(!checkIfArrayContains(STACKED_RULES.only[groupName], _layerName)) {
            return false;
        }
        onlyFlag = true;
    }

    // if current layer is rejected
    if(!onlyFlag && checkIfArrayContains(STACKED_RULES.rejected, _layerName)) {
        return false;
    }

    // store conditions for current layer
    if (layerRules.rejected) {   
        STACKED_RULES.rejected = (layerRules.rejected) ? STACKED_RULES.rejected.concat(layerRules.rejected) : STACKED_RULES.rejected;
    }

    if(layerRules.only) {
        for (var _g in layerRules.only){
            STACKED_RULES.only[_g] = STACKED_RULES.only[_g] ? STACKED_RULES.only[_g].concat(layerRules.only[_g]) : layerRules.only[_g]
        }   
    }

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
            var canUseLayer = checkLayerRules(layerName, groupName);
            //logData(JSON.stringify({canUseLayer: canUseLayer, stackedRules: STACKED_RULES, layerName: layerName, groupName: groupName}), j + '-' + groupName, 'logs');
            if(canUseLayer) {
                group.layers[j].visible = true;
                return { index: j, layerName: layerName };
            }
            
            // if we are at last layer and we still do not have a match => break and re-pick layer from current group
            if(j === groupLength - 1) {
                breakCheck = true;
                break;
            }
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
    rejected: [],
    only: {}
};
var CONDITIONS = parseJsonFile('/setup/conditions.json');
var INITAL_GROUPS = parseJsonFile('/setup/groups.json');

app.togglePalettes();
app.doForcedProgress("Generating NFTs...", 'main(true)');
app.togglePalettes();
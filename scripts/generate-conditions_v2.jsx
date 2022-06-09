#include "./lib/json2.js";
#include "./helpers/index.jsx";

function resetStackedRules() {
    STACKED_RULES = [];
}

/**
 * udpate stacked layer rules, returns false if conditions fail
 * @param {string} _layerName
 */
 function checkLayerRules(_layerName) { 
    var layerRules = CONDITIONS[_layerName];

    // if current layer is found in the conditions array
    if(checkIfArrayContains(STACKED_RULES, _layerName)) {
        return false;
    }

    // if no conditions for current layer
    if (!layerRules) {   
        return true;   
    }
    STACKED_RULES = STACKED_RULES.concat(layerRules);
    
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
            var canUseLayer = checkLayerRules(layerName);
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

var STACKED_RULES = [];
var CONDITIONS = parseJsonFile('/setup/conditions.json');
var INITAL_GROUPS = parseJsonFile('/setup/groups.json');

// var dlg = new Window('palette')
// dlg.cancelBtn = dlg.add('button',undefined,'Stop Script')
// dlg.cancelBtn.onClick = function(){ alert('wtf') }
// dlg.show();

app.doForcedProgress("Generating NFTs...", 'main(true)');

#include "./lib/json2.js";
#include "./helpers/index.jsx";

/**
 * Choose layer by weight
 * @param {obj} group
 * @param {number} groupLength
 * @param {number} threshold
 * @param {number} totalWeight
 * @returns
 */
function pickLayerByWeight(group, groupLength, threshold, groupName, totalWeight) {
    // loop over layers in current group to pick one layer based on the random value
    for (var j = 0; j < groupLength; j++) {
        var layerName = cleanName(group.layers[j].name);
        var layerWeight = getRWeights(group.layers[j].name) || 1;
        // Add the weight to our running total.
        threshold -= layerWeight;
        // If this value falls within the threshold, we're done!
        if (threshold < 0) {
            // check layer rules
            group.layers[j].visible = true;
            return { index: j, layerName: layerName };
        }
    }
}

app.doForcedProgress("Generating NFTs...", 'main(false)');
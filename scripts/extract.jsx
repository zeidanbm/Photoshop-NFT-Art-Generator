#include "./lib/json2.js";
#include "./helpers/index.jsx";

/**
 * Extract all layers
 * @param {any} _groups
 */
 function extractLayers(_groups) {
    var groupsArray = []
    var layersArray = []
    var layerCountAgg = {}
    var _result = {}

    for (var i = 0; i < _groups.length; i++) {
        _cleanGroupName = cleanName(_groups[i].name)
        groupsArray.push(_cleanGroupName)
        tmp = i > 0 ? layerCountAgg[cleanName(_groups[i-1].name)] : 0
        layerCountAgg[_cleanGroupName] = tmp + _groups[i].layers.length

        for (var j = 0; j < _groups[i].layers.length; j++) {
            layersArray.push(cleanName(_groups[i].layers[j].name))
        }
    }

    logData(layerCountAgg, 'layer-count-agg', 'setup')
    logData(layersArray, 'all-layers', 'setup')
    logData(groupsArray, 'all-groups', 'setup')

    for (var i = 0; i < _groups.length - 1; i++) {
        currentGroups = groupsArray.slice(i+1)
        currentLayers = layersArray.slice(layerCountAgg[groupsArray[i]])

        for (var j = 0; j < _groups[i].layers.length; j++) {
            _result[cleanName(_groups[i].layers[j].name)] = {
                layers: currentLayers,
                groups: currentGroups
            }
        }
    }

    return _result
}

var groups = app.activeDocument.layerSets;

var result = extractLayers(groups)
logData(result, 'all-conditions', 'setup')
alert("Extraction process is complete.");
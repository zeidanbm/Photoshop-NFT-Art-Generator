#include "./lib/json2.js";
#include "./helpers/index.jsx";

/**
 * Extract all layers
 * @param {any} _groups
 */
 function extractLayers(_groups) {
    var _result = {};

    for (var i = 0; i < _groups.length; i++) {
        var _cleanGroupName = cleanName(_groups[i].name);
        layersArray = []

        for (var j = 0; j < _groups[i].layers.length; j++) {
            var _cleanLayerName = cleanName(_groups[i].layers[j].name);
            layersArray.push(_cleanLayerName)

            if(!_result[_cleanLayerName]) {
                _result[_cleanLayerName] = {
                    rejected: false,
                    only: false
                };
            }
        }
    }

    return _result
}

var groups = app.activeDocument.layerSets;

var result = extractLayers(groups)
logData(result, 'all-conditions_v2', 'setup')
alert("Extraction process is complete.");
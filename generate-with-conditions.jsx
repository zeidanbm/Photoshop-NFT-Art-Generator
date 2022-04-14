#target photoshop

#include "./lib/json2.js";

// bring application forward for double-click events
app.bringToFront();
var start = new Date();

function main() {
    var continueConfirmation = confirm(
        "You are about to use the cyber genie art generator. Are you sure you want to continue?"
    );

    if (!continueConfirmation) return;

    var supply = prompt("How many images do you want to generate?", "10");

    var name = prompt("What is the name of your collection?", "Cyber Genie NFT");

    var description = prompt("What is the description for your collection?", "");

    var hasDNA = prompt("Do you want to use a DNA to make sure generated NFTs are unique? (1=>yes, 0=>no)", "1");
    hasDNA = parseInt(hasDNA);

    var hasConditions = prompt("Do you want to use a conditions? (1=>yes, 0=>no)", "1");
    hasConditions = parseInt(hasConditions);

    alert(
        supply +
        " images will be generated, so sit back relax and enjoy the art being generated."
    );

    var groups = app.activeDocument.layerSets;
    resetLayers(groups);

    /**
     * Generate a unique hash code
     * @param {string} _str
     */
    function hashCode(_str) {
        if(!_str) {
            return false;
        }
        var hash = 0;
        var i = 0;
        var len = _str.length;
        while (i < len) {
            hash = ((hash << 5) - hash + _str.charCodeAt(i++)) << 0;
        }
        return hash + 2147483647 + 1;
    }


    function getCommonItems(array1, array2) {
        var common = []; // Initialize array to contain common items
        
        for (var i = 0; i < array1.length; i++) {
            for (var j = 0; j < array2.length; j++) {
            if (array1[i] == array2[j]) { // If item is present in both arrays
                common.push(array1[i]); // Push to common array
            }
            }
        }
        
        return (common.length) ? common : false; // Return the common items
    }

    /**
     * Check if array contains element
     * @param {array} a
     * @param {any} obj
     */
    function checkIfContains(a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    /**
     * Read the conditions from the json file
     * @param {string} _filename
     */
    function parseConditions(_filename) {
        var path = app.activeDocument.path;
        var jsonFile = new File(path + '/' + _filename);
        jsonFile.open('r');
        var str = jsonFile.read();
        jsonFile.close();

        if(!str) {
            hasConditions = 0;
            return;
        }

        return JSON.parse(str);
    }
    var CONDITIONS = parseConditions('conditions.json');

    /**
    * Get layer weight
    * @param {string} _layerName
    */
    function getRWeights(_layerName) {
        return + _layerName.split("#").pop();
    }

   /**
   * udpate stacked layer rules, returns false if conditions fail
   * @param {string} _layerName
   * @param {string} _layerGroup
   * @param {obj} _stackedRules
   */
    function updateRules(_layerName, _layerGroup, _stackedRules) { 
        var layerRules = CONDITIONS[_layerName];

        // check the selected layer against the stacked rules
        if(_stackedRules[_layerGroup] && !checkIfContains(_stackedRules[_layerGroup], _layerName)) {
            return false;
        }
        // if we don't have any rules for the selected layer
        if (!layerRules) {      
            return _stackedRules;
        }
        
        for(var i = 0; i < layerRules.length; i++) {
            var _groupName = layerRules[i].group;
            // logData(JSON.stringify({"_layerRules": layerRules, "groupName": _groupName }), 'cond-' + i);    
            // if we don't have any rules for the selected group then store them in the _stackedRules
             if(!_stackedRules[_groupName]) {
                _stackedRules[_groupName] = layerRules[i].layers;
                continue;
            }
            // check if we have common layer group rules
            var common = getCommonItems(layerRules[i].layers, _stackedRules[_groupName]);
             if(!common) {
                return false;
             }
             _stackedRules[_groupName] = common;
        }
        return _stackedRules;
    }

    /**
    * Get layer name without '#N'
    * @param {string} _str
    */
    function cleanName(_str) {
        return _str.split("#").shift();
    }

    function pickLayerByWeight(groupIndx, totalWeight, groupName, stackedRules) {
        // pick a random number between 0 and totalWeight (normal distribution)
        // logData(JSON.stringify({rules: stackedRules, totalWeight: totalWeight, groupName: groupName}), groupIndx);
        var threshold = Math.floor(Math.random() * totalWeight);
        var breakCheck1 = false;
        var total = 0;
        // loop over layers in current group to pick one layer based on the random value
        for (var j = 0; j < groups[groupIndx].layers.length; j++) {
            var layerName = cleanName(groups[groupIndx].layers[j].name);
            var layerWeight = getRWeights(groups[groupIndx].layers[j].name) || 1;
            // Add the weight to our running total.
            threshold -= layerWeight;
            // If this value falls within the threshold, we're done!
            if (threshold < 0) {
                // check layer rules
                if(hasConditions) {
                    var rules = updateRules(layerName, groupName, stackedRules);
                    // // if conditions fail
                    if (!rules) {
                        if((j+1) === groups[groupIndx].layers.length) {
                            breakCheck1 = true;
                            break;
                        }
                        continue;
                    }
                }
                
                groups[groupIndx].layers[j].visible = true;
                // logData(JSON.stringify({rules: rules, stackedRules: stackedRules, layerName: layerName, groupName: groupName}), groupIndx);
                return { index: j, layerName: layerName, rules: rules };
            }
        }
        // re-run the function if conditions failed and no layer was selected
        if(breakCheck1) {
            return pickLayerByWeight(groupIndx, totalWeight, groupName, stackedRules);
        }
    }

    var dna = {};
    // loop over the supply i.e total pieces to generate
    for (var h = 1; h < parseInt(supply) + 1; h++) {
        var obj = {};
        obj.name = name + " #" + h;
        obj.description = description;
        obj.image = "To be replaced";
        obj.edition = h;
        obj.attributes = [];
        var hashTable = {};
        var selectedLayerMap = {};
        var stackedRules = {};
        // loop over all groups
        for (var i = 0; i < groups.length; i++) {
            var totalWeight = getRWeights(groups[i].name) || groups[i].layers.length;
            var groupName = cleanName(groups[i].name);

            var resutls = pickLayerByWeight(i, totalWeight, groupName, stackedRules);
            // store selected groups and layers for current image, to be used in checking conditions for next selected layer
            stackedRules = resutls.rules
            hashTable[groupName] = resutls.layerName;
            selectedLayerMap[i] = resutls.index;
            obj.attributes.push({
                trait_type: groupName,
                value: resutls.layerName
            })
        }
        // get image DNA
        if(hasDNA) {
            var hash = hashCode(JSON.stringify(hashTable));
            // check if dna exits, skip if true and store value if false
            if (dna[hash]) {
                if(h >= 1) {
                    h--;
                }
                resetLayersOptimized(groups, selectedLayerMap);
                continue;
            }
            dna[hash] = true;
            obj.dna = hash;
        }
        saveImage(obj.edition);
        saveMetadata(obj);
        resetLayersOptimized(groups, selectedLayerMap);
    }
    var timer = (new Date() - start) / 1000;
    alert("Generation process is complete.");
    alert(timer + " seconds");
}

/**
 * Turn all groups on and all selected layers off
 * @param {any} _groups
* @param {obj} _selectedLayerMap
 */
function resetLayersOptimized(_groups, _selectedLayerMap) {
    for (var i = 0; i < _groups.length; i++) {
        _groups[i].visible = true;
        if(_selectedLayerMap[i] != undefined) {
            _groups[i].layers[_selectedLayerMap[i]].visible = false; 
        }
    }
}

/**
 * Turn all groups on and all group layers off
 * @param {any} _groups
 */
function resetLayers(_groups) {
    for (var i = 0; i < _groups.length; i++) {
        _groups[i].visible = true;
        
        for (var j = 0; j < _groups[i].layers.length; j++) {
            _groups[i].layers[j].visible = false;
        }
    }
}

function saveImage(_edition) {
    var saveFile = new File(toFolder("build/images") + "/" + _edition + ".png");
    exportOptions = new ExportOptionsSaveForWeb();
    exportOptions.format = SaveDocumentType.PNG;
    exportOptions.PNG24 = true;
    exportOptions.transparency = true;
    exportOptions.interlaced = false;
    app.activeDocument.exportDocument(
        saveFile,
        ExportType.SAVEFORWEB,
        exportOptions
    );
}

function logData(_data, _name) {
    var file = new File(toFolder("logs") + "/" + _name + ".json");
    file.open("w");
    file.write(JSON.stringify(_data));
    file.close();
}


function saveMetadata(_data) {
    var file = new File(toFolder("build/metadata") + "/" + _data.edition + ".json");
    file.open("w");
    file.write(JSON.stringify(_data));
    file.close();
}

function toFolder(_name) {
    var path = app.activeDocument.path;
    var folder = new Folder(path + "/" + _name);
    if (!folder.exists) {
        folder.create();
    }
    return folder;
}


main();

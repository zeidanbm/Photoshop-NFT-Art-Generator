#include "./lib/json2.js";

// bring application forward for double-click events
app.bringToFront();
app.preferences.exportClipboard = false;
var start = new Date();
var totalGenerated = 1;

/**
 * Import json file
 * @param {string} _filePath
 */
function parseJsonFile(_filePath) {
    var path = app.activeDocument.path;
    var jsonFile = new File(path + _filePath);
    jsonFile.open('r');
    var str = jsonFile.read();
    jsonFile.close();

    if(!str) {
        return;
    }

    return JSON.parse(str);
}

/**
* Get layer weight
* @param {string} _layerName
*/
function getRWeights(_layerName) {
    return + _layerName.split("#").pop();
}

/**
* Get layer name without '#N'
* @param {string} _str
*/
function cleanName(_str) {
    return _str.split("#").shift();
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

function main(canHaveGroups) {
    var continueConfirmation = confirm(
        "You are about to use the cyber genie art generator. Are you sure you want to continue?"
    );

    if (!continueConfirmation) return;
    
    var hasGroups = false;
    if(canHaveGroups) {
        hasGroups = prompt("Do you want to use the groups setup file?(1=>yes, 0=>no)", "0");
        hasGroups = parseInt(hasGroups);
    }

    var supply = '';
    if(!hasGroups) {
        supply = prompt("How many images do you want to generate?", "10");
        supply = parseInt(supply);
    }

    var name = prompt("What is the name of your collection?", "Cyber Genie NFT");

    var description = prompt("What is the description for your collection?", "");

    var hasDNA = prompt("Do you want to use a DNA to make sure generated NFTs are unique? (1=>yes, 0=>no)", "0");
    hasDNA = parseInt(hasDNA);

    alert(
        supply +
        " images will be generated, so sit back relax and enjoy the art being generated."
    );

    var groups = app.activeDocument.layerSets;
    resetLayers(groups);
    if(!hasGroups) {
        generateNFTs(groups, supply, name, description, hasDNA, false);
    } else {
        for(var g = 0; g < INITAL_GROUPS.length; g++) {
            generateNFTs(groups, parseInt(INITAL_GROUPS[g].supply), name, description, hasDNA, INITAL_GROUPS[g].groups);
        }
    }

    var timer = (new Date() - start) / 1000;
    alert("Generation process is complete.");
    alert(timer + " seconds");
}

function generateNFTs(_groups, _supply, _name, _description, _hasDNA, _selectedGroups) {
    if(!_selectedGroups) {
        _selectedGroups = _groups;
    }
    var dna = {};
    // update the supply
    _supply = _supply + totalGenerated;
    // loop over the supply i.e total pieces to generate
    for (; totalGenerated < _supply; totalGenerated++) {
        var obj = {};
        obj.name = _name + " #" + totalGenerated;
        obj.description = _description;
        obj.image = "To be replaced";
        obj.edition = totalGenerated;
        obj.attributes = [];
        var hashTable = {};
        var selectedLayerMap = {};
        var stackedRules = {
            groups: [],
            layers: []
        };
        // loop over all groups
        for (var i = 0; i < _selectedGroups.length; i++) {
            var groupIndex = _selectedGroups[i].index || i;
            // logData(JSON.stringify({groupIndex: groupIndex, name: _groups[groupIndex].name}), i, 'logs');
            var totalWeight = getRWeights(_groups[groupIndex].name) || _groups[groupIndex].layers.length;
            var groupName = cleanName(_groups[groupIndex].name);
            var groupLength = _groups[groupIndex].layers.length;
            // pick a random number between 0 and totalWeight (normal distribution)
            var threshold = Math.floor(Math.random() * totalWeight);

            var results = pickLayerByWeight(_groups[groupIndex], groupLength, threshold, groupName, totalWeight, stackedRules);
            stackedRules = results.rules;
            hashTable[groupName] = results.layerName;
            selectedLayerMap[groupIndex] = results.index;
            obj.attributes.push({
                trait_type: groupName,
                value: results.layerName
            })
        }
        // get image DNA
        if(_hasDNA) {
            _hasDNA++;
            if(_hasDNA > (_supply + totalGenerated) * 0.5) {
                throw "Too little combinations to generate unique NFTs. Aborting...";
            }
            var hash = hashCode(JSON.stringify(hashTable));
            // check if dna exits, skip if true and store value if false
            if (dna[hash]) {
                if(totalGenerated >= 1) {
                    totalGenerated--;
                }
                resetLayersOptimized(_groups, selectedLayerMap);
                continue;
            }
            dna[hash] = true;
            obj.dna = hash;
        }
        saveImage(obj.edition);
        saveMetadata(obj);
        resetLayersOptimized(_groups, selectedLayerMap);
    }
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
 * Turn all parent groups visibility on and all children groups/layers off
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
    var saveOptions = new PNGSaveOptions();
    saveOptions.interlaced = false;
    app.activeDocument.saveAs(saveFile, saveOptions, true, Extension.LOWERCASE);
}

function saveMetadata(_data) {
    var file = new File(toFolder("build/metadata") + "/" + _data.edition + ".json");
    file.open("w");
    file.write(JSON.stringify(_data));
    file.close();
}

function logData(_data, _name, _folder) {
    var file = new File(toFolder(_folder) + "/" + _name + ".json");
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


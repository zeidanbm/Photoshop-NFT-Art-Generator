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

    var hasDNA = prompt("Do you want to use DNA to make sure generated NFTs are unique? (1=>yes, 0=>no)", "1");

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
        
        return common; // Return the common items
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
        var jsonFile = new File(path + '/' + _filename)
        jsonFile.open('r');
        var str = jsonFile.read();
        jsonFile.close();

        return JSON.parse(str);
    }

    // var conditions = parseConditions('conditions.json');

    /**
    * Get layer weight
    * @param {string} _layerName
    */
    function getRWeights(_layerName) {
        return + _layerName.split("#").pop();
    }

   /**
   * udpate stacked layer conditions, returns false if conditions fail
   * @param {string} _layerName
   * @param {obj} _stackedConditions
   */
    function updateLayerConditions(_layerName, _layerGroup, _stackedConditions) { 
        //Eye-Yellow, Top-Lid, {}
        var layerConditions = conditions[_layerName];

        // layerConditions =  {
        //     "Background": [ "Bg-Red" ],
        //     "Eye Color": [ "Eye-Green", "Eye-Pink" ]
        //   }

        if (!layerConditions) {
            if(_stackedConditions[_layerGroup] && !checkIfContains(_stackedConditions[_layerGroup], _layerName)) {
                return false;
            }
            return _stackedConditions;
        }

        for (var i = 0; i < groups.length; i++) {
            var _groupName = cleanName(groups[i].name);
            if(!layerConditions[_groupName]) {
                continue;
            }
            if(!_stackedConditions[_groupName] || _stackedConditions[_groupName].length <= 0) {
                _stackedConditions[_groupName] = layerConditions[_groupName];
            } else {
                var common = getCommonItems(layerConditions[_groupName], _stackedConditions[_groupName]);
                if(!common || common.length <= 0) {
                    return false;
                }
                _stackedConditions[_groupName] = common;
            }
        }
        return _stackedConditions;
    }

    /**
    * Get layer name without '#N'
    * @param {string} _str
    */
    function cleanName(_str) {
        return _str.split("#").shift();
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
        // var stackedConditions = {};
        // var breakCheck1 = false;
        // loop over all groups
        for (var i = 0; i < groups.length; i++) {
            // if (breakCheck1) {
            //     break;
            // }
            var totalWeight = getRWeights(groups[i].name) || groups[i].layers.length;
            var groupName = cleanName(groups[i].name);
            // var layerMap = [];
            // loop over layers in current group and build the layerMap array with the corresponding weights
            // for (var j = 0; j < groups[i].layers.length; j++) {
            //     var layerName = cleanName(groups[i].layers[j].name);
            //     // check if there are any conditions for the current layer based on the already selected groups and layers stored in the hashTable
            //     if (!checkLayerConditions(layerName, selectedGroups, hashTable)) {
            //         continue;
            //     }

            //     var weight = getRWeights(groups[i].layers[j].name);
            //     totalWeight += weight;

            //     layerMap.push({
            //         index: j,
            //         name: layerName,
            //         weight: weight
            //     });
            // }

            // pick a random number between 0 and totalWeight (normal distribution)
            var ran = Math.floor(Math.random() * totalWeight);

            (function () {
                var groupLen = groups[i].layers.length;
                // loop over layers in current group to pick one layer based on the random value
                // Top-Lid => T-Low#20, T-Medium#30, T-Large#50  
                for (var j = 0; j < groupLen; j++) {
                    var layerName = cleanName(groups[i].layers[j].name);
                    var layerWeight = getRWeights(groups[i].layers[j].name) || 1;
                    // find to which existing weight the random value correspond to 
                    ran -= layerWeight;
                    // check conditions
                    //T-Low, Top-Lid, {}
                    // var newConditions = updateLayerConditions(layerName, groupName, stackedConditions);
                    // logData(newConditions, j);
                    // // if conditions fail
                    // if (!newConditions) {
                    //     if((j+1) === groupLen) {
                    //         breakCheck1 = true;
                    //         break;
                    //     }
                    //     continue;
                    // }
                    // stackedConditions = newConditions;

                    if (ran < 0) {
                        // store selected groups and layers for current image, to be used in checking conditions for next selected layer
                        hashTable[groupName] = layerName;
                        selectedLayerMap[i] = j;

                        groups[i].layers[j].visible = true;
                        obj.attributes.push({
                            trait_type: groupName,
                            value: layerName
                        })
                        return;
                    }
                }
            })();
        }
        // get image DNA
        if(parseInt(hasDNA)) {
            var hash = hashCode(JSON.stringify(hashTable));
            // check if dna exits, skip if true and store value if false
            if (hash && dna[hash]) {
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
    alert("Generation process is complete.");
    var timer = (new Date() - start) / 1000;
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
    exportOptions.PNG24 = false;
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

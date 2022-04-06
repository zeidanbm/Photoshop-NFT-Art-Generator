#target photoshop

#include "./lib/json2.js";

function main() {
    var continueConfirmation = confirm(
        "You are about to use the HashLips art generator. Are you sure you want to continue?"
    );

    if (!continueConfirmation) return;

    var supply = prompt("How many images do you want to generate?", "10");

    var name = prompt("What is the name of your collection?", "");

    var description = prompt("What is the description for your collection?", "");

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
        var hash = 0, i = 0, len = _str.length;
        while (i < len) {
            hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
        }
        return hash;
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

    var conditions = parseConditions('conditions.json')

    /**
    * Get layer weight
    * @param {string} _layerName
    */
    function getRWeights(_layerName) {
        var weight = Number(_layerName.split("#").pop());
        if (isNaN(weight)) {
            weight = 1;
        }
        return weight;
    }

   /**
   * Check layer conditions
   * @param {string} _layerName
   * @param {array} _selectedGroups
   * @param {obj} _hashTable
   */
    function checkLayerConditions(_layerName, _selectedGroups, _hashTable) {

        // eye-yellow {'Background': 'bg-red', 'Iris': 'small', 'Eyeball': 'red'}
        var layerConditions = conditions[_layerName];
        if (!layerConditions) {
            return true;
        }
        for (var i = 0; i < _selectedGroups.length; i++) {
            var layerGroupConditions = layerConditions[_selectedGroups[i]]; // ['bg-red']
            if (!layerGroupConditions || checkIfContains(layerGroupConditions, _hashTable[_selectedGroups[i]])) {
                continue;
            } else {
                return false;
            }
        }
        return true;
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
        var selectedGroups = [];

        // loop over all groups
        for (var i = 0; i < groups.length; i++) {
            var totalWeight = 0;
            var layerMap = [];
            // loop over layers in current group and build the layerMap array with the corresponding weights
            for (var j = 0; j < groups[i].layers.length; j++) {
                var layerName = cleanName(groups[i].layers[j].name);
                // check if there are any conditions for the current layer based on the already selected groups and layers stored in the hashTable
                if (!checkLayerConditions(layerName, selectedGroups, hashTable)) {
                    continue;
                }
                totalWeight += getRWeights(groups[i].layers[j].name);
                layerMap.push({
                    index: j,
                    name: layerName,
                    weight: getRWeights(groups[i].layers[j].name)
                });
            }

            // pick a random number between 0 and totalWeight (normal distribution)
            var ran = Math.floor(Math.random() * totalWeight);

            (function () {
                // loop over layers in current group to pick one layer based on the random value
                for (var j = 0; j < groups[i].layers.length; j++) {
                    // find to which existing weight the random value correspond to 
                    ran -= layerMap[j].weight;
                    if (ran < 0) {
                        // store selected groups and layers for current image, to be used in checking conditions for next selected layer
                        hashTable[groups[i].name] = layerMap[j].name;
                        selectedGroups.push(groups[i].name);

                        groups[i].layers[j].visible = true;
                        obj.attributes.push({
                            trait_type: groups[i].name,
                            value: layerMap[j].name
                        })
                        return;
                    }
                }
            })();
        }
        // get image DNA
        var hash = hashCode(JSON.stringify(hashTable));
        // check if dna exits, skip if ture and store value if false
        if (dna[hash]) {
            h--;
            continue;
        }
        dna[hash] = true;
        saveImage(obj.edition);
        saveMetadata(obj);
        resetLayers(groups);
    }
    alert("Generation process is complete.");
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

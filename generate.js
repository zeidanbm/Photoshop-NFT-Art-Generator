#include "./lib/json2.js";

// bring application forward for double-click events
app.bringToFront();
app.preferences.exportClipboard = false;
// app.activeDocument.cmykProfile = "adobe rgb 1998";
var start = new Date();

function main() {
    var continueConfirmation = confirm(
        "You are about to use the cyber genie art generator. Are you sure you want to continue?"
    );

    if (!continueConfirmation) return;

    var supply = prompt("How many images do you want to generate?", "10");

    var name = prompt("What is the name of your collection?", "Cyber Genie NFT");

    var description = prompt("What is the description for your collection?", "");

    alert(
        supply +
        " images will be generated, so sit back relax and enjoy the art being generated."
    );

    var groups = app.activeDocument.layerSets;
    resetLayers(groups);

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

    /**
     * Choose layer by weight
     * @param {number} groupIndx 
     * @param {number} totalWeight 
     * @returns 
     */
    function pickLayerByWeight(groupIndx, totalWeight) {
        // pick a random number between 0 and totalWeight (normal distribution)
        var threshold = Math.floor(Math.random() * totalWeight);
        // loop over layers in current group to pick one layer based on the random value
        for (var j = 0; j < groups[groupIndx].layers.length; j++) {
            var layerName = cleanName(groups[groupIndx].layers[j].name);
            var layerWeight = getRWeights(groups[groupIndx].layers[j].name) || 1;
            // Add the weight to our running total.
            threshold -= layerWeight;
            // If this value falls within the threshold, we're done!
            if (threshold < 0) {
                // check layer rules
                groups[groupIndx].layers[j].visible = true;
                return { index: j, layerName: layerName };
            }
        }
    }
    // loop over the supply i.e total pieces to generate
    for (var h = 1; h < parseInt(supply) + 1; h++) {
        var obj = {};
        obj.name = name + " #" + h;
        obj.description = description;
        obj.image = "To be replaced";
        obj.edition = h;
        obj.attributes = [];
        var selectedLayerMap = {};
        // loop over all groups
        for (var i = 0; i < groups.length; i++) {
            var totalWeight = getRWeights(groups[i].name) || groups[i].layers.length;
            var groupName = cleanName(groups[i].name);

            var resutls = pickLayerByWeight(i, totalWeight);
            selectedLayerMap[i] = resutls.index;
            obj.attributes.push({
                trait_type: groupName,
                value: resutls.layerName
            })
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
    exportOptions = new PNGSaveOptions();
    // exportOptions.format = SaveDocumentType.PNG;
    // exportOptions.PNG8 = false;
    // exportOptions.PNG24 = true;
    // exportOptions.transparency = true;
    exportOptions.interlaced = false;
    // exportOptions.includeProfile = true;
    // exportOptions.srgb = false;
    // exportOptions.resolution = 300;
    // app.activeDocument.exportDocument(
    //     saveFile,
    //     ExportType.SAVEFORWEB,
    //     exportOptions
    // );
    app.activeDocument.saveAs(saveFile, exportOptions, true, Extension.LOWERCASE)
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

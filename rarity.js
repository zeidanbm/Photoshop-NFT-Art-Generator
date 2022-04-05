const basePath = process.cwd();
const fs = require("fs");
const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

async function readFiles(dirname) {
  var metadata = [];
  try {
    const dirCont = await readdir(dirname);

    let filenames = dirCont.filter( function( elm ) {return elm.match(/.*\.(json?)/ig);});

    for (const filename of filenames) {
      const data = await readFile(`${dirname}/${filename}`);
      metadata.push(JSON.parse(data.toString()));
    }

    return metadata;
  } catch (err) {
    throw err;
  }
}

async function getRarity() {
  let data;
  try {
    data = await readFiles(`${basePath}/build/metadata`);
  } catch(e) {
    throw err;
  }
 
  let editionSize = data.length;

  let rarityData = {};

  // fill up rarity chart with occurrences from metadata
  data.forEach((element) => {
    let attributes = element.attributes;
    attributes.forEach((attribute) => {
      let traitType = attribute.trait_type;
      let value = attribute.value;
      
      if(!rarityData[traitType]) {
        rarityData[traitType] = { [value]: { occurrence: 1 }}
      } else if(!rarityData[traitType][value]) {
        rarityData[traitType][value] = { occurrence: 1 };
      } 
      else {
        rarityData[traitType][value].occurrence++;
      }
    });
  });

  // convert occurrences to occurence string
  for (const layer in rarityData) {
    for (const attribute in rarityData[layer]) {
      // get chance
      let chance =
        ((rarityData[layer][attribute].occurrence / editionSize) * 100).toFixed(2);

      // show two decimal places in percent
      rarityData[layer][attribute].occurrence =
        `${rarityData[layer][attribute].occurrence} in ${editionSize} editions (${chance} %)`;
    }
  }

  // print out rarity data
  for (var layer in rarityData) {
    console.log('\033[1m\x1b[36m%s\x1b[0m', `Trait type: ${layer}`);
    for (var trait in rarityData[layer]) {
      console.log(`${trait} => ${rarityData[layer][trait].occurrence}`);
    }
    console.log('-------------------------')
    console.log();
  }
}

(async () => {
  try {
    await getRarity();
  } catch (e) {
    console.log(e);
  }
})();

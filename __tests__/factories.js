import { createRequire } from "module";
const require = createRequire(import.meta.url)
const path = require('path');
const fs = require('fs');
const util = require('util');
const rm = util.promisify(fs.rm);
const BASE_PATH = process.cwd();
const METADATA_DIR = `${BASE_PATH}/data/metadata`;
const IMAGES_DIR = `${BASE_PATH}/data/images`;
const TRAITS = {
    "Top lid": ["T-Low", "T-Middle", "T-High"],
    "Bottom lid": ["B-Low", "B-Middle", "B-High"],
    "Shine": ["Shapes"],
    "Iris": ["Ir-Small", "Ir-Medium", "Ir-Large"],
    "Eye Color": ["Eye-Red", "Eye-Yellow", "Eye-Pink", "Eye-Green"],
    "Eyeball": ["Eyeball-Red", "Eyeball-White", "Eyeball-Green"],
    "Background": ["Bg-Red", "Bg-White", "Bg-Black"]
};
const META_SAMPLE = {"name":"Test NFT Collection #","description":"A test collection","image":"test","edition":1,"attributes":[{"trait_type":"Top lid","value":""},{"trait_type":"Bottom lid","value":""},{"trait_type":"Shine","value":""},{"trait_type":"Iris","value":""},{"trait_type":"Eye Color","value":""},{"trait_type":"Eyeball","value":""},{"trait_type":"Background","value":""}]};

export const destroy = async () => {
    await rm(METADATA_DIR, { recursive: true, force: true });
    await rm(IMAGES_DIR, { recursive: true, force: true });
}

export const create = async (count) => {
     for (let i = 1; i < 2; i++) {
        let obj = Object.assign({}, META_SAMPLE);
        obj.name += i
        obj.edition = i
        obj.attributes = obj.attributes.map((attr) => {
            const randomIndex = Math.floor(Math.random() * TRAITS[attr.trait_type].length)
            return {
                trait_type: attr.trait_type,
                value: TRAITS[attr.trait_type][randomIndex]
            }
        })

        fs.writeFile(path.join(METADATA_DIR, `${i}.json`), JSON.stringify(obj), 'utf8', (err) => {
            if(err) throw err;
        })
     }
}

create();
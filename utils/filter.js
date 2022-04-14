import { createRequire } from "module";
const require = createRequire(import.meta.url)
const basePath = process.cwd();
const fs = require("fs");
const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
import boxen from 'boxen';
import chalk from 'chalk';
const prompts = require('prompts');

const metaDir = `${basePath}/build/metadata`;
const imgDir = `${basePath}/build/images`;
const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "#4E2F7E",
    backgroundColor: "#010008"
};
console.log(boxen(chalk.white.bold("The Cyber Genie Team"), boxenOptions));

async function removeByLayer(_layer, _removeCount) {
    try {
        const dirCont = await readdir(metaDir);
        let filenames = dirCont.filter(function (elm) { return elm.match(/.*\.(json?)/ig); });

        for (const filename of filenames) {
            let data = JSON.parse((await readFile(`${metaDir}/${filename}`)).toString());

            data.attributes.forEach(async (attr) => {
                if(attr.value == _layer) {
                    await unlink(`${metaDir}/${filename}`);
                    const fileNumber = filename.match(/\d+/gm);
                    if (fs.existsSync(`${imgDir}/${fileNumber}.png`)) {
                        await unlink(`${imgDir}/${fileNumber}.png`);
                    }
                    _removeCount--;
                }
            });

            if(_removeCount <= 0) {
                break;
            }
        }

        return _removeCount;
    } catch (err) {
        throw err;
    }
}

async function main(layer, removeCount) {
    try {
        const result = await removeByLayer(layer, removeCount);

        console.log('-----------------------------');
        console.log(`${removeCount - result} files removed.`);
    } catch (err) {
        throw err;
    }
}

(async () => {
    const layerInput = await prompts({
        type: 'text',
        name: 'value',
        message: 'Provide a layer to filter by?',
        validate: value => value ? true : 'Field is required'
    });
    const removeCountInput = await prompts({
        type: 'number',
        name: 'value',
        message: 'How many images do you want to remove?',
        validate: value => value > 0 ? true : 'Field is require'
    });

    try {
        await main(layerInput.value, removeCountInput.value);
    } catch (e) {
        console.log(e);
    }
})();
import { createRequire } from "module";
const require = createRequire(import.meta.url)
const basePath = process.cwd();
const fs = require("fs");
const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const rename = util.promisify(fs.rename);
const writeFile = util.promisify(fs.writeFile);
const prompts = require('prompts');
import chalk from 'chalk';
import boxen from 'boxen';


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

async function cleanUp(_baseName) {
    try {
        let i = 1;
        const dirCont = await readdir(metaDir);
        let filenames = dirCont.filter(function (elm) { return elm.match(/.*\.(json?)/ig); });

        for (const filename of filenames) {
            let data = JSON.parse((await readFile(`${metaDir}/${filename}`)).toString());
            data.name = `${_baseName} #${i}`;
            data.edition = i;
          
            const fileNumber = filename.match(/\d+/gm);
            await writeFile(`${metaDir}/${i}.json`, JSON.stringify(data));
            await unlink(`${metaDir}/${filename}`);
            await rename(`${imgDir}/${fileNumber}.png`, `${imgDir}/${i}.png`)
      
            i++;
        }
    } catch (err) {
        throw err;
    }
}

async function main(baseNameInput) {
    try {
        await cleanUp(baseNameInput);

        console.log('-----------------------------');
        console.log('Done.');
    } catch (err) {
        throw err;
    }
}

(async () => {
    try {
        const baseNameInput = await prompts({
            type: 'text',
            name: 'value',
            message: 'What is the name of your collection?',
            validate: value => value ? true : 'Field is required'
        });

        await main(baseNameInput.value);
    } catch (e) {
        console.log(e);
    }
})();
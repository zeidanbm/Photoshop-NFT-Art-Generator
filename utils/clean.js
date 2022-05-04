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

async function clean(_baseName) {
    try {
        let counter = 1;
        const dirCont = await readdir(metaDir);
        let filenames = dirCont.filter(function (elm) { return elm.match(/.*\.(json?)/ig); });

        for (const filename of filenames) {
            let data = JSON.parse((await readFile(`${metaDir}/${filename}`)).toString());
            data.name = `${_baseName} #${counter}`;
            data.edition = counter;
          
            const fileNumber = filename.match(/\d+/gm);
            await unlink(`${metaDir}/${filename}`);
            await writeFile(`${metaDir}/#${counter}.json`, JSON.stringify(data));
            await rename(`${imgDir}/${fileNumber}.png`, `${imgDir}/#${counter}.png`);
      
            counter++;
        }

        for (let i = 1; i < counter; i++) {
            await rename(`${metaDir}/#${i}.json`, `${metaDir}/${i}.json`);
            await rename(`${imgDir}/#${i}.png`, `${imgDir}/${i}.png`);
        }
    } catch (err) {
        throw err;
    }
}

async function main(baseNameInput) {
    try {
        await clean(baseNameInput);

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

        if(!baseNameInput.value) {
            process.exit(0);
        } else {
            await main(baseNameInput.value);
        }
    } catch (e) {
        console.log(e);
    }
})();
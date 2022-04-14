import { createRequire } from "module";
const require = createRequire(import.meta.url)
const basePath = process.cwd();
const fs = require("fs");
const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const crypto = require('crypto');
const isEmpty = require('lodash.isempty');
import boxen from 'boxen';
import chalk from 'chalk';

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

async function applyConditions(conditions) {
    try {
        const dirCont = await readdir(metaDir);
        let filenames = dirCont.filter(function (elm) { return elm.match(/.*\.(json?)/ig); });
        let counter = 0;

        for (const filename of filenames) {
            let data = JSON.parse((await readFile(`${metaDir}/${filename}`)).toString());
            let rules = {
                layers: [],
                groups: []
            };
            data.attributes.some((attr) => {
                if(conditions[attr.value]) {
                    rules.layers.push(...conditions[attr.value].layers);
                    rules.groups.push(...conditions[attr.value].groups);
                }

                if(rules.groups.includes(attr.trait_type)) {
                    if(!rules.layers.includes(attr.value)) {
                        counter++;
                        return filename;
                    }
                }
            });
        }
        console.log(counter);
    } catch (err) {
        throw err;
    }
}

async function main() {
    try {
        const conditions = JSON.parse((await readFile(`${basePath}/conditions.json`)).toString());
        await applyConditions(conditions);

        console.log('-----------------------------');
        console.log(`0 files deleted.`);
        console.log('-----------------------------');
    } catch (err) {
        throw err;
    }
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.log(e);
    }
})();
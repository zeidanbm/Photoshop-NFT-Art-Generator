import { createRequire } from "module";
const require = createRequire(import.meta.url)
const basePath = process.cwd();
const fs = require("fs");
const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const crypto = require('crypto');
const isEmpty = require('lodash.isempty');
const prompts = require('prompts');
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
console.log();

async function readFiles(dirname) {
    let _hashMap = {};
    try {
        const dirCont = await readdir(dirname);

        let filenames = dirCont.filter(function (elm) { return elm.match(/.*\.(json?)/ig); });

        for (const filename of filenames) {
            const data = JSON.parse((await readFile(`${dirname}/${filename}`)).toString());
            const hash = await crypto.createHash('md5').update(JSON.stringify(data.attributes)).digest('hex');
            _hashMap[hash] = (!_hashMap[hash]) ? { count: 1, files: [filename] } : { count: _hashMap[hash].count + 1, files: [..._hashMap[hash].files, filename] };
        }

        return _hashMap;
    } catch (err) {
        throw err;
    }
}

async function checkDNA() {
    try {
        let results = {};
        let counter = 0;
        let hashMap = await readFiles(`${basePath}/build/metadata`);

        for (let k of Object.keys(hashMap)) {
            if (hashMap[k].count > 1) {
                results[k] = hashMap[k];
                counter += hashMap[k].count;
            }
        }
        if(isEmpty(results)) {
            console.log("All Generated NFTs are unique!")
        } else {
            console.log("Below are the duplicate NFTs:")
            console.log();
            console.log(results);

            const removeFiles = await prompts({
                type: 'confirm',
                name: 'value',
                initial: false,
                message: `Do you want to remove the duplicate NFTs? (${counter} files)`
            });
            if(!removeFiles.value) {
                process.exit(0);
            } else {
                // loop over odd elements only
                for (let k of Object.keys(results)) {
                    for (var i = 1; i < results[k].files.length; i += 2) {
                        await unlink(`${metaDir}/${results[k].files[i]}`);
                        const fileNumber = results[k].files[i].match(/\d+/gm);
                        if (fs.existsSync(`${imgDir}/${fileNumber}.png`)) {
                            await unlink(`${imgDir}/${fileNumber}.png`);
                        }
                    }
                }
            }
        }
    } catch (err) {
        throw err;
    }
}

(async () => {
    try {
        await checkDNA();
    } catch (e) {
        console.log(e);
    }
})();

import { createRequire } from "module";
const require = createRequire(import.meta.url)
const basePath = process.cwd();
const fs = require("fs");
const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const crypto = require('crypto');
const isEmpty = require('lodash.isempty');
const Chalk = require('chalk');
import boxen from 'boxen';

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "#4E2F7E",
    backgroundColor: "#010008"
};
console.log(boxen(Chalk.white.bold("The Cyber Genie Team"), boxenOptions));
console.log();

async function readFiles(dirname) {
    let _hashMap = {};
    try {
        const dirCont = await readdir(dirname);

        let filenames = dirCont.filter(function (elm) { return elm.match(/.*\.(json?)/ig); });

        for (const filename of filenames) {
            const data = await readFile(`${dirname}/${filename}`);
            const hash = await crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
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
        let hashMap = await readFiles(`${basePath}/build/metadata`);

        for (let k of Object.keys(hashMap)) {
            if (hashMap[k].count > 1) {
                results[k] = hashMap[k];
            }
        }
        if(isEmpty(results)) {
            console.log("All Generated NFTs are unique!")
        } else {
            console.log("Below are the duplicate NFTs:")
            console.log();
            console.log(results);
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

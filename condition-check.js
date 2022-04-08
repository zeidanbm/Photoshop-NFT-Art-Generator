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
const prompts = require('prompts');

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "#4E2F7E",
    backgroundColor: "#010008"
};
console.log(boxen(Chalk.white.bold("The Cyber Genie Team"), boxenOptions));

async function checkConditions(dirname, _layer, _layersAgainst) {
    let _results = {};
    try {
        const dirCont = await readdir(dirname);
        let wrong = 0;
        let correct = 0;
        let filenames = dirCont.filter(function (elm) { return elm.match(/.*\.(json?)/ig); });

        for (const filename of filenames) {
            let data = JSON.parse((await readFile(`${dirname}/${filename}`)).toString());
            let hasLayer = false;
            let hasLayerAgainst = false;

            data.attributes.forEach((attr) => {
                if(attr.value == _layer) {
                    hasLayer = true;
                } 
                if (_layersAgainst.includes(attr.value)) {
                    hasLayerAgainst = true;
                }
            })

            if(hasLayer && !hasLayerAgainst) {
                _results[filename] = false;
                wrong++;
            }
            if(hasLayer && hasLayerAgainst) {
                correct++;
            }
        }

        return {results: _results , correct, wrong};
    } catch (err) {
        throw err;
    }
}

async function main(_layer, _layersAgainst) {
    try {
        const {results, correct, wrong} = await checkConditions(`${basePath}/build/metadata`, _layer, _layersAgainst);

        console.log('-----------------------------');
        console.log(`${correct} files matched.`);
        console.log(`${wrong} files did not match.`);

        if(isEmpty(results)) {
            console.log('All conditions are correct!');
        } else {
            console.log("Below are the NFTs that did not satisfy the conditions:")
            console.log();
            console.log(results);
        }
        console.log('-----------------------------');
    } catch (err) {
        throw err;
    }
}

(async () => {
    let conditions = JSON.parse((await readFile(`${basePath}/conditions.json`)).toString());

    const layer = await prompts({
        type: 'text',
        name: 'value',
        message: 'Which layer do you want to check?',
        validate: value => conditions[value] ? true : `A Valid layer is required`
    });
    const layersAgainst = await prompts({
        type: 'list',
        name: 'value',
        initial: '',
        separator: ',',
        message: 'Which layers do you want to check against? (comma separated list)',
        validate: value => value ? true : `Field is required`
    });

    try {
        await main(layer.value, layersAgainst.value);
    } catch (e) {
        console.log(e);
    }
})();
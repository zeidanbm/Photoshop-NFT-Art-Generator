import { createRequire } from "module";
const require = createRequire(import.meta.url);
const basePath = process.cwd();
const fs = require("fs");
const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const { MongoClient } = require("mongodb");
import boxen from 'boxen';
import chalk from 'chalk';

const uri = 'mongodb://localhost:27018';
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

async function injectData(collection) {
    try {
        const dirCont = await readdir(metaDir);
        let filenames = dirCont.filter(function (elm) { return elm.match(/.*\.(json?)/ig); });

        for (const filename of filenames) {
            let data = JSON.parse((await readFile(`${metaDir}/${filename}`)).toString());
            await collection.insertOne(data)
        }
    } catch (err) {
        throw err;
    }
}


async function main() {

    const client = await MongoClient.connect(uri).catch(err => { console.log(err); });

    if (!client) {
        process.exit(1);
    }

    try{
        const db = client.db('cyber_genie_nfts');
        const nfts = await db.collection('nfts');
        await injectData(nfts);
        await client.close();

        console.log('-----------------------------');
        console.log("Successfully injected metadata into database.");
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
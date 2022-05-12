# Cyber Genie NFT Generator - Photoshop Scripts & Utilities

## Check our NFTs

## Initial Setup
1. Install the latest Photoshop
1. Make sure you have Node & npm installed on your machine. (Optional, only needed to use the utilites after generating the NFTs.)
2. Navigate to the root directory of the project and run `npm install` (Optional, only needed to use the utilites after generating the NFTs.)
3. Download and install Docker (Optional, only needed to use the application for browsing/filtering the generated NFTs.)

## Generating your Collection
Generate your art collection using Photoshop with either the `generate.jsx` or `generate-with-conditions.jsx` script.

### Using Conditions
To be able to use the conditions, you will need to create a `conditions.json` file in the setup folder. Copy the contents from `conditions.example` into your `conditions.json` file. 
Finally, adjust the conditions to your needs. Keep in mind the following points when editing the file: 
- Layer rules must be top down. That means the first layer can have rules for all layers under it. However, the layer after can't have rules for previous layers. The order of the layers is the same as in Photoshop and top layer comes first.
- Layer and group names must be exact as in Photoshop
- Must be a valid json file, following the same format provided in the example file

### Using layer group layouts
To be able to use layer group layouts, you will need to create a new file `groups.json` in the setup folder. Copy the content from `groups.example` into your `groups.json` file. Then adjust the file to your needs. Keep in mind the following points when editing the file:
- Group names must be exact as in Photoshop
- Group indexes must follow the same order as in Photoshop. Top layer comes first with index 0
- Must be a valid json file, following the same format provided in the example file

## DNA Check
To check for duplicate NFTs and remove them
`npm run dna`

## Condition Check
This allows you to check a layer condition against an array of conditions
`npm run conditions`

## Rarirty Check
`npm run rarity`

## Filter
Run the filter to remove metadata and images by providing a layer name and count
`npm run filter`

## Clean up
Run the clean script to clean the metadata/images and rename all files starting from 1 to N
`npm run clean`

## Starting the web application
If you would like to browse through your NFT collection and filter them using a browser, you can run a small application using docker. First, make sure docker is installed and running on your machine. Then simply execute the command `docker-compose up`.

## Credits
This project is inspired by the [Hashlips art engine ps script project](https://github.com/HashLips/hashlips_art_engine_ps_script)
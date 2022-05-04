# Cyber Genie NFT Generator - Photoshop Scripts & Utilities

## Initial Setup
1. Install the latest Photoshop
1. Make sure you have Node & npm installed on your machine. (Optional, only needed to use the utilites after generating the NFTs.)
2. Navigate to the root directory of the project and run `npm install` (Optional, only needed to use the utilites after generating the NFTs.)
3. Download and install Docker (Optional, only needed to use the application for browsing/filtering the generated NFTs.)

## Generating your Collection without conditions
Generate collection inside photoshop using the generate.js script

## Generating your Collection with conditions
Generate collection inside photoshop using the generate or generate-with-conditions.js script

### Using Conditions
Create a new file `conditions.json`, copy content from `conditions.example`. Then adjust to the file to your needs. 
- Layer rules must be top down. That means the first layer can have rules for all layers under it. However, the layer after can't have rules for previous layers. The order the layers follow is the same as in photoshop i.e top layer comes first.
- Layer and group names must be exact as in photoshop.

### Using layer group layouts
Create a new file `groups.json`, copy content from `groups.example`. Then adjust the file to your needs.
- Group names must be exact as in photoshop.
- Group indexes must follow the same order as in photoshop. Top layer comes first with index 0.

## DNA Check
To check for duplicate NFTs and remove them
`npm run dna-check`

## Condition Check
This allows you to check a layer condition against an array of conditions
`npm run conditions-check`

## Rarirty Check
`npm run rarity`

## Filter
Run the filter to remove metadata and images by providing a layer name and count
`npm run filter`

## Clean up
Run the cleanup script to cleanup the metadata/images and rename all files starting from 1 to N
`npm run cleanup`

## Starting the web application
Make sure docker is installed and running on your machine. Then execute the command `docker-compose up`. 

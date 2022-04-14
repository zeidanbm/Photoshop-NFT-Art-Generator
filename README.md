# Cyber Genie NFT Generator - Photoshop Script

## Initial Setup
1. Make sure you have Node & npm installed on your machine
2. Navigate to the root directory of the project and run `npm install`

## Generating your Collection
Generate collection inside photoshop using the generate.js script

## Using Conditions
Create a new file `conditions.json` and copy content from `conditions.example`
`npm run conditions-apply`

## Update Metadata
Run the update_metadata.js script inside photoshop to update your metadata url

## DNA Check
To check for duplicate NFTs and remove them
`npm run dna-check`

## Condition Check
This allows you to check a layer condition against an array of conditions
`npm run conditions-check`

## Rarirty Check
`npm run rarity-check`

## Filter
Run the filter to remove metadata and images by providing a layer name and count
`npm run filter`

## Clean up
Run the cleanup script to cleanup the metadata/images and rename all files starting from 1 to N
`npm run cleanup`
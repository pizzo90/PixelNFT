const Pixel = artifacts.require('Pixel');
const fs = require('fs');
var imgGen = require('js-image-generator');
var rgbToHex = require('rgb-to-hex');
const { createCanvas } = require("canvas");
const WIDTH = 100;
const HEIGHT = 100;
const { exit } = require('process')

const metadataTemple = {
    "name": "",
    "description": "",
    "image": "",
    "attributes": [
        {
            "trait_type": "Width",
            "value": 0
        },
        {
            "trait_type": "Height",
            "value": 0
        },
        {
            "trait_type": "Red",
            "value": 0
        },
        {
            "trait_type": "Green",
            "value": 0
        },
        {
            "trait_type": "Blue",
            "value": 0
        }
    ]
}
module.exports = async callback => {

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");        
    const pixel = await Pixel.deployed()
    length = await pixel.getNumberOfPixels()
    index = 0
    while (index < length) {
        console.log('Let\'s get the overview of the pixels ' + index + ' of ' + length)
        let pixelMetadata = metadataTemple
        let pixelOverview
        pixelOverview = await pixel.pixels(index);
        index++
        pixelMetadata['name'] = pixelOverview['name']
        if (fs.existsSync('metadata/' + pixelMetadata['name'].toLowerCase().replace(/\s/g, '-') + '.json')) {
            console.log('already exists!!!!!')
            continue
        }
        console.log(pixelMetadata['name'])
        pixelMetadata['attributes'][0]['value'] = pixelOverview['height']['words'][0]
        pixelMetadata['attributes'][1]['value'] = pixelOverview['width']['words'][0]
        pixelMetadata['attributes'][2]['value'] = pixelOverview['red']['words'][0]
        pixelMetadata['attributes'][3]['value'] = pixelOverview['green']['words'][0]
        pixelMetadata['attributes'][4]['value'] = pixelOverview['blue']['words'][0]
        filename = 'metadata/' + pixelMetadata['name'].toLowerCase().replace(/\s/g, '-')
        let data = JSON.stringify(pixelMetadata)
        fs.writeFileSync(filename + '.json', data)
        let colorHex = rgbToHex('rgb('+ pixelMetadata['attributes'][2]['value'] +', '+ pixelMetadata['attributes'][3]['value'] +', '+ pixelMetadata['attributes'][4]['value'] +')');
        console.log(colorHex);
        ctx.fillStyle = "#" + colorHex;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(filename + '.png', buffer)

    }
    callback(pixel)
}

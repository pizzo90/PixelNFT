const Pixel = artifacts.require('Pixel')
const fs = require('fs')
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
             "trait_type": "Color",
            "value": 0
        }
    ]
}
module.exports = async callback => {
    const pixel = await Pixel.deployed()
    length = await pixel.getNumberOfPixels()
    index = 0
    while (index < length) {
        console.log('Let\'s get the overview of the pixels ' + index + ' of ' + length)
        let pixelMetadata = metadataTemple
        let pixelOverview
        console.log(pixelOverview = await pixel.pixels(index));
        index++
        pixelMetadata['name'] = pixelOverview['name']
        if (fs.existsSync('metadata/' + pixelMetadata['name'].toLowerCase().replace(/\s/g, '-') + '.json')) {
            console.log('test')
            continue
        }
        console.log(pixelMetadata['name'])
        pixelMetadata['attributes'][0]['value'] = pixelOverview['width']['words'][0]
        pixelMetadata['attributes'][1]['value'] = pixelOverview['height']['words'][0]
        pixelMetadata['attributes'][2]['value'] = pixelOverview['color']['words'][0]
        filename = 'metadata/' + pixelMetadata['name'].toLowerCase().replace(/\s/g, '-')
        let data = JSON.stringify(pixelMetadata)
        fs.writeFileSync(filename + '.json', data)
    }
    callback(pixel)
}

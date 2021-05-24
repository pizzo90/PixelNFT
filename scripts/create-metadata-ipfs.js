const Pixel = artifacts.require('Pixel');
const fs = require('fs');
var imgGen = require('js-image-generator');
var rgbToHex = require('rgb-to-hex');
const { createCanvas } = require("canvas");
const Axios = require('axios');
const FormData = require('form-data');
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
        console.log('Let\'s get the overview of the pixels ', index,' of ',length -1)
        let pixelMetadata = metadataTemple
        let pixelOverview
        pixelOverview = await pixel.pixels(index);
        //console.log(pixelOverview);
        pixelMetadata['name'] = pixelOverview['name']
        if (fs.existsSync('metadata/' + pixelMetadata['name'].toLowerCase().replace(/\s/g, '-') + '.json')) {
            console.log('already exists!!!!!')
            index++
            continue
        }
        console.log(pixelMetadata['name'])

        //GENERATE IMAGE
        let colorHex = rgbToHex('rgb('+ pixelOverview['red']['words'][0] +', '+ pixelOverview['green']['words'][0] +', '+ pixelOverview['blue']['words'][0] +')');
        console.log(colorHex);
        ctx.fillStyle = "#" + colorHex;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        const buffer = canvas.toBuffer("image/png");
        let filename = 'metadata/' + pixelMetadata['name'].toLowerCase().replace(/\s/g, '-')
        fs.writeFileSync(filename + '.png', buffer)
        let imageData = new FormData();
        //PIN IMAGE TO IPFS
        imageData.append('file', fs.createReadStream(filename + '.png'));
        var config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
            headers: { 
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
            ...imageData.getHeaders()
            },
        data : imageData
        };
        await Axios(config).then(function (response) {
            let cidr = response.data.IpfsHash;
            pixelMetadata['image'] = "https://ipfs.io/ipfs/" + cidr + "?filename=" 
            + pixelMetadata['name'].toLowerCase().replace(/\s/g, '-') + ".png";
        }).catch(function (error) {
            console.log(error);
        });

        pixelMetadata['attributes'][0]['value'] = pixelOverview['height']['words'][0]
        pixelMetadata['attributes'][1]['value'] = pixelOverview['width']['words'][0]
        pixelMetadata['attributes'][2]['value'] = pixelOverview['red']['words'][0]
        pixelMetadata['attributes'][3]['value'] = pixelOverview['green']['words'][0]
        pixelMetadata['attributes'][4]['value'] = pixelOverview['blue']['words'][0]
        let dataJson = JSON.stringify(pixelMetadata)
        fs.writeFileSync(filename + '.json', dataJson)

        //PIN JSON TO IPFS
        let jsonData = new FormData();
        //PIN IMAGE TO IPFS
        jsonData.append('file', fs.createReadStream(filename + '.json'));
        var config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
            headers: { 
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
            ...jsonData.getHeaders()
            },
        data : jsonData
        };
        let jsonCidr = await Axios(config).then(function(response) {
            let cidr = response.data.IpfsHash;
            console.log("JSON Metadata pinned successfully",JSON.stringify(response.data))
            return cidrFilename = "https://ipfs.io/ipfs/" + cidr + "?filename=" + pixelMetadata['name'].toLowerCase().replace(/\s/g, '-') + ".json"  
            //https://ipfs.io/ipfs/QmYGU7Hztd4dthmnCfhPuZLT6xYu4RzakbJ6X4KxNhU3tB?filename=bluepixel.json
        });
        console.log(jsonCidr);
        //console.warn("CALLING SET TOKEN URI INTO SMART CONTRACT with TOKENURI",cidrFilename);
        console.log(index)
        let tx = await pixel.setTokenURI(index, jsonCidr).then(
            res => {
                console.log("DONE",res.tx);
            },err => {
                console.log("ERROR",err);
            }
        )
        index++
    }
    callback(pixel)
}

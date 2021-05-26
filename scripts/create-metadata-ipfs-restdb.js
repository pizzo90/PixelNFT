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
            "value": 0,
            "max_value": 255

        },
        {
            "trait_type": "Green",
            "value": 0,
            "max_value": 255
        },
        {
            "trait_type": "Blue",
            "value": 0,
            "max_value": 255
        }
    ]
}


const savedPixelTemplate = {
    "pixelIndex": 0,
    "data": {
        "red": 0,
        "green": 0,
        "blue": 0,
        "birthday": "",
        "ERC721TokenUri": "",
        "metadata": ""
    }
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

        let data = '';
        let dataToSearch = JSON.stringify({"pixelIndex": index});
        let restDbData = {
            method: 'get',
            url: 'https://pixels-d687.restdb.io/rest/pixels?q=' + dataToSearch,
            headers: { 
                'Content-Type': 'application/json', 
                'x-apikey': process.env.RESTDB_API_KEY
            },
            data : data
        };

        let exists = await Axios(restDbData).then(function (response) {
            return response.data.length;
        }).catch(function (error) {
            console.log(error);
        });

        if (exists > 0) {
            console.log('already exists - nothing to do');
            index++
            continue
        } else console.log("Generate pixel Metadata for pixel:",pixelMetadata['name'])

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
        });
        console.log(jsonCidr);
        let tx = await pixel.setTokenURI(index, jsonCidr).then(
            res => {
                console.log("DONE SAVE TOKENURI on pixel index:",index,res.tx);
                return true;
            },err => {
                console.log("ERROR",err);
                return false;
            }
        )
        if(tx){
            //OK NOW SAVE THE PIXEL IN OUR DATABASE
            let data = JSON.stringify({
                "pixelIndex": index,
                "data": {
                    "height": 100,
                    "width": 100,
                    "red": pixelOverview['red']['words'][0],
                    "green": pixelOverview['green']['words'][0],
                    "blue": pixelOverview['blue']['words'][0],
                    "birthday": "2021-05-25",
                    "ERC721TokenUri": jsonCidr
                }
            });
            let restDbData = {
                method: 'post',
                url: 'https://pixels-d687.restdb.io/rest/pixels',
                headers: { 
                    'Content-Type': 'application/json', 
                    'x-apikey': process.env.RESTDB_API_KEY
                },
                data : data
            };
            let savedData = await Axios(restDbData).then(
                response => {
                    console.log(JSON.stringify(response.data));
                },error => {
                    console.log(error);
                });
        }    
        index++
    }
    callback("PROCESS END - Thank you");
}

/*
 * @dev SET TOKEN URI THAT IS MANDATORY FOR THE ERC721 
 * to be human-readable, sellable, and owned!
 */

const Pixel = artifacts.require('Pixel')
const TOKENID = 0
module.exports = async callback => {
    const pixel = await Pixel.deployed()
    console.log('Let\'s set the tokenURI of your pixels')
    const tx = await pixel.setTokenURI(6, "https://ipfs.io/ipfs/QmQt6spM4qZRrvf4ZS7KLU6ipojm2WZwWMJuFXZ7rqvqei?filename=try24.json")
    console.log(tx)
    callback(tx.tx)
}

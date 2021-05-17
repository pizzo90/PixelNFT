const Pixel = artifacts.require('Pixel')
const TOKENID = 0
module.exports = async callback => {
    const pixel = await Pixel.deployed()
    console.log('Let\'s set the tokenURI of your pixels')
    const tx = await pixel.setTokenURI(0, "https://ipfs.io/ipfs/QmYGU7Hztd4dthmnCfhPuZLT6xYu4RzakbJ6X4KxNhU3tB?filename=bluepixel.json")
    console.log(tx)
    callback(tx.tx)
}

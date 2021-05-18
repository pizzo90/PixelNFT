const Pixel = artifacts.require('Pixel')
module.exports = async callback => {
    const pixel = await Pixel.deployed()
    let contractAddress = await Pixel.address;
    callback(contractAddress);
  }
  
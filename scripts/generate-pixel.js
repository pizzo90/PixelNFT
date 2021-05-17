const Pixel = artifacts.require('Pixel')

module.exports = async callback => {
  const pixel = await Pixel.deployed()
  console.log('Creating requests on contract:', pixel.address)
  const tx = await pixel.requestNewRamdomPixel(77, "Blue Pixel")
  callback(tx.tx)
}

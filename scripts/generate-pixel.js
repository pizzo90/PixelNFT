const Pixel = artifacts.require('Pixel')
//CREO IL PIXEL
module.exports = async callback => {
  const pixel = await Pixel.deployed()
  console.log('Creating requests on contract:', pixel.address)
  const tx = await pixel.requestNewRandomPixel(234234342, "TRY24")
  callback(tx.tx)
}

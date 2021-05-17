const Pixel = artifacts.require('Pixel')

module.exports = async callback => {
    const pixel = await Pixel.deployed()
    console.log('Let\'s get the overview of your pixel')
    const overview = await pixel.pixels(0)
    console.log(overview)
    callback(overview.tx)
}

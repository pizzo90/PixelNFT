
const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers')
const RANDOM_SEED = 100
const CHARACTER_NAME = "FANTASTIC PIXEL"
contract('Pixel', accounts => {
    const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
    const Pixel = artifacts.require('Pixel.sol')
    const defaultAccount = accounts[0]
    let link, pixel
    beforeEach(async () => {
        link = await LinkToken.new({ from: defaultAccount })
        pixel = await Pixel.new({ from: defaultAccount })
    })
    describe('#requestNewRandomCharacter', () => {
        context('without LINK', () => {
            it('reverts', async () => {
                const newPixel = await expectRevert.unspecified(pixel.requestNewRandomCharacter(RANDOM_SEED, CHARACTER_NAME))
            })
        })
    })
})  
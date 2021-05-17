// contracts/Pixel.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Pixel is ERC721, VRFConsumerBase, Ownable {
    using SafeMath for uint256;
    using Strings for string;


    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    address public VRFCoordinator;
    // rinkeby: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
    address public LinkToken;
    // rinkeby: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709a

    struct Pixel {
        uint256 height;
        uint256 width;
        uint256 color;
        string name;
    }

    Pixel[] public pixels;

    mapping(bytes32 => string) requestToPixelName;
    mapping(bytes32 => address) requestToSender;
    mapping(bytes32 => uint256) requestToTokenId;

    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Rinkeby
     * Chainlink VRF Coordinator address: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
     * LINK token address:                0x01BE23585060835E02B77ef475b0Cc51aA1e0709
     * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
     */
    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyhash)
        public
        VRFConsumerBase(_VRFCoordinator, _LinkToken)
        ERC721("Pixel", "PxP")
    {   
        VRFCoordinator = _VRFCoordinator;
        LinkToken = _LinkToken;
        keyHash = _keyhash;
        fee = 0.1 * 10**18; // 0.1 LINK
    }

    function requestNewRandomPixel(
        uint256 userProvidedSeed,
        string memory name
    ) public returns (bytes32) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        bytes32 requestId = requestRandomness(keyHash, fee, userProvidedSeed);
        requestToPixelName[requestId] = name;
        requestToSender[requestId] = msg.sender;
        return requestId;
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        _setTokenURI(tokenId, _tokenURI);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        uint256 newId = pixels.length;
        uint256 height = 100;
        uint256 width = 100;
        uint256 color = ((randomNumber % 1000000) / 1);

        pixels.push(
            Pixel(
                height,
                width,
                color,
                requestToPixelName[requestId]
            )
        );
        _safeMint(requestToSender[requestId], newId);
    }

    function getNumberOfPixels() public view returns (uint256) {
        return pixels.length; 
    }

    function getPixelOverView(uint256 tokenId)
        public
        view
        returns (
            string memory,
            uint256
        )
    {
        return (
            pixels[tokenId].name,
            pixels[tokenId].width + pixels[tokenId].height + pixels[tokenId].color
        );
    }

    function getPixelsStats(uint256 tokenId)
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        return (
            pixels[tokenId].width,
            pixels[tokenId].height,
            pixels[tokenId].color
        );
    }

    function sqrt(uint256 x) internal view returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}

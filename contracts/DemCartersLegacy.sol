// 
        
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DemCartersLegacy is ERC721, ERC721Royalty, Ownable {
    using Strings for uint256;

    uint96 public constant ROYALTY_PERCENT = 800; // 8%
    address public immutable TRUST_ADDRESS = 0x274619a7b698FD883b18ACe1eD04844c7Ce73E81;

    uint256 private _nextTokenId;

    constructor(address initialOwner)
        ERC721("DEM CARTER’S PLACE - Built Different Legacy", "DCP")
        Ownable(initialOwner)
    {
        _setDefaultRoyalty(TRUST_ADDRESS, ROYALTY_PERCENT);
    }

    function safeMint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function batchMint(address to, uint256 quantity) external onlyOwner {
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);
        return string(abi.encodePacked("https://your-metadata-url.com/metadata/", tokenId.toString(), ".json"));
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        public view override returns (address, uint256)
    {
        return super.royaltyInfo(tokenId, salePrice);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721Royalty) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
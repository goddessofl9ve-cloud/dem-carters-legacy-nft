// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DemCartersLegacy is ERC721, ERC721Royalty, Ownable {
    using Strings for uint256;

    // ============ Constants ============
    uint96 public constant ROYALTY_PERCENT = 800; // 8% (basis points: 10000 = 100%)
    uint256 public constant MAX_SUPPLY = 500;

    // ============ State Variables ============
    address public immutable TRUST_ADDRESS; // The Carters Family Revocable Living Trust wallet
    string private baseURI;
    uint256 private _nextTokenId;

    // ============ Events ============
    event BaseURIUpdated(string newBaseURI);
    event BatchMintCompleted(address indexed to, uint256 startTokenId, uint256 count);

    // ============ Constructor ============
    constructor(address trustAddr, string memory initialBaseURI)
        ERC721("DEM CARTER'S PLACE - Built Different Legacy", "DCP")
        Ownable(msg.sender)
    {
        require(trustAddr != address(0), "Trust address cannot be zero");
        TRUST_ADDRESS = trustAddr;
        baseURI = initialBaseURI;
        _setDefaultRoyalty(trustAddr, ROYALTY_PERCENT);
    }

    // ============ Minting Functions ============

    /**
     * @dev Mint a single NFT with explicit token ID
     * @param to Recipient address
     * @param tokenId Token ID to mint
     */
    function mint(address to, uint256 tokenId) external onlyOwner {
        require(tokenId < MAX_SUPPLY, "Token ID exceeds max supply");
        require(to != address(0), "Cannot mint to zero address");
        _safeMint(to, tokenId);
    }

    /**
     * @dev Batch mint multiple NFTs with sequential token IDs
     * @param recipients Array of recipient addresses
     */
    function batchMint(address[] calldata recipients) external onlyOwner {
        require(recipients.length > 0, "Recipients array cannot be empty");
        require(_nextTokenId + recipients.length <= MAX_SUPPLY, "Batch exceeds max supply");

        uint256 startTokenId = _nextTokenId;

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Cannot mint to zero address");
            _safeMint(recipients[i], _nextTokenId);
            _nextTokenId++;
        }

        emit BatchMintCompleted(msg.sender, startTokenId, recipients.length);
    }

    /**
     * @dev Auto-increment mint for sequential distribution
     * @param to Recipient address
     */
    function autoMint(address to) external onlyOwner returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId);
        _nextTokenId++;
        return tokenId;
    }

    // ============ Metadata Functions ============

    /**
     * @dev Set the base URI for token metadata
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Get the base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Get token URI
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return string(
            abi.encodePacked(
                baseURI,
                "/",
                tokenId.toString(),
                ".json"
            )
        );
    }

    // ============ Royalty Functions ============

    /**
     * @dev Get royalty information for marketplace compliance
     */
    function royaltyInfo(uint256, uint256 salePrice)
        public
        view
        override
        returns (address, uint256)
    {
        uint256 royaltyAmount = (salePrice * ROYALTY_PERCENT) / 10000;
        return (TRUST_ADDRESS, royaltyAmount);
    }

    // ============ Interface Support ============

    /**
     * @dev Support for ERC165 interface detection
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // ============ View Functions ============

    /**
     * @dev Get the next available token ID
     */
    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Get total minted count
     */
    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Get remaining supply
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - _nextTokenId;
    }

    // ============ Burn Override ============

    /**
     * @dev Override burn to clear royalty info
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721Royalty) {
        super._burn(tokenId);
    }
}
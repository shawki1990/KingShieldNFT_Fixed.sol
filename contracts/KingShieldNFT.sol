// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract KingShieldNFT is ERC721, ERC2981, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenCounter;
    string private _baseTokenURI = "";
    string private _arweaveTxId;

    event Minted(address indexed to, uint256 tokenId);

    constructor() ERC721("الدرع الملكي", "KSN") {}

    function setBaseURI(string memory newURI) external onlyOwner {
        require(bytes(newURI).length > 0, "Base URI cannot be empty");
        _baseTokenURI = newURI;
    }

    function setArweaveTxId(string memory newTxId) external onlyOwner {
        _arweaveTxId = newTxId;
    }

    function mint(address to) external onlyOwner returns (uint256) {
        _tokenCounter.increment();
        uint256 tokenId = _tokenCounter.current();
        _safeMint(to, tokenId);
        emit Minted(to, tokenId);
        return tokenId;
    }

    /// @notice Set default royalty information (feeNumerator uses fee denominator of 10000)
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return bytes(_baseTokenURI).length > 0
            ? string(abi.encodePacked(_baseTokenURI, tokenId.toString()))
            : "";
    }

    function arweaveTxId() external view returns (string memory) {
        return _arweaveTxId;
    }

    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        uint256 total = _tokenCounter.current();
        uint256[] memory tokens = new uint256[](total);
        uint256 count = 0;
        for (uint256 i = 1; i <= total; i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                tokens[count] = i;
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tokens[i];
        }
        return result;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

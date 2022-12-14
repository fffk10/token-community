// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MemberNFT is ERC721Enumerable, ERC721URIStorage, Ownable {
    /**
     * @dev
     * - _tokenIds is able to Counters functions.
     */
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event TokenURIChanged(address indexed to, uint256 indexed tokenId, string uri);

    constructor() ERC721("MemberNFT", "MEM") {}

    /**
     * @notice  .
     * @dev     Only address that have deployed this contract can mint.
     * @param   to  .
     * @param   uri  .
     */
    function nftMint(address to, string calldata uri) external onlyOwner {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
    }

    /**
     * @notice  .
     * @dev     オーバーライド
     * @param   from  .
     * @param   to  .
     * @param   tokenId  .
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @notice  .
     * @dev     オーバーライド
     * @param   tokenId  .
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @notice  .
     * @dev     オーバーライド
     * @param   interfaceId  .
     * @return  bool  .
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @notice  .
     * @dev     オーバーライド
     * @param   tokenId  .
     * @return  string  .
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}

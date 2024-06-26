// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract BasicNft is ERC721 {
    string public constant TOKEN_URI = "https://white-advanced-flea-956.mypinata.cloud/ipfs/QmPdwViV9rMi2vno4NFHQ1Cfh3cnyPGm5Yxm5ixFp2P5Le";
    uint256 private s_tokenCounter = 0;

    event LogMinted(uint256 indexed tokenId);

    constructor() ERC721("Keke", "KK") {
        s_tokenCounter = 0;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        emit LogMinted(s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getAddress0() public pure returns (address) {
        return address(0);
    }
}

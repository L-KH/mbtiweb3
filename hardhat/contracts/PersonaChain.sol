// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MBTICard is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(address => bool) public hasMinted;
    mapping(string => address) public mbtiToAddress;
    mapping(string => address[]) public mbtiCommunities;
    
    constructor() ERC721("MBTICard", "MBTI") {
        tokenCounter = 0;
    }
    
    function mintCard(string memory tokenURI, string memory mbtiType) public {
        require(!hasMinted[msg.sender], "This address has already minted a token");
        require(mbtiToAddress[mbtiType] == address(0), "This MBTI type has already been taken");
        _safeMint(msg.sender, tokenCounter);
        _setTokenURI(tokenCounter, tokenURI);
        hasMinted[msg.sender] = true;
        mbtiToAddress[mbtiType] = msg.sender;
        mbtiCommunities[mbtiType].push(msg.sender);
        tokenCounter++;
    }

    function getCommunity(string memory mbtiType) public view returns (address[] memory) {
        return mbtiCommunities[mbtiType];
    }
}

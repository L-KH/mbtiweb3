// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract MBTICard is ERC721URIStorage, Ownable, Pausable {
    uint256 public tokenCounter;
    mapping(string => address) public mbtiToAddress;
    mapping(string => address[]) public mbtiCommunities;
    uint256 public burningFee; // fee for burning an NFT

    struct Card {
        string name;
        string profileImageURI;
        string coverImageURI;
        string selectedPersonality;
        string twitterHandle;
        string telegramHandle;
        string quote;
        string metadataURI;
    }
    
    mapping (uint256 => Card) public cards;
    mapping (address => bool) public hasMinted;
    mapping (address => uint256) public ownerToTokenId;

    // In the constructor, set the initial burning fee to 0.01 Ether
    constructor() ERC721("PersonaChain", "MBTI") {
        tokenCounter = 0;
        burningFee = 0.01 ether; // 0.01 Ether is the initial burning fee
    }
    
    function mintCard(string memory name, string memory profileImageURI, string memory coverImageURI, string memory selectedPersonality, string memory twitterHandle, string memory telegramHandle, string memory quote, string memory metadataURI) public {
        if (msg.sender != owner()) {
            require(!hasMinted[msg.sender], "You have already minted an NFT!");
        }

        cards[tokenCounter] = Card(name, profileImageURI, coverImageURI, selectedPersonality, twitterHandle, telegramHandle, quote, metadataURI);
        _safeMint(msg.sender, tokenCounter);
        _setTokenURI(tokenCounter, metadataURI);
        
        mbtiToAddress[selectedPersonality] = msg.sender;
        mbtiCommunities[selectedPersonality].push(msg.sender);
        
        hasMinted[msg.sender] = true;
        ownerToTokenId[msg.sender] = tokenCounter;  // Store the tokenId of the minted NFT associated with the address

        tokenCounter++;
    }
    function getMBTIType(address owner) public view returns (string memory) {
        require(hasMinted[owner], "The provided address hasn't minted any NFT.");
        uint256 tokenId = ownerToTokenId[owner];
        return cards[tokenId].selectedPersonality;
    }
    function getCommunity(string memory mbtiType) public view returns (address[] memory) {
        return mbtiCommunities[mbtiType];
    }
    
    function totalSupply() public view returns (uint256) {
        return tokenCounter;
    }

    function burn(uint256 tokenId) public payable {
        require(_isApprovedOrOwner(msg.sender, tokenId), "You do not own this token!");

        // Ensure correct fee is paid
        require(msg.value == burningFee, "Burning fee not met!");

        _burn(tokenId);
        hasMinted[msg.sender] = false;
    }
    
    // Owner can withdraw the collected burning fees
    function withdrawFees() public onlyOwner {
        uint balance = address(this).balance;
        Address.sendValue(payable(owner()), balance);
    }

    // Owner can change the burning fee
    function changeBurningFee(uint256 newFee) public onlyOwner {
        burningFee = newFee;
    }
}
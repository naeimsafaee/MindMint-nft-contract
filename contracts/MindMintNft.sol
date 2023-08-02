// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract MindMintNft is ERC721, IERC721Receiver {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public constant MAX_SUPPLY = 40000;
    uint256 public constant MAX_PER_CATEGORY = 5000;
    uint256 public constant CATEGORY_COUNT = 8;

    mapping(uint256 => uint256) private _categoryPrices;
    mapping(uint256 => uint256) private _categoryMaxCounts;
    mapping(uint256 => uint256) private _categoryCounts;
    mapping(uint256 => string) private _tokenURIs;
    IERC20 private _erc20Token;
    address private _manager;
    string private _baseUrl;

    mapping(uint256 => address) private _tokenOwners;
    mapping(uint256 => address) private _tokenBuyers;
    mapping(uint256 => bool) private _depositedNFTs;

    event NFTDeposited(address indexed owner, uint256 tokenId);

    struct FeeRecipient {
        address recipient;
        uint256 feePercent;
    }

    FeeRecipient[] private _feeRecipients;

    //king => 5
    //queen => 4
    //bishop => 3
    //knight => 2
    //rook => 1
    //pawn => 0

    constructor(address erc20TokenAddress, string memory baseUrl) ERC721("MindMint", "NFT") {

        _erc20Token = IERC20(erc20TokenAddress);
        _manager = address(0);
        _baseUrl = baseUrl;

        for (uint256 i = 0; i < CATEGORY_COUNT; i++) {
            _categoryPrices[i] = 0;
            _categoryMaxCounts[i] = MAX_PER_CATEGORY;

            _feeRecipients.push(FeeRecipient(address(0), 0));
        }
    }

    function mint(uint256 category, uint256 tokenId) public {
        require(category < CATEGORY_COUNT, "Invalid category");
        require(_categoryCounts[category] < _categoryMaxCounts[category], "Category supply exceeded");
        require(_tokenIds.current() < MAX_SUPPLY, "Maximum supply exceeded");

        uint256 requiredTokenAmount = _categoryPrices[category];

        require(_erc20Token.transferFrom(msg.sender, address(this), requiredTokenAmount), "Token transfer failed");

        for (uint256 i = 0; i < _feeRecipients.length; i++) {
            if (_feeRecipients[i].feePercent > 0)
                require(_erc20Token.transfer(_feeRecipients[i].recipient, calculateFeeAmount(requiredTokenAmount, _feeRecipients[i].feePercent)), "Fee transfer failed");
        }

        _tokenIds.increment();
        _safeMint(address(this), tokenId);
        _categoryCounts[category]++;

        _tokenOwners[tokenId] = address(this);
        _tokenBuyers[tokenId] = msg.sender;
        _depositedNFTs[tokenId] = true;

        _setTokenURI(tokenId, tokenMetaDataUrl(tokenId));
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
        public virtual override returns (bytes4){

        return this.onERC721Received.selector;
    }

    function depositNFT(uint256 tokenId) public payable {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can deposit the NFT");
        require(!_depositedNFTs[tokenId], "NFT already deposited");
        require(msg.value == 0.003 ether, "Incorrect Ether amount");

        _depositedNFTs[tokenId] = true;
        _tokenOwners[tokenId] = address(this);
        _tokenBuyers[tokenId] = msg.sender;

        _transfer(msg.sender, address(this), tokenId);
        payable(_manager).transfer(msg.value);

        emit NFTDeposited(msg.sender, tokenId);
    }

    function withdrawNFT(uint256 tokenId, address to) public payable {
        require(ownerOf(tokenId) == address(this), "NFT not owned by contract");
        require(_tokenBuyers[tokenId] == msg.sender, "This address is not the buyer of nft");
        require(msg.value == 0.003 ether, "Incorrect Ether amount");

        _transfer(address(this), to, tokenId);
        _tokenOwners[tokenId] = to;
        _depositedNFTs[tokenId] = false;

        payable(_manager).transfer(msg.value / 2);
    }

    function withdrawNFTByManager(uint256 tokenId, address to) public {
        require(msg.sender == _manager, "Only manager can withdraw NFT");
        require(ownerOf(tokenId) == address(this), "NFT not owned by contract");

        _transfer(address(this), to, tokenId);
        _tokenOwners[tokenId] = to;
    }

    function setCategoryPrice(uint256 category, uint256 price) public {
        require(category < CATEGORY_COUNT, "Invalid category");
        _categoryPrices[category] = price;
    }

    function setCategoryMaxCount(uint256 category, uint256 maxCount) public {
        require(category < CATEGORY_COUNT, "Invalid category");
        _categoryMaxCounts[category] = maxCount;
    }

    function getCategoryPrice(uint256 category) public view returns (uint256) {
        require(category < CATEGORY_COUNT, "Invalid category");
        return _categoryPrices[category];
    }

    function getCategoryMaxCount(uint256 category) public view returns (uint256) {
        require(category < CATEGORY_COUNT, "Invalid category");
        return _categoryMaxCounts[category];
    }

    function getTokenMetadata(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Invalid token ID");
        return _tokenURIs[tokenId];
    }

    function setManager() public {
        require(_manager == address(0), "Manager is not empty");
        _manager = msg.sender;
    }

    function getManager() public view returns (address) {
        return _manager;
    }

    function setBaseUrl(string memory baseUrl) public {
        _baseUrl = baseUrl;
    }

    function getBaseUrl() public view returns (string memory) {
        return _baseUrl;
    }

    function tokenMetaDataUrl(uint256 tokenId) public view returns (string memory) {
        string memory extension = ".json";
        string memory tokenIdStr = uint256ToString(tokenId);
        return string(abi.encodePacked(_baseUrl, tokenIdStr, extension));
    }

    function uint256ToString(uint256 value) private pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        require(_exists(tokenId), "Invalid token ID");
        _tokenURIs[tokenId] = tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Invalid token ID");
        return _tokenURIs[tokenId];
    }

    function withdrawERC20(address to, uint256 amount) public {
        require(msg.sender == _manager, "Only manager can withdraw");
        require(amount > 0, "Amount must be greater than zero");

        _erc20Token.transfer(to, amount);
    }

    function convertEtherToWei(uint256 etherAmount) public pure returns (uint256) {
        uint256 weiAmount = etherAmount * 1 ether;
        return weiAmount;
    }

    function setFeeRecipient(uint256 index, address recipient, uint256 feePercent) public {
        require(index < _feeRecipients.length, "Invalid index");
        _feeRecipients[index].recipient = recipient;
        _feeRecipients[index].feePercent = feePercent;
    }

    function getFeeRecipient(uint256 index) public view returns (address, uint256) {
        require(index < _feeRecipients.length, "Invalid index");
        return (_feeRecipients[index].recipient, _feeRecipients[index].feePercent);
    }

    function calculateFeeAmount(uint256 amount, uint256 feePercent) internal pure returns (uint256) {
        return (amount * feePercent) / 100;
    }
}

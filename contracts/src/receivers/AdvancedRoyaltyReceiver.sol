// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {ERC165, IERC165} from "../../lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";
import {IRoyaltyReceiver} from "../interfaces/IRoyaltyReceiver.sol";

abstract contract AdvancedRoyaltyReceiver is IRoyaltyReceiver, ERC165 {
    struct AdvancedRoyaltyInfo {
        address receiver;
        uint48 buyerFraction;
        uint48 sellerFraction;
    }

    AdvancedRoyaltyInfo private _defaultRoyaltyInfo;
    mapping(uint256 => AdvancedRoyaltyInfo) private _tokenRoyaltyInfo;
    mapping(address => uint256) private _royaltyAccrued;

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IRoyaltyReceiver).interfaceId || super.supportsInterface(interfaceId);
    }

    function buyerRoyaltyInfo(uint256 tokenId, uint256 salePrice) public view virtual returns (address, uint256) {
        AdvancedRoyaltyInfo memory royalty = _tokenRoyaltyInfo[tokenId];

        if (royalty.receiver == address(0)) {
            royalty = _defaultRoyaltyInfo;
        }

        uint256 royaltyAmount = (salePrice * royalty.buyerFraction) / _feeDenominator();

        return (address(this), royaltyAmount);
    }

    function sellerRoyaltyInfo(uint256 tokenId, uint256 salePrice) public view virtual returns (address, uint256) {
        AdvancedRoyaltyInfo memory royalty = _tokenRoyaltyInfo[tokenId];

        if (royalty.receiver == address(0)) {
            royalty = _defaultRoyaltyInfo;
        }

        uint256 royaltyAmount = (salePrice * royalty.sellerFraction) / _feeDenominator();

        return (address(this), royaltyAmount);
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice) public view virtual override returns (address, uint256) {
        AdvancedRoyaltyInfo memory royalty = _tokenRoyaltyInfo[tokenId];

        if (royalty.receiver == address(0)) {
            royalty = _defaultRoyaltyInfo;
        }

        uint256 royaltyAmount = (salePrice * (royalty.sellerFraction + royalty.buyerFraction)) / _feeDenominator();

        return (address(this), royaltyAmount);
    }

    function onRoyaltyReceived(
        uint256 tokenId,
        uint256 salePrice,
        address royaltyPayer,
        bytes calldata data
    ) external payable virtual returns (bytes4){
        uint256 royaltyAmount;

        if(keccak256(data) == keccak256(bytes("BUYER"))){
            (, royaltyAmount) = buyerRoyaltyInfo(tokenId, salePrice);
        } else if (keccak256(data) == keccak256(bytes("SELLER"))){
            (, royaltyAmount) = sellerRoyaltyInfo(tokenId, salePrice);
        } else {
            (, royaltyAmount) = royaltyInfo(tokenId, salePrice);
        }
        
        bool royaltyRespected = msg.value >= royaltyAmount;

        if(royaltyRespected){
            address royaltyReceiver = _tokenRoyaltyInfo[tokenId].receiver;
            _royaltyAccrued[royaltyReceiver] += msg.value;
        }

        emit RoyaltyStatus(
            msg.sender, 
            royaltyPayer, 
            royaltyAmount, 
            msg.value,
            royaltyRespected
        );

        return IRoyaltyReceiver.onRoyaltyReceived.selector;
    }

    function claimRoyalty(address receiver) external virtual returns(bool success){
        uint256 amount = _royaltyAccrued[receiver];
        delete _royaltyAccrued[receiver];
        (success,) = receiver.call{value: amount}("");
        require(success);
    }

    function _feeDenominator() internal pure virtual returns (uint96) {
        return 10000;
    }

    function _setDefaultRoyalty(address receiver, uint48 buyerNumerator, uint48 sellerNumerator) internal virtual {
        require((buyerNumerator <= _feeDenominator()) && (sellerNumerator <= _feeDenominator()), "ERC2981: royalty fee will exceed salePrice");
        require(receiver != address(0), "ERC2981: invalid receiver");

        _defaultRoyaltyInfo = AdvancedRoyaltyInfo(receiver, buyerNumerator, sellerNumerator);
    }

     function _deleteDefaultRoyalty() internal virtual {
        delete _defaultRoyaltyInfo;
    }

    function _setTokenRoyalty(uint256 tokenId, address receiver, uint48 buyerNumerator, uint48 sellerNumerator) internal virtual {
        require((buyerNumerator <= _feeDenominator()) && (sellerNumerator <= _feeDenominator()), "ERC2981: royalty fee will exceed salePrice");
        require(receiver != address(0), "ERC2981: Invalid parameters");

        _tokenRoyaltyInfo[tokenId] = AdvancedRoyaltyInfo(receiver, buyerNumerator, sellerNumerator);
    }

    function _resetTokenRoyalty(uint256 tokenId) internal virtual {
        delete _tokenRoyaltyInfo[tokenId];
    }

}

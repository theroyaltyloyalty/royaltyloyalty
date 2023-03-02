// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {ERC2981, IERC2981, IERC165} from "../../lib/openzeppelin-contracts/contracts/token/common/ERC2981.sol";
import {IRoyaltyReceiver} from "../interfaces/IRoyaltyReceiver.sol";

abstract contract RoyaltyReceiver is IRoyaltyReceiver, ERC2981 {
    RoyaltyInfo private _defaultRoyaltyInfo;
    mapping(uint256 => RoyaltyInfo) private _tokenRoyaltyInfo;
    mapping(address => uint256) private _royaltyAccrued;

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC2981, IERC165) returns (bool) {
        return interfaceId == type(IRoyaltyReceiver).interfaceId || super.supportsInterface(interfaceId);
    }
    
    function royaltyInfo(uint256 tokenId, uint256 salePrice) public view virtual override(ERC2981, IERC2981) returns (address, uint256) {
        RoyaltyInfo memory royalty = _tokenRoyaltyInfo[tokenId];

        if (royalty.receiver == address(0)) {
            royalty = _defaultRoyaltyInfo;
        }

        uint256 royaltyAmount = (salePrice * royalty.royaltyFraction) / _feeDenominator();

        return (address(this), royaltyAmount);
    }

    function onRoyaltyReceived(
        uint256 tokenId,
        uint256 salePrice,
        address royaltyPayer,
        bytes calldata
    ) external payable virtual returns (bytes4){
        (, uint256 royaltyAmount) = royaltyInfo(tokenId, salePrice);
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
}
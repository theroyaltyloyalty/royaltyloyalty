// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {ERC165, IERC165} from "../../lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";
import {IFlexRoyaltyReceiver} from "../interfaces/IFlexRoyaltyReceiver.sol";
import {ERC20} from "../../lib/solmate/src/tokens/ERC20.sol";

contract FlexRoyaltyReceiver is IFlexRoyaltyReceiver, ERC165 {
    struct FlexRoyaltyInfo {
        address receiver;
        uint48 buyerFraction;
        uint48 sellerFraction;
        address currency;
    }

    FlexRoyaltyInfo private _defaultRoyaltyInfo;
    mapping(uint256 => FlexRoyaltyInfo) private _tokenRoyaltyInfo;
    mapping(address => mapping(address => uint256)) private _royaltyAccrued;
    mapping(address => uint256) private _previousBalance;

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IFlexRoyaltyReceiver).interfaceId || super.supportsInterface(interfaceId);
    }

    function flexRoyaltyInfo(uint256 tokenId, uint256 salePrice, bool isSeller) public view virtual returns (address, uint256) {
        FlexRoyaltyInfo memory royalty = _tokenRoyaltyInfo[tokenId];

        if (royalty.receiver == address(0)) {
            royalty = _defaultRoyaltyInfo;
        }

        uint256 royaltyAmount;
        if(isSeller){
            royaltyAmount = (salePrice * royalty.sellerFraction) / _feeDenominator();
        } else {
            royaltyAmount = (salePrice * royalty.buyerFraction) / _feeDenominator();
        }

        return (royalty.currency, royaltyAmount);
    }

    function onRoyaltyReceived(
        uint256 _tokenId,
        uint256 _salePrice,
        address _royaltyPayer,
        bool _isSeller,        
        bytes calldata
    ) external payable returns (bytes4){
        (address currency, uint256 royaltyAmount) = _isSeller 
            ? flexRoyaltyInfo(_tokenId, _salePrice, _isSeller) 
            : flexRoyaltyInfo(_tokenId, _salePrice, !_isSeller);

        bool royaltyRespected;
        uint256 prevBalance;
        uint256 currentBalance;

        if(currency == address(0)){
            royaltyRespected = msg.value >= royaltyAmount;
        } else {
            prevBalance = _previousBalance[currency];
            currentBalance = ERC20(currency).balanceOf(address(this));
            _previousBalance[currency] = currentBalance;

            royaltyRespected = currentBalance > prevBalance
                && (currentBalance - prevBalance)
                    >= royaltyAmount;
        }
        
        if(royaltyRespected){
            address royaltyReceiver = _tokenRoyaltyInfo[_tokenId].receiver;
            if(currency == address(0)){
                _royaltyAccrued[royaltyReceiver][currency] 
                    += msg.value;
            } else {
                _royaltyAccrued[royaltyReceiver][currency] 
                    += (currentBalance - prevBalance);
            }
        }

        emit RoyaltyStatus(
            msg.sender, 
            currency,
            _royaltyPayer, 
            royaltyAmount, 
            msg.value,
            royaltyRespected
        );  

        return IFlexRoyaltyReceiver.onRoyaltyReceived.selector;
    }

    function claimRoyalty(address receiver, address currency) external virtual returns(bool success){
        uint256 amount = _royaltyAccrued[receiver][currency];
        delete _royaltyAccrued[receiver][currency];
        if(currency == address(0)){
            (success,) = receiver.call{value: amount}("");
        } else {
            success = ERC20(currency).transfer(receiver, amount);
        }
        _previousBalance[currency] = ERC20(currency).balanceOf(address(this));
        require(success);
    }

    function _feeDenominator() internal pure virtual returns (uint96) {
        return 10000;
    }

    function _setDefaultRoyalty(address receiver, uint48 buyerNumerator, uint48 sellerNumerator, address currency) internal virtual {
        require((buyerNumerator <= _feeDenominator()) && (sellerNumerator <= _feeDenominator()), "ERC2981: royalty fee will exceed salePrice");
        require(receiver != address(0), "ERC2981: invalid receiver");

        _defaultRoyaltyInfo = FlexRoyaltyInfo(receiver, buyerNumerator, sellerNumerator, currency);
    }

     function _deleteDefaultRoyalty() internal virtual {
        delete _defaultRoyaltyInfo;
    }

    function _setTokenRoyalty(uint256 tokenId, address receiver, uint48 buyerNumerator, uint48 sellerNumerator, address currency) internal virtual {
        require((buyerNumerator <= _feeDenominator()) && (sellerNumerator <= _feeDenominator()), "ERC2981: royalty fee will exceed salePrice");
        require(receiver != address(0), "ERC2981: Invalid parameters");

        _tokenRoyaltyInfo[tokenId] = FlexRoyaltyInfo(receiver, buyerNumerator, sellerNumerator, currency);
    }

    function _resetTokenRoyalty(uint256 tokenId) internal virtual {
        delete _tokenRoyaltyInfo[tokenId];
    }

}
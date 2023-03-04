// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {ERC2981, IERC2981, IERC165} from '../../lib/openzeppelin-contracts/contracts/token/common/ERC2981.sol';
import {ISimpleReceiver} from '../interfaces/ISimpleReceiver.sol';
import {ERC20} from '../../lib/solmate/src/tokens/ERC20.sol';

abstract contract RoyaltyReceiver is ISimpleReceiver, ERC2981 {
    struct RoyaltyInformation {
        address receiver;
        uint96 royaltyFraction;
        address currency;
    }

    RoyaltyInformation private _defaultRoyaltyInfo;
    mapping(uint256 => RoyaltyInformation) private _tokenRoyaltyInfo;
    mapping(address => mapping(address => uint256)) private _royaltyAccrued;
    mapping(address => uint256) private _previousBalance;

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC2981, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(ISimpleReceiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        public
        view
        virtual
        override(ERC2981, IERC2981)
        returns (address, uint256)
    {
        RoyaltyInformation memory royalty = _tokenRoyaltyInfo[tokenId];

        if (royalty.receiver == address(0)) {
            royalty = _defaultRoyaltyInfo;
        }

        uint256 royaltyAmount = (salePrice * royalty.royaltyFraction) /
            _feeDenominator();

        return (address(this), royaltyAmount);
    }

    function royaltyCurrencyInfo(uint256 _tokenId)
        external
        view
        returns (address)
    {
        return _tokenRoyaltyInfo[_tokenId].currency;
    }

    function onRoyaltyReceived(
        uint256 tokenId,
        address royaltyPayer,
        address currency,
        bytes calldata
    ) external payable virtual returns (bytes4) {
        address royaltyReceiver = _tokenRoyaltyInfo[tokenId].receiver;

        uint256 amount;
        if (currency == address(0)) {
            amount = msg.value;
        } else {
            uint256 prevBalance = _previousBalance[currency];
            uint256 currentBalance = ERC20(currency).balanceOf(address(this));
            _previousBalance[currency] = currentBalance;

            amount = currentBalance > prevBalance
                ? currentBalance = prevBalance
                : 0;
        }

        _royaltyAccrued[royaltyReceiver][currency] += amount;

        emit RoyaltyPayment(
            msg.sender,
            royaltyPayer,
            currency,
            tokenId,
            amount
        );

        return ISimpleReceiver.onRoyaltyReceived.selector;
    }

    function claimRoyalty(address receiver, address currency)
        external
        virtual
        returns (bool success)
    {
        uint256 amount = _royaltyAccrued[receiver][currency];
        delete _royaltyAccrued[receiver][currency];
        if (currency == address(0)) {
            (success, ) = receiver.call{value: amount}('');
        } else {
            success = ERC20(currency).transfer(receiver, amount);
        }
        _previousBalance[currency] = ERC20(currency).balanceOf(address(this));
        require(success);
    }

    function _setDefaultRoyalty(
        address receiver,
        uint96 royaltyNumerator,
        address currency
    ) internal virtual {
        require(
            (royaltyNumerator <= _feeDenominator()),
            'ERC2981: royalty fee will exceed salePrice'
        );
        require(receiver != address(0), 'ERC2981: invalid receiver');

        _defaultRoyaltyInfo = RoyaltyInformation(
            receiver,
            royaltyNumerator,
            currency
        );
    }

    function _deleteDefaultRoyalty() internal virtual override {
        delete _defaultRoyaltyInfo;
    }

    function _setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 royaltyNumerator,
        address currency
    ) internal virtual {
        require(
            (royaltyNumerator <= _feeDenominator()),
            'ERC2981: royalty fee will exceed salePrice'
        );
        require(receiver != address(0), 'ERC2981: Invalid parameters');

        _tokenRoyaltyInfo[tokenId] = RoyaltyInformation(
            receiver,
            royaltyNumerator,
            currency
        );
    }

    function _resetTokenRoyalty(uint256 tokenId) internal virtual override {
        delete _tokenRoyaltyInfo[tokenId];
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Payment} from './Structs.sol';
import {IExchangeLike} from './interfaces/IExchangeLike.sol';
import {Exchange} from './Exchange.sol';
import {ERC165, IERC165} from '../lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol';
import {ISimpleReceiver} from './interfaces/ISimpleReceiver.sol';
import {ERC20} from '../lib/solmate/src/tokens/ERC20.sol';

contract Router is IExchangeLike {
    address exchange;

    constructor(address _exchange) {
        exchange = _exchange;
    }

    function list(
        address seller,
        address nft,
        uint256 id,
        uint96 amount
    ) external {
        Exchange(exchange).list(seller, nft, id, amount);
    }

    function buy(
        address nft,
        uint256 id,
        address receiver,
        bool respect
    ) external payable {
        Exchange(exchange).buy(nft, id, receiver);

        address currency = ISimpleReceiver(nft).royaltyCurrencyInfo(id);
        if (IERC165(nft).supportsInterface(type(ISimpleReceiver).interfaceId)) {
            (uint96 amount, ) = Exchange(exchange).listings(nft, id);
            if (respect) {
                (address royaltyTo, uint256 royaltyAmount) = ISimpleReceiver(
                    nft
                ).royaltyInfo(id, amount);

                if (currency == address(0)) {
                    ISimpleReceiver(nft).onRoyaltyReceived{
                        value: royaltyAmount
                    }(id, msg.sender, currency, '');
                } else {
                    ERC20(currency).transferFrom(
                        msg.sender,
                        royaltyTo,
                        royaltyAmount
                    );
                    ISimpleReceiver(nft).onRoyaltyReceived(
                        id,
                        msg.sender,
                        currency,
                        ''
                    );
                }
            } else {
                ISimpleReceiver(nft).onRoyaltyReceived(
                    id,
                    msg.sender,
                    currency,
                    ''
                );
            }
        }
    }
}

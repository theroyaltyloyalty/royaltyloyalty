// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Payment} from '../Structs.sol';

interface IExchangeLike {
    function list(
        address seller,
        address nft,
        uint256 id,
        uint96 amount
    ) external;

    function buy(
        address nft,
        uint256 id,
        address receiver,
        bool respect
    ) external payable;
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Payment} from "./Structs.sol";

interface ExchangeLike {
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
        Payment[] calldata additionalPayments
    ) external;
}

contract Router {
    address exchange;

    constructor(address _exchange) {
        exchange = _exchange;
    }
}

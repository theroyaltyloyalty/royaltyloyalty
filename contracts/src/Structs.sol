// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

struct Payment {
    uint96 amount;
    address payable to;
}

struct Listing {
    uint16 amount;
    uint80 pricePerToken;
    address payable seller;
}

struct Order {
    uint128 index;
    uint128 nonce;
    address nft;
    uint96 id;
    address payable seller;
    uint96 price;
    Payment[] additionalPayments;
}

struct Purchase {
    // order info
    Order order;
    // order merkle root and its index in the merkle root
    bytes32 orderRoot;
    // merkle proof order exists in the merkle root
    bytes32[] proof;
    // sigs for the merkle root
    uint8 v;
    bytes32 r;
    bytes32 s;
}

struct SinglePurchase {
    // order info
    Order order;
    // sigs for the order
    uint8 v;
    bytes32 r;
    bytes32 s;
}


// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import './TransferConstants.sol';
import './TransferHelper.sol';
import './Structs.sol';
import './Errors.sol';

import {IERC721} from 'forge-std/interfaces/IERC721.sol';

contract Exchange is TransferHelper {
    event List(
        address indexed seller,
        address indexed nft,
        uint256 id,
        uint96 price
    );
    event Delist(address indexed seller, address indexed nft, uint256 id);
    event Sale(
        address indexed nft,
        address indexed buyer,
        address indexed seller,
        uint256 id,
        uint256 price
    );

    mapping(address => mapping(uint256 => Payment)) public listings;

    /// @notice List an NFT for sale
    /// @param nft The address of the NFT contract
    /// @param id The ID of the NFT
    /// @param amount The price of the sale
    function list(
        address seller,
        address nft,
        uint256 id,
        uint96 amount
    ) public {
        if (IERC721(nft).ownerOf(id) != seller)
            revert NotNFTOwner(seller, nft, id);
        listings[nft][id] = Payment(amount, payable(seller));
        emit List(seller, nft, id, amount);
    }

    /// @notice Delist an NFT for sale
    /// @param nft The address of the NFT contract
    /// @param id The ID of the NFT
    function delist(address nft, uint256 id) public {
        if (IERC721(nft).ownerOf(id) != msg.sender)
            revert NotNFTOwner(msg.sender, nft, id);
        delete listings[nft][id];
        emit Delist(msg.sender, nft, id);
    }

    /// @notice Buy an NFT
    /// @param nft The address of the NFT contract
    /// @param id The ID of the NFT
    /// @param receiver The address that will receive the NFT
    function buy(
        address nft,
        uint256 id,
        address receiver,
        Payment[] calldata additionalPayments
    ) public payable {
        _buy(nft, id, receiver, additionalPayments);
    }

    function _buy(
        address nft,
        uint256 id,
        address receiver,
        Payment[] calldata additionalPayments
    ) internal {
        Payment memory payment = listings[nft][id];
        // try to send the NFT to the buyer
        // fail silently on NFT failed transfer and just delete the listing
        if (_performERC721Transfer(nft, payment.to, receiver, id)) {
            // send ETH to the seller if the transfer did not fail
            // revert if ETH transfer fails
            _transferEthAndFinalize(
                payment.amount,
                payment.to,
                additionalPayments
            );
            emit Sale(payment.to, msg.sender, nft, id, payment.amount);
        }
        delete listings[nft][id];
    }

    function _refund() internal {
        if (address(this).balance > 0) {
            _transferEth(payable(msg.sender), address(this).balance);
        }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {IERC2981} from '../../lib/openzeppelin-contracts/contracts/interfaces/IERC2981.sol';

interface ISimpleReceiver is IERC2981 {
    event RoyaltyStatus(
        address indexed operator,
        address indexed royaltyPayer,
        uint256 royaltyAmount
    );

    function onRoyaltyReceived(
        uint256 _tokenId,
        address _royaltyPayer,
        bytes calldata _data
    ) external payable returns (bytes4);
}

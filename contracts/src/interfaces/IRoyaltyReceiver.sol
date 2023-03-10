// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {IERC2981} from '../../lib/openzeppelin-contracts/contracts/interfaces/IERC2981.sol';

interface IRoyaltyReceiver is IERC2981 {
    event RoyaltyPayment(
        address indexed operator,
        address indexed royaltyPayer,
        uint256 expectedAmount,
        uint256 actualAmount,
        bool royaltyRespected
    );

    function onRoyaltyReceived(
        uint256 _tokenId,
        uint256 _salePrice,
        address _royaltyPayer,
        bytes calldata _data
    ) external payable returns (bytes4);
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {IERC2981} from '../../lib/openzeppelin-contracts/contracts/interfaces/IERC2981.sol';

interface ISimpleReceiver is IERC2981 {
    event RoyaltyPayment(
        address indexed operator,
        address indexed payer,
        address indexed currency,
        uint256 amount
    );

    function onRoyaltyReceived(
        uint256 _tokenId,
        address _payer,
        address _currency,
        bytes calldata _data
    ) external payable returns (bytes4);

    function royaltyCurrencyInfo(uint256 _tokenId)
        external
        view
        returns (address);
}

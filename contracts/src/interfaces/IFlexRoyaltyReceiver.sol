// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {ERC165, IERC165} from "../../lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

interface IFlexRoyaltyReceiver is IERC165 {

    event RoyaltyStatus(
        address indexed operator, 
        address indexed royaltyPayer,
        address currency,
        uint256 expectedAmount,
        uint256 actualAmount,
        bool royaltyRespected
    );

    function onRoyaltyReceived(
        uint256 _tokenId,
        uint256 _salePrice,
        address _royaltyPayer,
        bool _isSeller,        
        bytes calldata _data
    ) external payable returns (bytes4);

}
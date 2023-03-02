// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {ERC1155} from "../../lib/solmate/src/tokens/ERC1155.sol";
import {AdvancedRoyaltyReceiver} from "../receivers/AdvancedRoyaltyReceiver.sol";
import {LibString} from "../../lib/solmate/src/utils/LibString.sol";

contract MockERC1155AdvancedRoyaltyReceiver is ERC1155, AdvancedRoyaltyReceiver {

    string baseURI;

    constructor(
        string memory _baseURI,
        uint48 _buyerNumerator,
        uint48 _sellerNumerator
    ) {
        baseURI = _baseURI;
        _setDefaultRoyalty(msg.sender, _buyerNumerator, _sellerNumerator);
    }

    function mint(uint256 _id, uint256 _amount) external {
        _mint(msg.sender, _id, _amount, "");
    }

    function uri(uint256 id) public view override returns (string memory){
        return string.concat(baseURI, LibString.toString(id));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AdvancedRoyaltyReceiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}
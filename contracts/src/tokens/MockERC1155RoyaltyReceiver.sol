// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {ERC1155} from "../../lib/solmate/src/tokens/ERC1155.sol";
import {RoyaltyReceiver} from "../receivers/RoyaltyReceiver.sol";
import {LibString} from "../../lib/solmate/src/utils/LibString.sol";

contract MockERC1155RoyaltyReceiver is ERC1155, RoyaltyReceiver {

    string baseURI;

    constructor(
        string memory _baseURI,
        uint96 _feeNumerator
    ) {
        baseURI = _baseURI;
        _setDefaultRoyalty(msg.sender, _feeNumerator);
    }

    function mint(uint256 _id, uint256 _amount) external {
        _mint(msg.sender, _id, _amount, "");
    }

    function uri(uint256 id) public view override returns (string memory){
        return string.concat(baseURI, LibString.toString(id));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, RoyaltyReceiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}
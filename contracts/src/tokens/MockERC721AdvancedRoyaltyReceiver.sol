// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {ERC721} from "../../lib/solmate/src/tokens/ERC721.sol";
import {AdvancedRoyaltyReceiver} from "../receivers/AdvancedRoyaltyReceiver.sol";
import {LibString} from "../../lib/solmate/src/utils/LibString.sol";

contract MockERC721AdvancedRoyaltyReceiver is ERC721, AdvancedRoyaltyReceiver {

    string baseURI;
    uint256 nextId;

    constructor(
        string memory _baseURI,
        uint48 _buyerNumerator,
        uint48 _sellerNumerator
    ) ERC721("TEST", "TEST") {
        baseURI = _baseURI;
        _setDefaultRoyalty(msg.sender, _buyerNumerator, _sellerNumerator);
    }

    function mint() external {
        _mint(msg.sender, ++nextId);
    }

    function tokenURI(uint256 id) public view override returns (string memory){
        return string.concat(baseURI, LibString.toString(id));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AdvancedRoyaltyReceiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}
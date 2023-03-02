// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {ERC721} from "../../lib/solmate/src/tokens/ERC721.sol";
import {RoyaltyReceiver} from "../receivers/RoyaltyReceiver.sol";
import {LibString} from "../../lib/solmate/src/utils/LibString.sol";

contract MockERC721RoyaltyReceiver is ERC721, RoyaltyReceiver {

    string baseURI;
    uint256 nextId;

    constructor(
        string memory _baseURI,
        uint96 _feeNumerator
    ) ERC721("TEST", "TEST") {
        baseURI = _baseURI;
        _setDefaultRoyalty(msg.sender, _feeNumerator);
    }

    function mint() external {
        _mint(msg.sender, ++nextId);
    }

    function tokenURI(uint256 id) public view override returns (string memory){
        return string.concat(baseURI, LibString.toString(id));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, RoyaltyReceiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}
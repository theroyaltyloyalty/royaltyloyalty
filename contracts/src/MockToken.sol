// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC721} from "solmate/tokens/ERC721.sol";

contract MockToken is ERC721("", "") {
    function tokenURI(uint256) public pure override returns (string memory) {
        return "";
    }

    function mint(uint256 id) public {
        _mint(msg.sender,id);
    }
}

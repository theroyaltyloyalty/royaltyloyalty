// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from 'solmate/tokens/ERC20.sol';
import {ERC721} from 'solmate/tokens/ERC721.sol';
import {ERC1155} from 'solmate/tokens/ERC1155.sol';

contract MockERC20 is ERC20('', '', 18) {}

contract MockERC721 is ERC721('', '') {
    function tokenURI(uint256) public pure override returns (string memory) {
        return '';
    }

    function mint(uint256 id) public {
        _mint(msg.sender, id);
    }
}

contract MockERC1155 is ERC1155 {
    function uri(uint256) public pure override returns (string memory) {
        return '';
    }
}

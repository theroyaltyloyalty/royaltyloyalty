// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from 'solmate/tokens/ERC20.sol';
// import {ERC721} from 'solmate/tokens/ERC721.sol';
import {ERC721} from 'openzeppelin-contracts/contracts/token/ERC721/ERC721.sol';
import {Strings} from 'openzeppelin-contracts/contracts/utils/Strings.sol';
import {ERC1155} from 'solmate/tokens/ERC1155.sol';

contract MockERC20 is ERC20('', '', 18) {}

contract MockERC721 is ERC721('RLTY', 'LTY') {
    using Strings for uint256;
    string public baseURI;

    function tokenURI(uint256 id) public view override returns (string memory) {
        return
            string.concat(
                'https://qa-api.fractional.xyz/api/escher/',
                id.toString()
            );
    }

    function mint(uint256 id, address to) public {
        _mint(to, id);
    }
}

contract MockERC1155 is ERC1155 {
    function uri(uint256) public pure override returns (string memory) {
        return '';
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from 'solmate/tokens/ERC20.sol';
// import {ERC721} from 'solmate/tokens/ERC721.sol';
import {ERC721} from 'openzeppelin-contracts/contracts/token/ERC721/ERC721.sol';
import {Strings} from 'openzeppelin-contracts/contracts/utils/Strings.sol';
import {ERC1155} from 'solmate/tokens/ERC1155.sol';
import {SVGUtil} from '../../src/tokens/utils/SVGUtil.sol';

contract MockERC20 is ERC20('', '', 18) {}

contract MockERC721 is ERC721('RLTY', 'LTY'), SVGUtil {
    function tokenURI(uint256 id) public pure override returns (string memory) {
        return _uri(id, keccak256(abi.encodePacked(id)), 'R', 'L');
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

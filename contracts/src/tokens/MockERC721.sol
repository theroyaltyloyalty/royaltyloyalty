// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC721} from '../../lib/solmate/src/tokens/ERC721.sol';
import {SVGUtil} from './utils/SVGUtil.sol';

contract MockERC721 is ERC721('RLTY', 'LTY'), SVGUtil {
    address public owner = 0xF108412695bDe69025fdCC7DA7048f4fFa43BC59;

    function tokenURI(uint256 id) public pure override returns (string memory) {
        return _uri(id, keccak256(abi.encodePacked(id)), 'R', 'L');
    }

    function mint(uint256 id, address to) public {
        _mint(to, id);
    }
}

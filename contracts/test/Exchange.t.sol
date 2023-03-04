// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import 'forge-std/Test.sol';

import {IERC721} from 'forge-std/interfaces/IERC721.sol';
import {MockERC721} from 'test/mocks/MockTokens.sol';

import 'src/Exchange.sol';
import 'src/RoyaltyRouter.sol';

contract RoyaltyExchangeTest is Test {
    IERC721 nft;
    Exchange exchange;
    Router router;

    function setUp() public {
        setUpBalances();
        vm.deal(address(1), 100 ether);
        exchange = new Exchange();
        nft.setApprovalForAll(address(exchange), true);
        router = new Router(address(exchange));
    }

    function setUpBalances() public {
        vm.deal(address(this), 100 ether);
        nft = IERC721(address(new MockERC721()));

        for (uint256 x = 1; x <= 20; x++)
            MockERC721(address(nft)).mint(x, address(this));

        assertEq(nft.balanceOf(address(this)), 20);
    }

    function test_List() public {
        exchange.list(address(this), address(nft), 1, 1 ether);
    }

    function test_Buy() public {
        nft.setApprovalForAll(address(exchange), true);
        exchange.list(address(this), address(nft), 1, 1 ether);
        vm.prank(address(1));
        exchange.buy{value: 1 ether}(address(nft), 1, address(0xDEAD));
    }

    receive() external payable {}
}

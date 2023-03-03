// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

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
        payable(address(0)).transfer(100 ether);
        nft.setApprovalForAll(address(exchange), true);
        exchange = new Exchange();
        router = new Router(address(exchange));
    }

    function setUpBalances() public {
        vm.deal(address(this), 100 ether);
        nft = IERC721(address(new MockERC721()));

        for (uint256 x = 1; x <= 20; x++) MockERC721(address(nft)).mint(x);

        assertEq(nft.balanceOf(address(this)), 20);
    }

    function test_List() public {
        exchange.list(address(this), address(nft), 1, 1 ether);
    }

    function test_Buy() public {
        exchange.list(address(this), address(nft), 1, 1 ether);
        vm.prank(address(0));
        exchange.buy{value: 1 ether}(
            address(nft),
            1,
            address(0xDEAD),
            new Payment[](0)
        );
    }

    function test_BuyWithFee() public {
        exchange.list(address(this), address(nft), 1, 1 ether);
        vm.prank(address(0));
        Payment[] memory payment = new Payment[](1);
        payment[0] = Payment(0.1 ether, payable(address(0xBEEF)));
        exchange.buy{value: 1.1 ether}(
            address(nft),
            1,
            address(0xDEAD),
            payment
        );
    }

    function test_BuyWithFees() public {
        exchange.list(address(this), address(nft), 1, 1 ether);
        vm.prank(address(0));
        Payment[] memory payment = new Payment[](2);
        payment[0] = Payment(0.1 ether, payable(address(0xBEEF)));
        payment[1] = Payment(0.1 ether, payable(address(0xDEAD)));
        exchange.buy{value: 1.2 ether}(
            address(nft),
            1,
            address(0xDEAD),
            payment
        );
    }

    receive() external payable {}
}

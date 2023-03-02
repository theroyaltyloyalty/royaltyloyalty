// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Test.sol';
import 'src/receivers/RoyaltyReceiver.sol';
import {MockERC721, ERC721} from 'test/mocks/MockTokens.sol';

contract MockRoyaltyToken is MockERC721, RoyaltyReceiver {
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, RoyaltyReceiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

contract MockRouter {
    function mockRoyaltyPayment(
        address royaltyToken,
        uint256 id,
        uint256 price,
        address buyer
    ) public payable {
        IRoyaltyReceiver(royaltyToken).onRoyaltyReceived{value: msg.value}(
            id,
            price,
            buyer,
            ''
        );
    }
}

contract RoyaltyReceiverTest is Test {
    MockRoyaltyToken nft;
    MockRouter router;
    event RoyaltyStatus(
        address indexed operator,
        address indexed royaltyPayer,
        uint256 expectedAmount,
        uint256 actualAmount,
        bool royaltyRespected
    );

    function setUp() public {
        router = new MockRouter();
        nft = new MockRoyaltyToken();
        for (uint256 x = 1; x <= 20; x++) MockERC721(address(nft)).mint(x);
        vm.deal(address(this), 1 ether);
    }

    function testSendRoyalty() public {
        vm.expectEmit(true, true, true, true);
        emit RoyaltyStatus(address(router), address(this), 0, 0.1 ether, true);
        router.mockRoyaltyPayment{value: 0.1 ether}(
            address(nft),
            1,
            100 ether,
            address(this)
        );
        assertEq(address(nft).balance, 0.1 ether);
    }

    function testTrue() public {
        assertTrue(true);
    }

    receive() external payable {}
}

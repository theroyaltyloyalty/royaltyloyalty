// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Test.sol';
import 'src/receivers/SimpleReceiver.sol';
import {MockERC721, ERC721} from 'test/mocks/MockTokens.sol';

contract MockRoyaltyToken is MockERC721, RoyaltyReceiver {
    address seller = address(42);

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, RoyaltyReceiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mockTransferEmitter(address buyer, uint256 id) public {
        emit Transfer(seller, buyer, id);
    }
}

contract MockRouter {
    function mockRoyaltyPayment(
        address royaltyToken,
        uint256 id,
        uint256 price,
        address buyer
    ) public payable {
        RoyaltyReceiver(royaltyToken).onRoyaltyReceived{value: msg.value}(
            id,
            buyer,
            address(0),
            ''
        );
        MockRoyaltyToken(royaltyToken).transferFrom(msg.sender, buyer, id);
    }
}

contract RoyaltyReceiverTest is Test {
    MockRoyaltyToken nft;
    MockRouter router;
    event RoyaltyPayment(
        address indexed operator,
        address indexed payer,
        address indexed currency,
        uint256 id,
        uint256 amount
    );
    event Transfer(address indexed from, address indexed to, uint256 id);

    function setUp() public {
        router = new MockRouter();
        nft = new MockRoyaltyToken();
        for (uint256 x = 1; x <= 20; x++)
            MockERC721(address(nft)).mint(x, address(this));
        vm.deal(address(this), 1 ether);
        nft.setApprovalForAll(address(router), true);
    }

    function testSendRoyalty() public {
        vm.expectEmit(true, true, true, true);
        emit RoyaltyPayment(
            address(router),
            address(this),
            address(0),
            1,
            0.1 ether
        );
        emit Transfer(address(42), address(this), 1);
        router.mockRoyaltyPayment{value: 0.1 ether}(
            address(nft),
            1,
            100 ether,
            address(this)
        );
        assertEq(address(nft).balance, 0.1 ether);
    }

    receive() external payable {}
}

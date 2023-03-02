// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "forge-std/Test.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {ERC721} from "solmate/tokens/ERC721.sol";
import {ERC1155} from "solmate/tokens/ERC1155.sol";

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IERC721} from "forge-std/interfaces/IERC721.sol";
import {IERC1155} from "forge-std/interfaces/IERC1155.sol";

import "src/Exchange.sol";
import "src/RoyaltyRouter.sol";

contract MockERC20 is ERC20("", "", 18) {}

contract MockERC721 is ERC721("", "") {
    function tokenURI(uint256) public pure override returns (string memory) {
        return "";
    }

    function mint(uint256 id) public {
        _mint(msg.sender, id);
    }
}

contract MockERC1155 is ERC1155 {
    function uri(uint256) public pure override returns (string memory) {
        return "";
    }
}

contract RoyaltyExchangeTest is Test {
    IERC20 paymentToken;
    IERC721 nft;
    IERC1155 edition;
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
        edition = IERC1155(address(new MockERC1155()));
        paymentToken = IERC20(address(new MockERC20()));

        for (uint256 x = 1; x <= 20; x++) MockERC721(address(nft)).mint(x);
        dealERC1155(address(edition), address(this), 0, 100);
        deal(address(paymentToken), address(this), 100 ether);

        assertEq(nft.balanceOf(address(this)), 20);
        assertEq(edition.balanceOf(address(this), 0), 100);
        assertEq(paymentToken.balanceOf(address(this)), 100 ether);
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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import 'forge-std/Script.sol';
import 'test/RoyaltyReceiver.t.sol';
import 'openzeppelin-contracts/contracts/utils/Strings.sol';

contract DeployScript is Script {
    MockRoyaltyToken token;
    MockRouter router;

    function setUp() public {
        this;
    }

    function deployTestnet() public {
        router = new MockRouter();
        token = new MockRoyaltyToken();
    }

    function run() public virtual {
        vm.startBroadcast();
        deployTestnet();

        for (uint256 i; i < 20; i++) token.mint(i, address(msg.sender));

        token.setApprovalForAll(address(router), true);

        uint256 value;
        for (uint256 i; i < 20; i++) {
            value = i % 2 == 0 ? 0.05 ether : 0;
            router.mockRoyaltyPayment{value: value}(
                address(token),
                i,
                value,
                makeAddr(Strings.toString(i))
            );
        }

        vm.stopBroadcast();
    }
}

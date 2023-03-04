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

        for (uint256 i; i < 20; i++)
            router.mockRoyaltyPayment(
                address(token),
                i,
                0.05 ether,
                makeAddr(Strings.toString(i))
            );

        vm.stopBroadcast();
    }
}

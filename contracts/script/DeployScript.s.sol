// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import 'forge-std/Script.sol';
import 'test/RoyaltyReceiver.t.sol';

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
        vm.stopBroadcast();
    }
}

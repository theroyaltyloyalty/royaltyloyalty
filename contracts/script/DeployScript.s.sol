// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import 'forge-std/Script.sol';

contract DeployScript is Script {
    function setUp() public {}

    function deployTestnet() public {}

    function run() public {
        vm.startBroadcast();
        deployTestnet();
        vm.stopBroadcast();
    }
}

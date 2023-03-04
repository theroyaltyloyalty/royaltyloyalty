// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Script.sol';
import {CREATE3Factory} from '../lib/create3-factory/src/CREATE3Factory.sol';

contract FactoryDeploy is Script {
    function run() public returns (CREATE3Factory factory) {
        uint256 deployerPrivateKey = 0xbe4226c5bb313a56473ebcbe0a6a3b9b0ca1933089aeaa67dca88d9c04e480e0;

        vm.startBroadcast(deployerPrivateKey);

        factory = new CREATE3Factory();

        vm.stopBroadcast();
    }
}

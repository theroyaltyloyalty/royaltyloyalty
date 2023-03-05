// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Script.sol';
import {ICREATE3Factory} from '../lib/create3-factory/src/ICREATE3Factory.sol';

contract C3Deploy is Script {
    ICREATE3Factory factory =
        ICREATE3Factory(0x7f7f488AA05d5cbf7866Df916705DB67fD0138Fd); //address of factory

    bytes32 salt = keccak256(abi.encodePacked('SALT')); //add salt

    bytes creationCode = hex''; //deployment code from dry run

    function run() public {
        uint256 deployerPrivateKey = 0xbe4226c5bb313a56473ebcbe0a6a3b9b0ca1933089aeaa67dca88d9c04e480e0;

        vm.startBroadcast(deployerPrivateKey);

        factory.deploy(salt, creationCode);

        vm.stopBroadcast();
    }
}

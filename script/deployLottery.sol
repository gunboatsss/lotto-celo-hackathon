//SPDX-Liscense-Identifier: MIT
pragma solidity 0.8.29;

import "forge-std/Script.sol";
import {Lottery} from "../contracts/Lottery.sol";

address constant USDC_ON_CELO_TESTNET = 0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B;

contract DeployLotteryScript is Script {
    function run() external {
        vm.startBroadcast();
        Lottery lottery = new Lottery(USDC_ON_CELO_TESTNET, 1e6, 7 days, 30 days, 100);
        console.log("Lottery deployed at:", address(lottery));
        vm.stopBroadcast();
    }
}

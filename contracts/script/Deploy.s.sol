// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/PixelCanvas.sol";

contract DeployScript is Script {
    // USDm (cUSD) — same address on Celo Sepolia and Mainnet
    address constant USDM = 0x765DE816845861e75A25fCA122bb6898B8B1282a;

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);

        PixelCanvas canvas = new PixelCanvas(USDM);
        console.log("PixelCanvas deployed at:", address(canvas));
        console.log("USDm token:             ", USDM);
        console.log("Owner:                  ", vm.addr(deployerKey));

        vm.stopBroadcast();
    }
}

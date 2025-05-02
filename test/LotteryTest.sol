// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.29;
import "forge-std/Test.sol";

import {Lottery} from "../contracts/Lottery.sol";
import {ERC20} from "solady/tokens/ERC20.sol";

contract FakeUSDC is ERC20 {
    constructor() {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function name() public pure override returns (string memory) {
        return "Fake USDC";
    }
    function symbol() public pure override returns (string memory) {
        return "FUSDC";
    }
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract LotteryTest is Test {
    Lottery lottery;
    FakeUSDC usdc;

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        skip(1 days);
        usdc = new FakeUSDC();
        lottery = new Lottery(
            address(usdc),
            1e6,
            7 days,
            30 days,
            100
        );
    }

    function testInitialValues() public {
        assertEq(lottery.currentLotteryEpoch(), 0);
        assertEq(lottery.lotteryEpochStart(), block.timestamp / 7 days + 1);
        assertEq(lottery.currentRebateEpoch(), 0);
        assertEq(lottery.rebateEpochStart(), block.timestamp / 30 days + 1);
    }

    function testPurchaseTicket() public {
        usdc.approve(address(lottery), 1e6);
        lottery.purchaseTicket(1);
        assertEq(lottery.getTicketCount(0, address(this)), 1);
        assertEq(lottery.getTotalTickets(0), 1);
    }

    function testCompleteRound() public {
        deal(address(usdc), alice, 10e6);
        deal(address(usdc), bob, 10e6);
        vm.startPrank(alice);
        usdc.approve(address(lottery), 10e6);
        lottery.purchaseTicket(10);
        vm.stopPrank();
        vm.startPrank(bob);
        usdc.approve(address(lottery), 10e6);
        lottery.purchaseTicket(5);
        vm.stopPrank();
        skip(6 days + 1 seconds);
        lottery.closeEpochAndStartRNG();
        lottery.finishRNG();
        skip(30 days);
        vm.prank(alice);
        lottery.claimRebate(0);
        vm.prank(bob);
        lottery.claimRebate(0);
    }
}
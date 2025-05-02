//SPDX-Liscense-Identifier: MIT
pragma solidity 0.8.29;

import {EnumerableMapLib} from "solady/utils/EnumerableMapLib.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";



contract Lottery {
    using SafeTransferLib for address;
    using EnumerableMapLib for EnumerableMapLib.AddressToUint256Map;
    // Lottery Ticket Storage
    mapping(uint256 currentLotteryEpoch => EnumerableMapLib.AddressToUint256Map) private _lotteryTickets;
    mapping(uint256 currentLotteryEpoch => uint256 totalTickets) private _totalTickets;
    mapping(uint256 currentLotteryEpoch => uint256 rewards) private _rewards;
    mapping(uint256 currentLotteryEpoch => uint256 rng) private _rng;
    uint256 public currentLotteryEpoch;
    uint256 public lotteryEpochStart;
    // Lottery Rebate Storage
    mapping(uint256 currentRebateEpoch => mapping(address user => uint256 rebate)) private _rebate;
    uint256 public currentRebateEpoch;
    uint256 public rebateEpochStart;
    // Configuration
    address immutable public token;
    uint256 immutable public ticketPrice;
    uint256 immutable public epochDuration;
    uint256 immutable public rebateEpochDuration;
    uint256 immutable public bpsRebate;
    // Event
    event LotteryTicketPurchased(address indexed user, uint256 indexed epoch, uint256 ticketCount);
    event RebateClaimed(address indexed user, uint256 rebate);
    event LotteryEpochUpdated(uint256 indexed epoch);
    event RebateEpochUpdated(uint256 indexed epoch);

    constructor(
        address token_,
        uint256 ticketPrice_,
        uint256 epochDuration_,
        uint256 rebateEpochDuration_,
        uint256 bpsRebate_
    ) {
        require(token_ != address(0), "token_ cannot be zero address");
        require(ticketPrice_ > 0, "ticketPrice_ must be > 0");
        require(epochDuration_ > 0, "epochDuration_ must be > 0");
        require(rebateEpochDuration_ > 0, "rebateEpochDuration_ must be > 0");
        token = token_;
        ticketPrice = ticketPrice_;
        epochDuration = epochDuration_;
        rebateEpochDuration = rebateEpochDuration_;
        require(bpsRebate_ < 10000, "bpsRebate must be <= 10000");
        bpsRebate = bpsRebate_;
        lotteryEpochStart = (block.timestamp / epochDuration) * epochDuration + 1;
        rebateEpochStart = (block.timestamp / rebateEpochDuration) * rebateEpochDuration + 1;
    }

    function getTicketCount(uint256 epoch, address user) external view returns (uint256) {
        return _lotteryTickets[epoch].get(user);
    }
    function getTotalTickets(uint256 epoch) external view returns (uint256) {
        return _totalTickets[epoch];
    }
    function getRebate(uint256 epoch, address user) external view returns (uint256) {
        return _rebate[epoch][user];
    }
    function getRewards(uint256 epoch) external view returns (uint256) {
        return _rewards[epoch];
    }
    function claimRebate(uint256 epoch_) external {
        _updateRebateEpochIfNeeded();
        require(epoch_ < currentRebateEpoch, "rebate epoch not ended");
        uint256 rebate = _rebate[epoch_][msg.sender];
        require(rebate > 0, "no rebate available");
        _rebate[epoch_][msg.sender] = 0;
        token.safeTransfer(msg.sender, rebate);
        emit RebateClaimed(msg.sender, rebate);
    }

    function purchaseTicket(uint256 ticketCount) external {
        _updateRebateEpochIfNeeded();
        require(ticketCount > 0, "ticketCount must be > 0");
        require(block.timestamp < lotteryEpochStart + epochDuration, "lottery epoch has ended");
        uint256 totalCost = ticketPrice * ticketCount;
        token.safeTransferFrom(msg.sender, address(this), totalCost);
        if (!_lotteryTickets[currentLotteryEpoch].contains(msg.sender)) {
            _lotteryTickets[currentLotteryEpoch].set(msg.sender, ticketCount);
        } else {
            uint256 existingTicketCount = _lotteryTickets[currentLotteryEpoch].get(msg.sender);
            _lotteryTickets[currentLotteryEpoch].set(msg.sender, existingTicketCount + ticketCount);
        }
        _totalTickets[currentLotteryEpoch] += ticketCount;
        _rebate[currentRebateEpoch][msg.sender] += (totalCost * bpsRebate) / 10000;
        _rewards[currentLotteryEpoch] += (totalCost * (10000 - bpsRebate)) / 10000;
        emit LotteryTicketPurchased(msg.sender, currentLotteryEpoch, ticketCount);
    }

    function closeEpochAndStartRNG() external payable {
        require(block.timestamp >= lotteryEpochStart + epochDuration, "lottery epoch not ended");
        require(_rng[currentLotteryEpoch] == 0, "RNG already started");
        // FIXME: Use secure RNG
        _rng[currentLotteryEpoch] = uint256(keccak256(abi.encodePacked(block.timestamp, block.number, block.prevrandao)));
    }

    function finishRNG() external {
        require(_rng[currentLotteryEpoch] != 0, "RNG not started");
        uint256 rng = _rng[currentLotteryEpoch];
        uint256 winningTicket = rng % _totalTickets[currentLotteryEpoch];
        address winner;
        uint256 ticketCount;
        for (uint256 i = 0; i < _lotteryTickets[currentLotteryEpoch].length(); i++) {
            (address user, uint256 count) = _lotteryTickets[currentLotteryEpoch].at(i);
            if (winningTicket < count) {
                winner = user;
                ticketCount = count;
                break;
            }
            winningTicket -= count;
        }
        token.safeTransfer(winner, _rewards[currentLotteryEpoch]);
        currentLotteryEpoch++;
        emit LotteryEpochUpdated(currentLotteryEpoch);
        lotteryEpochStart = (block.timestamp / epochDuration) * epochDuration + 1;
    }

    function _updateRebateEpochIfNeeded() internal {
        if (block.timestamp >= rebateEpochStart + rebateEpochDuration) {
            currentRebateEpoch++;
            rebateEpochStart = (block.timestamp / rebateEpochDuration) * rebateEpochDuration + 1;
            emit RebateEpochUpdated(currentRebateEpoch);
        }
    }
}
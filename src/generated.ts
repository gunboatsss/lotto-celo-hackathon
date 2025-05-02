import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lottery
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lotteryAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'token_', internalType: 'address', type: 'address' },
      { name: 'ticketPrice_', internalType: 'uint256', type: 'uint256' },
      { name: 'epochDuration_', internalType: 'uint256', type: 'uint256' },
      {
        name: 'rebateEpochDuration_',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'bpsRebate_', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'bpsRebate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'epoch_', internalType: 'uint256', type: 'uint256' }],
    name: 'claimRebate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'closeEpochAndStartRNG',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentLotteryEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentRebateEpoch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'epochDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finishRNG',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'epoch', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getRebate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'epoch', internalType: 'uint256', type: 'uint256' }],
    name: 'getRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'epoch', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getTicketCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'epoch', internalType: 'uint256', type: 'uint256' }],
    name: 'getTotalTickets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lotteryEpochStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'ticketCount', internalType: 'uint256', type: 'uint256' }],
    name: 'purchaseTicket',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rebateEpochDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rebateEpochStart',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ticketPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'epoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'LotteryEpochUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'epoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'ticketCount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'LotteryTicketPurchased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'rebate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RebateClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'epoch',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'RebateEpochUpdated',
  },
  { type: 'error', inputs: [], name: 'IndexOutOfBounds' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__
 */
export const useReadLottery = /*#__PURE__*/ createUseReadContract({
  abi: lotteryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"bpsRebate"`
 */
export const useReadLotteryBpsRebate = /*#__PURE__*/ createUseReadContract({
  abi: lotteryAbi,
  functionName: 'bpsRebate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"currentLotteryEpoch"`
 */
export const useReadLotteryCurrentLotteryEpoch =
  /*#__PURE__*/ createUseReadContract({
    abi: lotteryAbi,
    functionName: 'currentLotteryEpoch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"currentRebateEpoch"`
 */
export const useReadLotteryCurrentRebateEpoch =
  /*#__PURE__*/ createUseReadContract({
    abi: lotteryAbi,
    functionName: 'currentRebateEpoch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"epochDuration"`
 */
export const useReadLotteryEpochDuration = /*#__PURE__*/ createUseReadContract({
  abi: lotteryAbi,
  functionName: 'epochDuration',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"getRebate"`
 */
export const useReadLotteryGetRebate = /*#__PURE__*/ createUseReadContract({
  abi: lotteryAbi,
  functionName: 'getRebate',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"getRewards"`
 */
export const useReadLotteryGetRewards = /*#__PURE__*/ createUseReadContract({
  abi: lotteryAbi,
  functionName: 'getRewards',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"getTicketCount"`
 */
export const useReadLotteryGetTicketCount = /*#__PURE__*/ createUseReadContract(
  { abi: lotteryAbi, functionName: 'getTicketCount' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"getTotalTickets"`
 */
export const useReadLotteryGetTotalTickets =
  /*#__PURE__*/ createUseReadContract({
    abi: lotteryAbi,
    functionName: 'getTotalTickets',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"lotteryEpochStart"`
 */
export const useReadLotteryLotteryEpochStart =
  /*#__PURE__*/ createUseReadContract({
    abi: lotteryAbi,
    functionName: 'lotteryEpochStart',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"rebateEpochDuration"`
 */
export const useReadLotteryRebateEpochDuration =
  /*#__PURE__*/ createUseReadContract({
    abi: lotteryAbi,
    functionName: 'rebateEpochDuration',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"rebateEpochStart"`
 */
export const useReadLotteryRebateEpochStart =
  /*#__PURE__*/ createUseReadContract({
    abi: lotteryAbi,
    functionName: 'rebateEpochStart',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"ticketPrice"`
 */
export const useReadLotteryTicketPrice = /*#__PURE__*/ createUseReadContract({
  abi: lotteryAbi,
  functionName: 'ticketPrice',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"token"`
 */
export const useReadLotteryToken = /*#__PURE__*/ createUseReadContract({
  abi: lotteryAbi,
  functionName: 'token',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lotteryAbi}__
 */
export const useWriteLottery = /*#__PURE__*/ createUseWriteContract({
  abi: lotteryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"claimRebate"`
 */
export const useWriteLotteryClaimRebate = /*#__PURE__*/ createUseWriteContract({
  abi: lotteryAbi,
  functionName: 'claimRebate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"closeEpochAndStartRNG"`
 */
export const useWriteLotteryCloseEpochAndStartRng =
  /*#__PURE__*/ createUseWriteContract({
    abi: lotteryAbi,
    functionName: 'closeEpochAndStartRNG',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"finishRNG"`
 */
export const useWriteLotteryFinishRng = /*#__PURE__*/ createUseWriteContract({
  abi: lotteryAbi,
  functionName: 'finishRNG',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"purchaseTicket"`
 */
export const useWriteLotteryPurchaseTicket =
  /*#__PURE__*/ createUseWriteContract({
    abi: lotteryAbi,
    functionName: 'purchaseTicket',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lotteryAbi}__
 */
export const useSimulateLottery = /*#__PURE__*/ createUseSimulateContract({
  abi: lotteryAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"claimRebate"`
 */
export const useSimulateLotteryClaimRebate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lotteryAbi,
    functionName: 'claimRebate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"closeEpochAndStartRNG"`
 */
export const useSimulateLotteryCloseEpochAndStartRng =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lotteryAbi,
    functionName: 'closeEpochAndStartRNG',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"finishRNG"`
 */
export const useSimulateLotteryFinishRng =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lotteryAbi,
    functionName: 'finishRNG',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link lotteryAbi}__ and `functionName` set to `"purchaseTicket"`
 */
export const useSimulateLotteryPurchaseTicket =
  /*#__PURE__*/ createUseSimulateContract({
    abi: lotteryAbi,
    functionName: 'purchaseTicket',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lotteryAbi}__
 */
export const useWatchLotteryEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: lotteryAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lotteryAbi}__ and `eventName` set to `"LotteryEpochUpdated"`
 */
export const useWatchLotteryLotteryEpochUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lotteryAbi,
    eventName: 'LotteryEpochUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lotteryAbi}__ and `eventName` set to `"LotteryTicketPurchased"`
 */
export const useWatchLotteryLotteryTicketPurchasedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lotteryAbi,
    eventName: 'LotteryTicketPurchased',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lotteryAbi}__ and `eventName` set to `"RebateClaimed"`
 */
export const useWatchLotteryRebateClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lotteryAbi,
    eventName: 'RebateClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link lotteryAbi}__ and `eventName` set to `"RebateEpochUpdated"`
 */
export const useWatchLotteryRebateEpochUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: lotteryAbi,
    eventName: 'RebateEpochUpdated',
  })

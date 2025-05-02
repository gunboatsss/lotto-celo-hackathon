import { erc20Abi, formatUnits, parseUnits } from 'viem';
import { LOTTERY_ADDRESS, USDC_ADDRESS } from './constants';
import { lotteryAbi, useReadLotteryCurrentLotteryEpoch, useReadLotteryCurrentRebateEpoch, useReadLotteryEpochDuration, useReadLotteryGetRebate, useReadLotteryGetRewards, useReadLotteryGetTicketCount, useReadLotteryLotteryEpochStart, useWriteLotteryCloseEpochAndStartRng, useWriteLotteryFinishRng, useWriteLotteryPurchaseTicket } from './generated';
import { useAccount, useClient, useWriteContract } from 'wagmi';
import { useState, useEffect } from 'react';
import { readContract } from 'viem/actions';
function MainPanel() {
    const account = useAccount();
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds % 3600 / 60);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${days}:${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

const { data: currentLotteryEpoch, isLoading: loading2, isSuccess: success2 } = useReadLotteryCurrentLotteryEpoch({
    address: LOTTERY_ADDRESS
});

const { data: ticketBought, isLoading, isSuccess, isError } = useReadLotteryGetTicketCount({
    address: LOTTERY_ADDRESS,
    args: [currentLotteryEpoch!, account.address!],
    query: {
        enabled: !!account.address
    }
})

const { data: currentReward, isLoading: isLoadingReward, isSuccess: successReward } = useReadLotteryGetRewards({
    address: LOTTERY_ADDRESS,
    args: [currentLotteryEpoch!],
    query: {
        enabled: !!currentLotteryEpoch
    }
});

const { data: epochStartTime, isSuccess: success3 } = useReadLotteryLotteryEpochStart({
    address: LOTTERY_ADDRESS,
});

const { data: epochDuration, isSuccess: success4 } = useReadLotteryEpochDuration({
    address: LOTTERY_ADDRESS,
});

const { data: currentRebateEpoch } = useReadLotteryCurrentRebateEpoch({
    address: LOTTERY_ADDRESS
});

const { data: currentRebate, isSuccess: success_currentRebate } = useReadLotteryGetRebate({
    address: LOTTERY_ADDRESS,
    args: [currentRebateEpoch!, account.address!],
});

const { writeContract: closeEpoch } = useWriteLotteryCloseEpochAndStartRng({
});

const { writeContract: distributeReward } = useWriteLotteryFinishRng({});

const { writeContract } = useWriteContract();
const [ rebateReadyToClaim, setRebateReadyToClaim ] = useState<string>('0');
useEffect(() => {
    const calculateRebateReadyToClaim = async () => {
        if (currentRebateEpoch && currentRebateEpoch! > 0n) {
            const client = useClient();
            const res = await readContract(client, {
                address: LOTTERY_ADDRESS,
                abi: lotteryAbi,
                functionName: 'getRebate',
                args: [currentRebateEpoch! - 1n, account.address!]
            });
            setRebateReadyToClaim(formatUnits(res, 6));
        }
    }
    calculateRebateReadyToClaim();
}, [currentRebateEpoch!, account.address]);

const { writeContract: buyTicket, isError: buyError, error } = useWriteLotteryPurchaseTicket({});

useEffect(() => {
    const calculateTimeLeft = () => {
        const now = Date.now();
        const endTime = Number(epochStartTime! + epochDuration!) * 1000;
        const remaining = Math.max(0, endTime - now);
        setTimeLeft(remaining);
    };
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
}, [epochStartTime, epochDuration]);

console.log("Current Lottery Epoch: ", currentLotteryEpoch);
console.log("Ticket Bought: ", ticketBought);

return (
    <>
        {loading2 && <p>Loading...</p>}
        {success2 && <p>Current Lottery Epoch: {currentLotteryEpoch.toString()}</p>}
        {isLoadingReward && <p>Loading Reward...</p>}
        {successReward && <p>Current Reward: {formatUnits(currentReward, 6)}</p>}
        {success3 && <p>Epoch start time {epochStartTime.toString()}</p>}
        {success3 && success4 && <p>Epoch Start Time: {(new Date(Number(epochStartTime * 1000n))).toDateString()}</p>}
        {success3 && success4 && <p>Time Left: {formatTime(timeLeft)}</p>}
        <p>Ticket Bought: {(isLoading && "Loading")}{(isSuccess && ticketBought.toString())}{isError && '0'}</p>
        <label htmlFor='ticket'>Ticket Amount</label>
        <input type='number' id='ticket'></input>
        <button onClick={() => {
            let amountToApprove = parseUnits((document.getElementById('ticket') as HTMLInputElement)?.value, 0) * 1000000n;
            writeContract({
                address: USDC_ADDRESS,
                abi: erc20Abi,
                functionName: 'approve',
                args: [LOTTERY_ADDRESS, amountToApprove],
            })
        }}>Approve</button>
        <button onClick={() => {
            buyTicket({
                address: LOTTERY_ADDRESS,
                args: [parseUnits((document.getElementById('ticket') as HTMLInputElement)?.value, 0)],
            })
        }}>Buy Ticket</button>
        {(buyError && <p>{error?.message}</p>)}
        <button onClick={() => {
            closeEpoch({
                address: LOTTERY_ADDRESS
            })
        }}>Close Epoch</button>
        <button onClick={() => {
            distributeReward({
                address: LOTTERY_ADDRESS,
            })
        }}>Distribute Reward</button>
        {success_currentRebate && (<p>Current Rebate: {formatUnits(currentRebate, 6)}</p>)}
        {(!!currentRebateEpoch && currentRebateEpoch! > 0n) && (
            <p>Rebate ready to claim: {rebateReadyToClaim}</p>
        )}
        <button onClick={
            () => {
                writeContract({
                    address: LOTTERY_ADDRESS,
                    abi: lotteryAbi,
                    functionName: 'claimRebate',
                    args: [currentRebateEpoch! - 1n],
                })
            }
        }
        disabled={
            (!!currentRebateEpoch && currentRebateEpoch! > 0n)
        }>Claim Rebate</button>
    </>
)
}

export { MainPanel };
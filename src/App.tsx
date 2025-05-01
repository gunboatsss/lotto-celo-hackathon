import { useEffect } from 'react'
import { useConnect, injected, useWriteContract, useAccount } from 'wagmi'
import { AccountStatus } from './AccountStatus.tsx'
import { erc20Abi } from 'viem';

function App() {
  const account = useAccount();
  const { connect } = useConnect();
  const { writeContract } = useWriteContract();
  useEffect(() => {
    connect({ connector: injected() });
  }, []);

  function sendUSDC() {
    writeContract({
      abi: erc20Abi,
      address: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B",
      functionName: "transfer",
      args: [
        account.address!,
        1000000n
      ],
      // feeCurrency: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B",
      // type: 'cip64'
    })
  }

  return (
    <>
      <header style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline"
      }}>
        <h1 style={
          {
            boxSizing: 'content-box'
          }
        }>LottoUSD</h1>
        <AccountStatus></AccountStatus>
      </header>
      <button onClick={() => sendUSDC()}>send USDC</button>
      <p>{}</p>
    </>
  )
}

export default App

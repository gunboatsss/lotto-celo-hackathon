import { useEffect } from 'react'
import { useConnect, injected, useAccount } from 'wagmi'
import { AccountStatus } from './AccountStatus.tsx'
import { MainPanel } from './MainPanel';

function App() {
  const account = useAccount();
  const { connect } = useConnect();
  useEffect(() => {
    connect({ connector: injected() });
  }, []);

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
      {account.isConnected && (<MainPanel></MainPanel>)}
    </>
  )
}

export default App

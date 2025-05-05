import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { USDC_ADDRESS } from "./constants";

function AccountStatus() {
    const account = useAccount();
    const { data, isLoading, isError, isSuccess } = useBalance({
        address: account.address!,
        token: USDC_ADDRESS
    });
    return (<>
        <div style={{
            border: '1px solid white',
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            color: 'black',
            borderRadius: '5px',
        }}>
            <p>
                <span>{account.address?.substring(0, 10)} </span>
                {(
                    isLoading && (<span>Loading</span>)
                )}
                {(
                    isError && (<span>Error</span>)
                )}
                {(
                    isSuccess && (<span>{formatUnits(data.value, data.decimals)} {data.symbol}</span>)
                )}
            </p>
        </div>
    </>)
};

export { AccountStatus }
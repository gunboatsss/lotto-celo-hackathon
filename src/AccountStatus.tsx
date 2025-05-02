import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { USDC_ADDRESS } from "./constants";

function AccountStatus() {
    const account = useAccount();
    const { data, isLoading, isError, isSuccess } = useBalance({
        address: account.address!,
        token: USDC_ADDRESS
    }) ;
    return (<>
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
    </>)
};

export { AccountStatus }
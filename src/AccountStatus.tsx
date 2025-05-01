import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

function AccountStatus() {
    const account = useAccount();
    const { data, isLoading, isError, isSuccess } = useBalance({
        address: account.address!,
        token: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B"
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
import useSWR from "swr";
import type { L1Token } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";


function getIsTokenApproved(contract: L1Token, account: string, tunnelAddress: string) {
  return async (_: string) => {
    const approved = await contract.isApprovedForAll(account, tunnelAddress);

    return approved;
  };
}

export default function useIsTokenApproved(
  t1: L1Token,
  account: string,
  tunnelAddress: string,
  chainId:number,
  suspense = false
){

  const shouldFetch =
    typeof t1 !== null &&
    typeof tunnelAddress === "string";

  const result = useSWR(
    shouldFetch ? ["IsWizardVerified" + chainId] : null,
    getIsTokenApproved(t1, account, tunnelAddress),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}

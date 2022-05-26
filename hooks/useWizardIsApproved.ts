import useSWR from "swr";
import type { L1Token } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useWizardStorage from "./useWizardStorage";

function getIsWizardApproved(contract: L1Token) {
  return async (_: string, account: string,tunnel: string) => {
    const ret = await contract.isApprovedForAll(account, tunnel);

    return ret;
  };
}

export default function useIsWizardApproved(
  account: string,
  tunnel: string,
  contract: L1Token,
  suspense = false
){

  const shouldFetch =
    typeof account === "string" &&
    typeof tunnel === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["IsWizardApproved", account, contract] : null,
    getIsWizardApproved(contract),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}

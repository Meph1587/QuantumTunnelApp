import useSWR from "swr";
import type { WizardStorage } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useWizardStorage from "./useWizardStorage";

function getIsWizardVerifies(contract: WizardStorage) {
  return async (_: string, wizardId: number) => {
    const balance = await contract.hasTraitsStored(wizardId);

    return balance;
  };
}

export default function useIsWizardVerified(
  wizardId: string,
  storageAddress: string,
  suspense = false
){
  const contract = useWizardStorage(storageAddress);

  const shouldFetch =
    typeof wizardId === "string" &&
    typeof storageAddress === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["IsWizardVerified", wizardId, storageAddress] : null,
    getIsWizardVerifies(contract),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}

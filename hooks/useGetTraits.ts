import useSWR from "swr";
import type { WizardStoragePlugin } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";


function getUseTraits(storage: WizardStoragePlugin,  tokenId:number) {
  return async (_: string) => {
    const resp = await storage.getTokenTraits(tokenId);
    return resp
  };
}

export default function useGetTraits(
  storage: WizardStoragePlugin,
  tokenId: number,
  suspense = false
){

  const shouldFetch =
    typeof tokenId === "number" &&
    !!storage;

  const result = useSWR(
    shouldFetch ? ["useGetTraits",storage, tokenId] : null,
    getUseTraits(storage, tokenId),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
import useSWR from "swr";
import type { LostGrimoireStorage } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";


function getUseTokenHasStoredTraits(storage: LostGrimoireStorage, token: string, tokenId:number) {
  return async (_: string) => {
    const resp = await storage.hasData(token, tokenId);
    return resp
  };
}

export default function useTokenHasStoredTraits(
  storage: LostGrimoireStorage,
  token: string,
  tokenId: number,
  suspense = false
){

  const shouldFetch =
    typeof token === "string" &&
    typeof tokenId === "number" &&
    !!storage;

  const result = useSWR(
    shouldFetch ? ["UseTokenHasStoredTraits",storage, token, tokenId] : null,
    getUseTokenHasStoredTraits(storage, token, tokenId),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
import useSWR from "swr";
import { BaseQuest } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";


function getQuests(contract: BaseQuest) {
  return async (_: string) => {
    const quests: any = [];
      try {
        const total = (await contract.getNrQuests()).toNumber();
        for (let i=0; i<total; i++) {
            quests.push(await contract.getQuest(i) 
            )
        }
      } catch (err) {
        console.log("err: ", err);
      }
      return quests
  };
}

export default function useGetQuests(
  quests: BaseQuest,
  suspense = false
) {
  const shouldFetch =
    !!quests;

  const result = useSWR(
    shouldFetch ? ["useGetQuests", quests] : null,
    getQuests(quests),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}

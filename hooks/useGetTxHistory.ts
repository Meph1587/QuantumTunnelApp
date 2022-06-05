
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";

function getTxs(txs: string[]) {
  return async (_: string) => {
    console.log(txs)
    let data = [];
    
    for await (const tx of txs) {
      data.push(
        await (await fetch('https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-rinkeby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: `{
          originTransfers(where: {transactionHash: "${tx}"}) {
            status
            transferId
          }
        }
        `})
      })).json()
      )} 
    return data;
  };
}

export default function useGetTxHistory(txs: string[], suspense = false) {
  const {  chainId } = useWeb3React();

  const shouldFetch =  txs.length !=0 ;

  const result = useSWR(
    shouldFetch ? ["getTxs", txs, chainId] : null,
    getTxs(txs),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);
  return result;
}

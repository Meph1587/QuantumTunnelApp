
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";

function getTxs(account: string, t1:string, t2:string) {
  return async (_: string) => {

    let txs = (await (
        await fetch(`https://api-rinkeby.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${t1}&address=${account}&page=1&offset=100&startblock=0&endblock=9999999999999999&sort=desc&apikey=2ZMJ7KEB5C5I9RP6X5AF2D5ZXMEAVSGBMD`)
      ).json()).result


    txs.concat(
      (await (
        await fetch(`https://api-kovan.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${t2}&address=${account}&page=1&offset=100&startblock=0&endblock=9999999999999999&sort=desc&apikey=2ZMJ7KEB5C5I9RP6X5AF2D5ZXMEAVSGBMD`)
      ).json()).result
    )

    let filtered = txs.filter(p => p.from === "0xd2f7315f100f1367bdcc135d2a91b2be87f678cf" || p.to === "0xd2f7315f100f1367bdcc135d2a91b2be87f678cf")
    let hashes = filtered.map(f => f.hash)

    let originTxs = [];
    for await (const tx of hashes) {
      let rinkebyTx = 
        await (
          await fetch('https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-rinkeby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({query: `{
            originTransfers(where: {transactionHash: "${tx}"}) {
              status
              transferId
              timestamp
            }
          }
          `}) 
        })).json()


      let kovanTx = 
        await (
          await fetch('https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-kovan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({query: `{
            originTransfers(where: {transactionHash: "${tx}"}) {
              status
              transferId
              timestamp
            }
          }
          `}) 
        })).json()
      
        if(rinkebyTx.data.originTransfers.length > 0){
          originTxs.push({
            status: "Pending",
            transferId: rinkebyTx.data.originTransfers[0].transferId,
            origin: "Rinkeby",
            destination: "Kovan",
            sentAt: new Date(parseInt(rinkebyTx.data.originTransfers[0].timestamp) * 1000),
            executedAt: "",
          })
        }
        if(kovanTx.data.originTransfers.length > 0){
          originTxs.push({
            status: "Pending",
            transferId: kovanTx.data.originTransfers[0].transferId,
            origin: "Kovan",
            destination: "Rinkeby",
            sentAt:  new Date(parseInt(kovanTx.data.originTransfers[0].timestamp) * 1000),
            executedAt: "",
          })
        }
    } 

    let output = [];
    for await (const tx of originTxs) {
      let rinkebyTx = 
        await (
          await fetch('https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-rinkeby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({query: `{
            destinationTransfers(where: {transferId: "${tx.transferId}"}) {
              executedTimestamp
              status
            }
          }
          `}) 
        })).json()


      let kovanTx = 
        await (
          await fetch('https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-kovan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({query: `{
            destinationTransfers(where: {transferId: "${tx.transferId}"}) {
              executedTimestamp
              status
            }
          }
          `}) 
        })).json()




        if(rinkebyTx.data.destinationTransfers.length > 0 &&
             rinkebyTx.data.destinationTransfers[0].status === "CompletedSlow" &&
              tx.destination === "Rinkeby"){
          tx.status = "Completed"
          tx.executedAt = new Date(rinkebyTx.data.destinationTransfers[0].executedTimestamp * 1000)
          output.push(tx)
        }else if (tx.destination === "Rinkeby"){
          tx.executedAt = null
          output.push(tx)
        }


        if(kovanTx.data.destinationTransfers.length > 0 &&
             kovanTx.data.destinationTransfers[0].status === "CompletedSlow" &&
             tx.destination === "Kovan"){
          tx.status = "Completed"
          tx.executedAt = new Date(kovanTx.data.destinationTransfers[0].executedTimestamp * 1000)
          output.push(tx)
        }else if (tx.destination === "Kovan"){
          tx.executedAt = null
          output.push(tx)
        }
    } 
    return output;
  };
}

export default function useGetTxHistory(account: string, t1:string,t2:string, suspense = false) {
  const { chainId } = useWeb3React();

  const shouldFetch =  typeof account === "string" ;

  const result = useSWR(
    shouldFetch ? ["getTxs", t1,t2, account, chainId] : null,
    getTxs(account,t1,t2,),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);
  return result;
}

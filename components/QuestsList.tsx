import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {WizardList} from "./WizardGrid";
import type { WizardStoragePlugin } from "../contracts/types";
import useTokenHasStoredTraits from "../hooks/useTokenHasStoredTraits";
import useGetTraits from "../hooks/useGetTraits";
import useInput from "../hooks/useInput";
import useENSName from "../hooks/useENSName";
import {getProofForTraits, getProofForName} from "../utils/makeMerkleProof";
import { useEffect, useState, useCallback } from "react";
import useGetQuests from "../hooks/useGetQuest";
import { BigNumber } from "ethers";
import useGetTraitNames from "../hooks/useGetTraitNames";
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';
import { BaseProvider } from "@ethersproject/providers";


function formatDate(ts:BigNumber) {
  let p = (new Date(ts.toNumber()*1000))
  return p.getDate() + "-" + p.toLocaleString('default', { month: 'short' }) + "-" +  p.getFullYear() + " " + ('0'+(p.getHours())).slice(-2) + ":" +  ('0'+p.getMinutes()).slice(-2)
}


async function getTraitNames(plugin: WizardStoragePlugin, p: BaseProvider, traitIds: number[]) {
  const multicall = new Multicall({ ethersProvider: p, tryAggregate: true });

    const contractCallContext: ContractCallContext[] = [
      {
          reference: 'WizardStoragePlugin',
          contractAddress: plugin.address,
          abi: [ { name: 'getTraitName', type: 'function', stateMutability: "view",inputs: [ { name: 'traitId', type: 'uint256' } ], outputs: [ { name: 'name', type: 'string' }] } ],
          calls: []
      },
  ];
  traitIds.forEach(traitId => {
    contractCallContext[0].calls.push({ reference: 'c'+traitId, methodName: 'getTraitName', methodParameters: [traitId] })
  });
  const results: ContractCallResults = await multicall.call(contractCallContext);
  let names = results.results["WizardStoragePlugin"].callsReturnContext.map(r => {
    if(r.methodParameters[0] > 341){
      return "Aff:"+r.returnValues[0]
    }else{
      return r.returnValues[0]
    }
  })

  return names
}

 const QuestList = ( {l1Id, account, tokenId, bq, plugin, quest,setQuest, quests, setQuests }) => {

  let { provider} = useWeb3React()
  let p = provider as unknown as BaseProvider


  const run = useCallback(async () => {
    let quests: any = [];
    try {
      try {
        const total = (await bq.getNrQuests()).toNumber();
        console.log(total)
        for (let questId=0; questId<total; questId++) {
          let q = await bq.getQuest(questId)
          if (q.expiresAt.toNumber()*1000 < Date.now()){
            continue;
          }
          let list = await getTraitNames(plugin, p, q.traitIds)
          let traitNames = ""
          list.map((n, idx)=>{
            traitNames= traitNames + "" + idx + ": " + n + " "
          })
          let qn = {
            ...q,
            questId,
            traitNames
          }
          console.log(qn)
          quests.push(qn)
          
        }
      } catch (err) {
        console.log("err: ", err);
      }
    } catch (err) {
      console.log("err: ", err);
    }
    setQuests(quests);
  } ,[account,  bq])
  
  useEffect(() => {
    run();
  }, [run]);

  return ( 
    <div>
      <QuestGrid  quests={quests} quest={quest} setQuest={setQuest} />
     
    </div>
  )
}

const QuestGrid = ({  quests, quest, setQuest }) => {

  return(
    <div>
      Quests
      {
        quests.map((q) => (
          <button onClick={()=> setQuest(q.questId) }  style={{ "opacity":q.questId==quest? "100%": "60%"}}>
            <div key={q.questId} className=" grid grid-flow-col grid-cols-6 mt-8">
              <div className="text-left p-1 ml-5 w-28">
                <p className="text-gray-500">Quest Id:</p>
                {q.questId}
              </div>
              <div className="text-left p-1 ml-5 w-28">
                <p className="text-gray-500">Started:</p>
                {q.startedAt.toString() === "0" ? "Net Started": formatDate(q.startedAt)}
              </div>
              <div className="text-left p-1 ml-5 w-28">
                <p className="text-gray-500">Ends:</p>
                {q.startedAt.toString() === "0" ? "Net Started": formatDate(q.endsAt)}
              </div>
              <div className="text-left p-1 ml-5 w-36">
                <p className="text-gray-500">Created At:</p>
                {formatDate(q.createdAt)}
              </div>
              <div className="text-left p-1 ml-5 w-36">
                <p className="text-gray-500">Expires At:</p>
                {formatDate(q.expiresAt)}
              </div>
            </div>
            <div className="text-left p-1 ml-5 ">
                <p className="text-gray-500">Traits:</p>
                {q.traitNames}
              </div>
          </button>
        ))
      }
      
    </div>
  )
}


export const BaseQuestList = ({l1Id, token, tokenId, bq, setWizard, wizardTraits,t1,t2, plugin }) => {
 
  const { account, chainId } = useWeb3React();
  
  const [slot, setSlot] = useState([]);
  const [quests, setQuests] = useState([]);
  const [quest, setQuest] = useState(9999999);


  async function createQuest() {
    let tx = await bq.createQuest()
    await tx.wait()
  }
  async function acceptQuest() {
    console.log(quest, tokenId)
    let tx = await bq.acceptQuest(quest, tokenId, slot)
    await tx.wait()
  }
  async function completeQuest() {
    console.log(quest, tokenId)
    let tx = await bq.completeQuest(quest, tokenId, slot)
    await tx.wait()
  }



  return(
    <div>
      <div className="grid grid-flow-col grid-cols-2 mt-24 text-center">

        <div className="border-l-2 p-4 border-solid border-gray-500 "> 
          
          <div className=" max-h-[550px] p-8 overflow-y-scroll scrollbar">
            <QuestList l1Id={l1Id} account={account} tokenId={tokenId}  bq={bq} plugin={plugin} quest={quest} quests={quests} setQuest={setQuest} setQuests={setQuests}/> 
          </div>
        </div>


        <div className="border-l-2 p-4 border-solid border-gray-500 w-max-[0px]"> 
          <p className="pb-2">
            Your Tokens
          </p>
          <div className=" max-h-[550px] p-8 overflow-y-scroll scrollbar">
            <WizardList l1Id={l1Id} account={account} chainId = {chainId} wizard={tokenId} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}/> 
          </div>
        </div>
      </div>


      <div className="mt-4">
      Slot <input className="text-black text-left background-gray-200 max-w-18" value={slot} onChange={(e) => setSlot(e.target.valueAsNumber)}type="number"></input><br></br>
      <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
        onClick={() => {createQuest()}}
      >
        Create Quest
      </button>
      <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
      onClick={() => {acceptQuest()}}
      >
        Accept Quest
      </button>
      <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
      onClick={() => {completeQuest()}}
      >
        Complete Quest
      </button>
      <div className="p-8 text-[16px] ">
        {"Send: " + tokenId?.toNumber() +" on quest: " + quest}
      </div>
    </div>
  </div>
  );
};

export default BaseQuestList;

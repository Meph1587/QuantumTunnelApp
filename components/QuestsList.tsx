import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {WizardList} from "./WizardGrid";
import useTokenHasStoredTraits from "../hooks/useTokenHasStoredTraits";
import useGetTraits from "../hooks/useGetTraits";
import useInput from "../hooks/useInput";
import useENSName from "../hooks/useENSName";
import {getProofForTraits, getProofForName} from "../utils/makeMerkleProof";
import { useEffect, useState, useCallback } from "react";
import useGetQuests from "../hooks/useGetQuest";
import { BigNumber } from "ethers";

function formatDate(ts:BigNumber) {
  let p = (new Date(ts.toNumber()*1000))
  return p.getDate() + "-" + p.toLocaleString('default', { month: 'short' }) + "-" +  p.getFullYear() + " " + ('0'+(p.getHours())).slice(-2) + ":" +  ('0'+p.getMinutes()).slice(-2)
}


 const QuestList = ( {l1Id, account, chainId, token, tokenId, bq }) => {
  const [quests, setQuests] = useState([]);
  const [quest, setQuest] = useState(9999999);

  const run = useCallback(async () => {
    let quests: any = [];
    try {
      try {
        const total = (await bq.getNrQuests()).toNumber();
        console.log(total)
        for (let i=0; i<total; i++) {
          let q =await bq.getQuest(i)
          console.log(q)
          quests.push(q)
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
      <QuestGrid l1Id={l1Id} quests={quests} tokenId={tokenId} quest={quest} setQuest={setQuest} bq={bq} />
     
    </div>
  )
}

const QuestGrid = ({ l1Id, bq, quests,tokenId, quest, setQuest }) => {
  console.log(quest)

  async function createQuest() {
    let tx = await bq.createQuest()
    await tx.wait()
  }
  async function acceptQuest() {
    console.log(quest, tokenId)
    let tx = await bq.acceptQuest(1, tokenId, 0)
    await tx.wait()
  }


  return(
    <div>
      Quests
      {
        quests.map(q => (
          <button onClick={()=> setQuest(q["0"].toNumber()) }>
            <div key={q["0"].toNumber()} className=" grid grid-flow-col grid-cols-auto"
            style={{ "opacity": q["0"].toNumber()==quest? "100%": "60%"}}>
              <div className="text-left p-1 ml-5 w-28">
                <p className="text-gray-500">Started:</p>
                {q.startedAt.toString() != ""}
              </div>
              <div className="text-left p-1 ml-5 w-36">
                <p className="text-gray-500">Created At:</p>
                {formatDate(q.createdAt)}
              </div>
              <div className="text-left p-1 ml-5 w-36">
                <p className="text-gray-500">Expires At:</p>
                {formatDate(q.expiresAt)}
              </div>
              <div className="text-left p-1 ml-5 w-36">
                <p className="text-gray-500">Traits:</p>
                {q.traitIds.toString()}
              </div>
            </div>
          </button>
        ))}
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
        <div className="p-8 text-[16px] ">
          {"Send: " + tokenId?.toNumber() +" on quest: " + quest}
        </div>
      {quests.length}
    </div>
  )
}


export const BaseQuestList = ({l1Id, token, tokenId, bq, setWizard,wizardTraits,t1,t2 }) => {
 
  const { account, chainId } = useWeb3React();

  return(
    <div className="grid grid-flow-col grid-cols-2 mt-24 text-center">

      <div className="border-l-2 p-4 border-solid border-gray-500 "> 
        
        <div className=" max-h-[550px] p-8 overflow-y-scroll scrollbar">
          <QuestList l1Id={l1Id} account={account} chainId = {chainId} token={token} tokenId={tokenId}  bq={bq}/> 
        </div>
      </div>


      <div className="border-l-2 p-4 border-solid border-gray-500 "> 
        <p className="pb-2">
          Your Tokens
        </p>
        <div className=" max-h-[550px] p-8 overflow-y-scroll scrollbar">
          <WizardList l1Id={l1Id} account={account} chainId = {chainId} wizard={tokenId} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}/> 
        </div>
      </div>
      
    </div>
  );
};

export default BaseQuestList;
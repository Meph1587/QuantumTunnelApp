import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {WizardList} from "./WizardGrid";
import useTokenHasStoredTraits from "../hooks/useTokenHasStoredTraits";
import useGetTraits from "../hooks/useGetTraits";
import useInput from "../hooks/useInput";
import {getProofForTraits, getProofForName} from "../utils/makeMerkleProof";
import { useEffect, useState, useCallback } from "react";
import useGetQuests from "../hooks/useGetQuest";
import { BigNumber, ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import {getTraitNames} from "../utils/getTraitNames";
import TokenSelectModal from "./TokenSelectModal";
import PartySlots from "./PartySlots";


function formatDate(ts:BigNumber) {
  let p = (new Date(ts.toNumber()*1000))
  return p.getDate() + "-" + p.toLocaleString('default', { month: 'short' }) + "-" +  p.getFullYear() + " " + ('0'+(p.getHours())).slice(-2) + ":" +  ('0'+p.getMinutes()).slice(-2)
}

 const QuestList = ( {l1Id, account,tokenId, setWizard,setSlot,  wizardTraits,t1,t2, bq, plugin, quest,setQuest, quests, setQuests }) => {

  let { provider} = useWeb3React()
  let p = provider as unknown as BaseProvider


  const run = useCallback(async () => {
    let quests: any = [];
    try {
        const total = (await bq.getNrQuests()).toNumber();
        console.log(total)
        for (let questId=0; questId<total; questId++) {
          let q = await bq.getQuest(questId)
          if (q.expiresAt.toNumber()*1000 < Date.now()){
            console.log(questId, "expired")
            quests.push(null)
            continue;
          }else{
            let traitNames = await getTraitNames(plugin, p, q.traitIds)
            // let traitNames = []
            // list.map((n, idx)=>{
            //   traitNames= traitNames + "" + idx + ": " + n + " "
            // })
            let qn = {
              ...q,
              questId,
              traitNames
            }
            console.log(qn)
            quests.push(qn)
          }
          
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
      <QuestGrid  quests={quests} quest={quest} tokenId={tokenId} setQuest={setQuest} setSlot={setSlot} l1Id={l1Id} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}/>
     
    </div>
  )
}

const QuestGrid = ({l1Id, tokenId,  quests, quest, setQuest,setSlot, setWizard, wizardTraits,t1,t2, }) => {

  return(
    <div>
      Quests <br/>
      {
        quests.filter(q => q!=null).map((q) => (
          <button key={q.questId} className="text-left w-[100%]"
          onClick={()=> { setQuest(q.questId); setSlot(null)}} style={{ "opacity":q.questId==quest? "100%": "70%"}}>
            
             <div className="text-left p-1 mt-8 w-36">
                Quest Id: 
                {" " + q.questId}
              </div>
            <div  >
             {
                q.startedAt.toString() === "0" ?
                  <div className=" grid grid-flow-col grid-cols-auto  text-[15px]">
                    <div className="text-left p-1 w-36 ">
                      Expires At:<br/>
                      <p className="text-gray-400 ">{formatDate(q.expiresAt)}</p>
                    </div>
                    <div className="text-left p-1 w-36 ">
                      Slots At:<br/>
                      <p className="text-gray-400 ">{q.tokenIds.filter(r => r<10000 ).length} / 2  - ({q.tokenIds.length})</p>
                    </div>
                  </div>
                :
                <div className=" grid grid-flow-col grid-cols-auto  text-[15px]">
                  <div className="text-left p-1 w-28">
                    Ends At:<br/>
                    <p className="text-gray-400 ">{formatDate(q.endsAt)}</p>
                  </div> 
                
                  </div>
              }
              
              
            </div>
         
          </button>
        ))
      }
      
      <div className="p-8 text-[16px] ">
        {"Send: " + tokenId?.toNumber() +" on quest: " + quest}
      </div>
    </div>
  )
}


export const BaseQuestList = ({l1Id, token, tokenId, bq, setWizard, wizardTraits,t1,t2, plugin }) => {
 
  const { account, chainId } = useWeb3React();
  
  const [slot, setSlot] = useState([]);
  const [quests, setQuests] = useState([]);
  const [quest, setQuest] = useState(null);

  console.log(quest)
  console.log(quests)


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
       <div className=" p-4"> 
          <div className="grid grid-flow-col grid-cols-3  ">
            <div className=" col-span-2 p-10 text-center">
                <div className="bg-map bg-contain bg-no-repeat h-[550px]">
                  {/* <button className="relative block w-6 h-6 color-white p-[-10px] pointer right-[-12px] bottom-[-12px]  border-[12px] rounded-xl border-white text-8"
                    onClick={}
                  >
                  </button> */}
                </div>
                  { quests.length>0 ? quest!=null ? quests[quest].traitNames ?
                  <PartySlots traits={quests[quest].traitNames} tokenIds={quests[quest].tokenIds} slot={slot} setSlot={setSlot}  l1Id={l1Id} wizard={tokenId} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}></PartySlots> 
                  : null : null : null}
            </div>
          <div>
            <div className=" max-h-[550px] p-8 overflow-y-scroll scrollbar">
              <QuestList l1Id={l1Id} account={account} tokenId={tokenId}  bq={bq} setSlot={setSlot}  plugin={plugin} quest={quest} quests={quests} setQuest={setQuest} setQuests={setQuests} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}/> 
            </div>
            <div>
              { quests.length>0 && quest!=null ?
                quests[quest].startedAt.toString() === "0"  ?
                <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
                  onClick={() => {acceptQuest()}}
                >
                  Accept Quest
                </button>
                :
                <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
                  onClick={() => {completeQuest()}}
                >
                  Complete Quest
                </button>
              :null
              }
               <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
                  onClick={() => {createQuest()}}
                >
                  Create Quest
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseQuestList;

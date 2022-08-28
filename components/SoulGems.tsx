import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {WizardList} from "./WizardGrid";
import type { WizardStoragePlugin } from "../contracts/types";
import useTokenHasStoredTraits from "../hooks/useTokenHasStoredTraits";
import useGetTraits from "../hooks/useGetTraits";
import useInput from "../hooks/useInput";
import {getProofForTraits, getProofForName} from "../utils/makeMerkleProof";
import { useEffect, useState, useCallback } from "react";
import useGetQuests from "../hooks/useGetQuest";
import { BigNumber, ethers } from "ethers";
import useGetTraitNames from "../hooks/useGetTraitNames";
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';
import { BaseProvider } from "@ethersproject/providers";



 const SoulGemsStats = ( {account, setGemsIds, gemTokens, gems , gem, setGem }) => {

  let { provider} = useWeb3React()
  let p = provider as unknown as BaseProvider


  const run = useCallback(async () => {
    const gemList: any = [];
    try {
      const balance = (await gems.balanceOf(account)).toNumber();
      
      for (let i=0; i<balance; i++) {
        let tokenId = (await gems.tokenOfOwnerByIndex(account,i)).toNumber()
        let stats = await gems.getStats(tokenId)
        let token = await gems.gemToToken(tokenId)
        let statsCheck = await gems.getStatsForToken(token.token, token.tokenId)
        console.log("statsCheck", statsCheck)
          gemList.push(
            {
              tokenId,
              stats,
              token
            }
          )
      }
    } catch (err) {
      console.log("err: ", err);
    }
    setGemsIds(gemList);
  } ,[account,  gems, account])
  
  useEffect(() => {
    run();
  }, [run]);

  return ( 
    <div>
      <SoulGemsGrid gemTokens={gemTokens}  gem={gem} setGem={setGem}  />
    </div>
  )
}

const SoulGemsGrid = ({ gemTokens, gem, setGem }) => {


  return(
    <div>
      Gems
      {
        gemTokens.map((g) => (
          <button key={g.tokenId} onClick={()=> setGem(g.tokenId) }  style={{ "opacity":g.tokenId==gem? "100%": "60%"}}>
            <div  className=" grid grid-flow-col grid-cols-6 mt-8">
              <div className="text-left p-1 ml-5 w-28">
                <p className="text-gray-500">Quest Id:</p>
                {g.tokenId}
              </div>
              <div className="text-left p-1 ml-5 w-28">
                <p className="text-gray-500">Bound To:</p>
                {g.token.token.toString() == "0x0000000000000000000000000000000000000000" ? "none" : g.token.tokenId.toNumber()}
              </div>
            </div>
            <div className="text-left p-1 ml-5 ">
                <p className="text-gray-500">Stats:</p>
                {"Strength: " + g.stats.strength + ", "+"Dexterity: " + g.stats.dexterity + ", "+"Constitution: " + g.stats.constitution + ", "+"Intelligence: " + g.stats.intelligence + ", "+"Wisdom: " + g.stats.wisdom + ", "+"Charisma: " + g.stats.charisma}
              </div>
          </button>
        ))
      }
      
    </div>
  )
}


export const SoulGemsList = ({l1Id, token, tokenId,  setWizard,wizardTraits,t1,t2, gems }) => {
 
  const { account, chainId } = useWeb3React();

  const [slot, setSlot] = useState([]);
  const [gemTokens, setGemsIds] = useState([]);
  const [gem, setGem] = useState(9999999);

  async function reRollStats() {
    let tx = await gems.reRollStats(gem)
    await tx.wait()
  }
  async function bindToToken() {
    console.log(gem, tokenId)
    let tx = await gems.bindToToken(gem, token,tokenId)
    await tx.wait()
  }
  async function unBindToken() {
    console.log(gem, tokenId)
    let tx = await gems.unBindFromToken(gem, token,tokenId)
    await tx.wait()
  }


  return(
    <div>
      <div className="grid grid-flow-col grid-cols-2 mt-24 text-center">

        <div className="border-l-2 p-4 border-solid border-gray-500 "> 
          
          <div className=" max-h-[550px] p-8 overflow-y-scroll scrollbar">
            <SoulGemsStats account={account} gem={gem} setGem={setGem} setGemsIds={setGemsIds} gemTokens={gemTokens}  gems={gems} /> 
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
        <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
        onClick={() => {bindToToken()}}
        >
          Bind Gem
        </button>
        <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
        onClick={() => {unBindToken()}}
        >
          Un-Bind Gem
        </button>
        <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
        onClick={() => {reRollStats()}}
        >
          Re-Roll Stats
        </button>
        <div className="p-8 text-[16px] ">
          {"bind: " + tokenId?.toNumber() +" to gem: " + gem}
        </div>
      </div>
    </div>
  );
};

export default SoulGemsList;

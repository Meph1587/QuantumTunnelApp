import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {WizardList} from "../components/WizardGrid";
import useTokenHasStoredTraits from "../hooks/useTokenHasStoredTraits";
import useGetTraits from "../hooks/useGetTraits";
import useInput from "../hooks/useInput";
import {getProofForTraits, getProofForName} from "../utils/makeMerkleProof";
import { useCallback, useState,useEffect } from "react";
import {getTraitNames} from "../utils/getTraitNames";
import { BaseProvider } from "@ethersproject/providers";



const TokenStorage = ({ l1Id, token, tokenId, storage, plugin, setWizard, t1, t2 }) => {
  const wizardTraits = require("../data/traits.json");
  let traits = wizardTraits.traits[tokenId]
  let name = wizardTraits.names[tokenId]
  const { account, chainId, provider } = useWeb3React();


  let p = provider as unknown as BaseProvider
  let [traitNames, setTraitNames] = useState(false)

  const run = useCallback(async () => {
    let traits: any = [];
    try { 
      traits = await getTraitNames(plugin,p, wizardTraits.traits[tokenId])
      console.log(traitNames)
     } catch (err) {
      console.log("err: ", err);
    }
    setTraitNames(traits);
  } ,[account,  tokenId])

  useEffect(() => {
    run();
  }, [run]);


  const isVerified =  useTokenHasStoredTraits(storage, token, tokenId?.toNumber());
  const traitsStored =  useGetTraits(plugin,  tokenId?.toNumber());
  
  let [isStoring, setIsStoring] = useState(false)

  async function verifyWizard() {

    const proofTraits = getProofForTraits(traits.slice(0,8))
    const proofName = getProofForName(name)
    console.log(tokenId, name[1], traits.slice(0,8), proofName, proofTraits)


    try {
      setIsStoring(true);
      console.log(traits.slice(0,8))

      let tx = await plugin.storeTokenData(tokenId, name[1], traits.slice(0,8), proofName, proofTraits, {gasLimit:191527 })

      await tx.wait();
       
      setWizard(tokenId);
      setIsStoring(false);
      
    } catch (error) {
      console.log(error)
      setIsStoring(false);
    }
  }


  return(
    <div className="grid grid-flow-col grid-cols-2 mt-20 text-center">
      <div className="flex-1 pl-8">
        <div className="p-8 text-[16px] ">
          {tokenId? <div>{name[1]}</div>: "-"}
        </div>
        <div className="grid grid-flow-col grid-cols-2 ">
          <div>
            <div className="w-[300px] ml-auto mt-8">
              <img src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + tokenId + ".png"} alt=""/>
            </div>
          </div>
          <div className="text-left ml-16 border-left h-[360px]">{tokenId? 
            <div>
              <div className="mt-2 text"> Head: <p className="text-gray-400 w-64">{traitNames[3] != undefined ? traitNames[3]:"None"} </p> </div>
              <div className="mt-2 text"> Body: <p className="text-gray-400 w-64">{traitNames[4] != undefined ? traitNames[4]:"None"} </p> </div>
              <div className="mt-2 text"> Prop: <p className="text-gray-400 w-64">{traitNames[2] != undefined ? traitNames[2]:"None"} </p> </div>
              <div className="mt-2 text"> Familiar: <p className="text-gray-400 w-64">{traitNames[5] != undefined ? traitNames[5]:"None"} </p> </div>
              <div className="mt-2 text"> Rune: <p className="text-gray-400 w-64">{traitNames[6] != undefined ? traitNames[6]:"None"} </p> </div>
              <div className="mt-2 text"> Affinity: <p className="text-gray-400 w-64">{traitNames[1] != undefined ? traitNames[1].replace("aff:", ""):"None"} </p> </div>
              
            </div>
            : ``}
          </div>
        </div>
        <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
          onClick={() => {tokenId? !isVerified.data ? verifyWizard(): null:null}}
        >
          {!isStoring ? tokenId? !isVerified.data
          ? `Store Traits`
          : `Traits Already Stored`: "Select Token": "Storing.."}
           </button>
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

export default TokenStorage;
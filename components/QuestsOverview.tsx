import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {WizardList} from "./WizardGrid";
import useTokenHasStoredTraits from "../hooks/useTokenHasStoredTraits";
import useGetTraits from "../hooks/useGetTraits";
import useInput from "../hooks/useInput";
import useENSName from "../hooks/useENSName";
import {getProofForTraits, getProofForName} from "../utils/makeMerkleProof";
import { useMemo, useState } from "react";



const TokenStorage = ({ token, tokenId, storage, plugin, setWizard, t1, t2 }) => {
  const wizardTraits = require("../data/traits.json");
  let traits = wizardTraits.traits[tokenId]
  let name = wizardTraits.names[tokenId]
  const { account, chainId } = useWeb3React();


  const isVerified =  useTokenHasStoredTraits(storage, token, tokenId?.toNumber());
  const traitsStored =  useGetTraits(plugin,  tokenId?.toNumber());
  
  const ENSName = useENSName(account);
  let [isStoring, setIsStoring] = useState(false)

  async function verifyWizard() {

    const proofTraits = getProofForTraits(traits.slice(0,8))
    const proofName = getProofForName(name)
    console.log(tokenId, name[1], traits.slice(0,8), proofName, proofTraits)


    try {
      setIsStoring(true);
      console.log(traits.slice(0,8))

       let tx = await plugin.storeTokenData(tokenId, name[1], traits.slice(0,8), proofName, proofTraits, {gasLimit:191527 })
      
      const result = await tx.wait();
      setIsStoring(false);

    } catch (error) {
      console.log(error)
      setIsStoring(false);
    }
  }

  return(
    <div className="grid grid-flow-col grid-cols-2 mt-24 text-center">
      <div className="flex-1 pl-8">
        <div className="p-8 text-[16px] ">
          {tokenId? <div>{name[1]}</div>: "-"}
        </div>
        <div className="grid grid-flow-col grid-cols-2 ">
          <div>
            <div className="w-[300px] ml-auto">
              <img src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + tokenId + ".png"} alt=""/>
            </div>
          </div>
          <div className="text-left mt-12">{tokenId? 
            <div>
              <h3>
              Traits:
              </h3>
              <p className="mt-2"> Background: {traits[1] != 7777 ? traits[1]:"None"}</p>
              <p> Body: {traits[2] != 7777 ? traits[2]:"None"}</p>
              <p> Familiar: {traits[3] != 7777 ? traits[3]:"None"}</p>
              <p> Head: {traits[4] != 7777 ? traits[4]:"None"}</p>
              <p> Prop: {traits[5] != 7777 ? traits[5]:"None"}</p>
              <p> Rune: {traits[6] != 7777 ? traits[6]:"None"}</p>

              <p className="mt-2">  Check: {traitsStored.data?.slice(0,6).toString() == traits.slice(1,7).toString() ? "Ok":"!!!"}</p>
            </div>
            : ``}
          </div>
        </div>
        <button className="border-solid border-white border-2 p-4 mt-8 pl-10 pr-10 rounded-xs w-96"
          onClick={() => {tokenId? !isVerified.data ? verifyWizard(): null:null}}
        >
          {!isStoring ? tokenId? !isVerified.data
          ? `Verify`
          : `Already Verified`: "Select Token": "Storing.."}
           </button>
      </div>

      <div className="border-l-2 p-4 border-solid border-gray-500 "> 
        <p className="pb-2">
          Your Tokens
        </p>
        <div className=" max-h-[550px] p-8 overflow-y-scroll scrollbar">
          <WizardList  account={account} chainId = {chainId} wizard={tokenId} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}/> 
        </div>
      </div>
      
    </div>
  );
};

export default TokenStorage;
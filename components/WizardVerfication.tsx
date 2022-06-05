//import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useTokensAreApproved from "../hooks/useTokensAreApproved";
import useInput from "../hooks/useInput";
import Button from "./button";
import useENSName from "../hooks/useENSName";
import NumericalInput from "./numericalInput";
import {getProofForTraits, getProofForName} from "../utils/makeMerkleProof";
import { useMemo, useState } from "react";
import useContract from "../hooks/useContract";
import {WizardList} from "../components/WizardGrid";
import useStorageContract from "../hooks/useWizardStorage";
import { abi as ForgottenRunesWizardsCultAbi } from "../contracts/ForgottenRunesWizardsCult.json";
import { BigNumber } from "ethers";
import {switchNetwork} from "../utils/switchNetwork"

const wizardTraits = require("../data/traits.json");

const WizardVerification = ({chainId,  wizard, setWizard, show, setShow, t1, t2, qt1, qt2 }) => {
  let { account } = useWeb3React();

  let isApproved = useTokensAreApproved(t1, account, qt1.address, chainId);

  let [showAdvanced, setShowAdvanced] = useState(false)
  let [isTunneling, setIsTunneling] = useState(false)
  let [relayerFee, setRelayerFee] = useState(0)
  let [callbackFee, setCallbackFee] = useState(0)
  let name = wizardTraits.names[wizard]

  
  async function tunnelWizard(origin:number){
    if (origin===4){
      let tx = await qt1.deposit(t1.address, wizard, 2221, 0 , callbackFee, relayerFee, {value: relayerFee + callbackFee})
      await tx.wait()
    }else{
      let tx = await qt2.withdraw(t1.address, wizard, callbackFee, relayerFee, {value: relayerFee + callbackFee})
      await tx.wait()
    } 
    setShowAdvanced(false)
    setWizard(null)
  }

  async function approveToken(){
    await t1.setApprovalForAll(qt1.address, true);
  }

  //let response = useFetch("https://api.opensea.io/api/v1/assets?owner="+ENSName+"&token_ids="+wizard+"&asset_contract_address=0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42&order_direction=desc&offset=0&limit=20")
  

  return(
    <div className="flex-1 ">
      <div className="p-8">
        {wizard? <div>{name[1]}</div>: "-"}
      </div>
        <button className="border-solid border-white border-2  p-4 pl-10 pr-10 rounded-xs w-96"
          onClick={() => {wizard? isApproved.data || chainId===42 ? tunnelWizard(chainId): approveToken():setShow(!show)}}
        >
          {wizard? isApproved.data || chainId===42 ? 'Tunnel Wizard' : `Approve Token`: `Select Wizard`}
        </button>
       

      {wizard? isApproved.data || chainId===42 ? 
      <div>
        <button className="text-s pt-6 rounded-xs w-96"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced {showAdvanced? "ᐃ":"ᐁ"}
        </button>
      </div>
      : null: null}

      <div> 
        {showAdvanced ? 
          <div className="text-gray-500">
            <p className="text-xs pt-4 pb-4" > Only edit if you know what you are doing !!</p>
            <div className="inline-flex pt-4 pb-4">
              <p className="text-xs pr-5" >Relayer Fee: </p>
              <input className="text-xs h-5 p-2 bg-black border-solid border-gray-500 border-2 " type="text" value={relayerFee} onChange={(e) => setRelayerFee(parseInt(e.target.value))}></input>
              <p className="text-xs pl-5 text-gray-500" >(wei)</p>
            </div>
            <br/>
            <div className="inline-flex pt-4 pb-4">
              <p className="text-xs pr-5" >Callback Fee: </p>
              <input className="text-xs h-5 p-2 bg-black border-solid border-gray-500 border-2 " type="text" value={callbackFee} onChange={(e) => setCallbackFee(parseInt(e.target.value))}></input>
              <p className="text-xs pl-5 text-gray-500" >(wei)</p>
            </div>
          </div>
        :null}
      </div>
      
      <br></br>
        
      <div className="pt-1">
      {show ?  
        <WizardList  account={account} chainId = {chainId} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}/> : ""  }
      </div>
    </div>
  );
};

export default WizardVerification;

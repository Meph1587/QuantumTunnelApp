import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import getIsWizardApproved from "../hooks/useWizardIsApproved";
import useInput from "../hooks/useInput";
import Button from "./button";
import useENSName from "../hooks/useENSName";
import NumericalInput from "./numericalInput";
import {getProofForTraits, getProofForName} from "../utils/makeMerkleProof";
import { useMemo, useState } from "react";
import useContract from "../hooks/useContract";
import {WizardList} from "../components/WizardGrid";
import useStorageContract from "../hooks/useWizardStorage";
const wizardTraits = require("../data/traits.json");
const storageAddress = "0x11398bf5967Cd37BC2482e0f4E111cb93D230B05";


import { abi as ForgottenRunesWizardsCultAbi } from "../contracts/ForgottenRunesWizardsCult.json";

const WizardVerification = ({ l1token, tunnel, wizard, setWizard, show, setShow }) => {
  const { account } = useWeb3React<Web3Provider>();

  const {data: isApproved} =  getIsWizardApproved(account, tunnel, l1token);
  const wizardsContract = useContract("0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42", ForgottenRunesWizardsCultAbi);
  let traits = wizardTraits.traits[wizard]
  let name = wizardTraits.names[wizard]
  const ENSName = useENSName(account);
  
  function tunnelWizard(){
    
  }

  //let response = useFetch("https://api.opensea.io/api/v1/assets?owner="+ENSName+"&token_ids="+wizard+"&asset_contract_address=0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42&order_direction=desc&offset=0&limit=20")
  

  return(
    <div className="flex-1 ">
      <div className="p-10">
        
      {wizard? <div>{name[1]}</div>: "-"}
      </div>
      <button className="border-solid border-white border-2  p-4 pl-10 pr-10 rounded-xs w-96"
        onClick={() => {wizard? tunnelWizard() :setShow(!show)}}
      >
         {wizard? isApproved ? 'Tunnel Wizard' : 'Approve Wizard': `Select Wizard`}
      </button>
      
      <br></br>
        
      <div className="pt-10">
      {show ?  
        <WizardList wizardsContract={l1token} account={account} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits}/> : ""  }
      </div>
    </div>
  );
};

export default WizardVerification;

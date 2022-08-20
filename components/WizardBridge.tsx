import { useWeb3React } from "@web3-react/core";
import {WizardList} from "../components/WizardGrid";

import { useState } from "react";

const wizardTraits = require("../data/traits.json");

const senderChianId = 4;
const receiverChianId = 69;
const senderDomainId = 1001;
const receiverDomainId = 10011;


const WizardBridge = ({l1Id,l2Id,  wizard, setWizard, show, setShow, t1, t2, qt1, qt2 }) => {
  let { account, chainId } = useWeb3React();

  let [showAdvanced, setShowAdvanced] = useState(false)
  let [isTunneling, setIsTunneling] = useState(true)
  let [relayerFee, setRelayerFee] = useState(0)
  let [callbackFee, setCallbackFee] = useState(0)
  let name = wizardTraits.names[wizard]

  
  async function tunnelWizard(origin:number){
    if (origin===senderChianId){
      let fee = await qt1.estimateMessageFee(t1.address, wizard, receiverDomainId);
      let tx = await qt1.spawnAltToken(t1.address, wizard, receiverDomainId, {value: fee})
      await tx.wait()
    }else{
      let tx = await qt2.withdraw(t1.address, wizard, callbackFee, relayerFee, {value: relayerFee + callbackFee})
      await tx.wait()
    } 
    setShowAdvanced(false)
    setWizard(null)
  }

  return(
    
    <div className="grid grid-flow-col grid-cols-2 mt-24 ">
      <div className="p-4 mt-4 text-center"> 
        {chainId == l1Id ? 
          <div>
            <img src={wizard? "/tunnel.gif":"/tunnel.png"} className="w-96 h-96 ml-auto mr-auto"></img>
            {wizard? <img
              src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + wizard + ".png"}
              className="w-[94px] h-[94px] z-10 ml-auto mr-auto mt-[-238px]"
              onClick={()=> setWizard(wizard) 
              }
              alt="Wizard"
            /> : <div className="w-[94px] h-[94px] z-10 ml-auto mr-auto mt-[-238px]"></div> }
          </div>
          : chainId == l2Id ? 
          <div>
            <img src={wizard? "/tunnel-rev.gif":"/tunnel.png"} className="w-96 h-96 ml-auto mr-auto"></img>
            {wizard? <img
              src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + wizard + ".png"}
              className="w-[94px] h-[94px] z-10 ml-auto mr-auto mt-[-238px]"
              onClick={()=> setWizard(wizard) 
              }
              alt="Wizard"
            /> : <div className="w-[94px] h-[94px] z-10 ml-auto mr-auto mt-[-238px]"></div> }
          </div>
        : <div className="w-96 h-96 ml-auto mr-auto"> Unsupported Network </div>
        }
        <div className="p-8 mt-36 text-[12px] ">
          {wizard? <div>{name[1]}</div>: "-"}
        </div>
        <button className="border-solid border-white border-2  p-4 pl-10 pr-10 rounded-xs w-96"
            onClick={() => {wizard? tunnelWizard(chainId): setShow(!show)}}
        >
          {wizard? 'Tunnel Wizard' :`Select Wizard`}
        </button>
      </div>
      

      <div className="border-l-2 p-4 border-solid border-gray-500 "> 
        <p className="pb-2">
          Your Tokens
        </p>
        <div className=" max-h-[550px] p-8 overflow-y-scroll scrollbar">
          
          <WizardList l1Id={l1Id} account={account} chainId = {chainId} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}/> 
        </div>
      </div>
    </div>
  );
};

export default WizardBridge;

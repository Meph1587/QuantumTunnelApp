import { useWeb3React } from "@web3-react/core";
import {WizardList} from "../components/WizardGrid";
import TokenSelectModal from "./TokenSelectModal";

import { useState } from "react";

const wizardTraits = require("../data/traits.json");

const senderChianId = 4;
const receiverChianId = 69;
const senderDomainId = 1001;
const receiverDomainId = 10010;


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
    
      <div className="p-4 mt-4 text-center mt-20"> 
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
        {wizard  ? 
        <div>
            <button className="border-solid border-white border-2  p-4 pl-10 pr-10 rounded-xs w-96 mb-2"
                onClick={() => {tunnelWizard(chainId)}}
            > Tunnel Wizard 
          </button>
          <br></br>
          <TokenSelectModal  l1Id={l1Id} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2} trigger={<button className="border-solid border-white border-2  p-4 pl-10 pr-10 rounded-xs w-96" >Switch Token</button>}></TokenSelectModal> 
        </div>
          : <TokenSelectModal l1Id={l1Id} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2} trigger={<button className="border-solid border-white border-2  p-4 pl-10 pr-10 rounded-xs w-96" >Select Token</button>}></TokenSelectModal> 
        }
      </div>
      
  );
};

export default WizardBridge;

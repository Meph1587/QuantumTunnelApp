import { useWeb3React } from "@web3-react/core";

import { useState } from "react";

const wizardTraits = require("../data/traits.json");

const senderChianId = 4;
const receiverChianId = 69;
const senderDomainId = 1001;
const receiverDomainId = 10011;


const WizardBridge = ({chainId,  wizard, setWizard, show, setShow, t1, t2, qt1, qt2 }) => {
  let { account } = useWeb3React();

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
    <div className="flex-1 ">
      <div className="p-8">
        {wizard? <div>{name[1]}</div>: "-"}
      </div>
        <button className="border-solid border-white border-2  p-4 pl-10 pr-10 rounded-xs w-96"
          onClick={() => {wizard? tunnelWizard(chainId): setShow(!show)}}
        >
          {wizard? 'Tunnel Wizard' :`Select Wizard`}
        </button>
       

      {wizard ? 
      <div>
        <button className="text-s pt-6 rounded-xs w-96"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced {showAdvanced? "ᐃ":"ᐁ"}
        </button>
      </div>
      : null}

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
        
      
    </div>
  );
};

export default WizardBridge;

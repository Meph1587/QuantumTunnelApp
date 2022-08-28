import React from 'react';
import Popup from 'reactjs-popup';
import { useWeb3React } from "@web3-react/core";
import {WizardList} from "../components/WizardGrid";

 const TokenSelectModal = ({ l1Id,  wizard, setWizard, t1, t2, wizardTraits, trigger}) => {
  let { account, chainId } = useWeb3React();
    return(
  <Popup
    trigger={trigger}
    modal
    nested
  >
    {close => (
      <div className=" min-w-[50%] max-w-[80%] border-2 border-white mr-auto ml-auto text-center bg-black opacity">
        <button className="relative block w-6 h-6 color-white p-[-10px] pointer right-[12px] bottom-[12px]  border-[12px] rounded-xl border-white text-8" onClick={close}>
          <div className='relative right-[8px] bottom-[17px] text-xl'>&times;</div>
        </button>
        <div className="text-white mb-4"> Your Tokens</div>
        <div className=" max-h-[550px] p-8 overflow-y-scroll scrollbar">
          <WizardList l1Id={l1Id} account={account} chainId = {chainId} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}/> 
        </div>
        <div>
          {chainId == l1Id ?
            <p className="p-8 text-white">Mint testnet tokens on Etherscan: <a href={"https://rinkeby.etherscan.io/address/"+ t1.address+"#writeContract"} target="_blank" rel="noreferrer"><u>here</u></a></p>
          : <p className="p-8 text-white">Tokens take 3-5min to show up after bridging</p>}
        </div>
        </div>
    )}
  </Popup>
        )};

export default TokenSelectModal;

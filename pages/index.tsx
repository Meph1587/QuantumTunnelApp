import { useWeb3React} from "@web3-react/core";
import Head from "next/head";
import {useState } from "react";
import Account from "../components/Account";
import WizardBridge from "../components/WizardBridge";
import {WizardList} from "../components/WizardGrid";
import TokenStorage from "../components/TokenStorage";
import PendingTxs from "../components/PendingTxs";
import useContract from "../hooks/useContract";
import useEagerConnect from "../hooks/useEagerConnect";
const QT1 = require( "contracts/abi/QuantumTunnelL1.json");
const QT2 = require( "contracts/abi/QuantumTunnelL2.json");
const T1  = require("contracts/abi/IERC721Enumerable.json");
const T2  = require("contracts/abi/AltWizards.json");
const SRG  = require("contracts/abi/WizardStoragePlugin.json");
const LGS  = require("contracts/abi/LostGrimoireStorage.json");
import type { ERC721Enumerable, AltWizards, QuantumTunnelL1, QuantumTunnelL2, WizardStoragePlugin, LostGrimoireStorage } from "../contracts/types";
//import create from 'zustand';

const wizardTraits = require("../data/traits.json");

const senderChianId = 4;
const receiverChianId = 69;


function Home() {

  const { account, chainId} = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const isConnected = typeof account === "string";
  
  let [show, setShow] = useState(false)
  let [page, setPage] = useState("tunnel")
  let [wizard, setWizard] = useState(null)
  let [showPending, setShowPending] = useState(false)

  const qt1 = useContract("0x5e0f60ee176c268bebb67e3dca191c11275aa36b", QT1) as QuantumTunnelL1;
  const qt2 = useContract("0xb12bb899ca6de03ed0149e0cbf851633608c1e03", QT2) as QuantumTunnelL2;
  const t1 = useContract("0xdc15dd7e092d9e195ab6c03cbeb3f7d1afa082f1", T1) as ERC721Enumerable;
  const t2 = useContract("0xc1a8fd912c2fc45255ddf3aa3deb25af0023f549", T2) as AltWizards;
  const plugin = useContract("0x7614bfa46cfc3b158c1804e76d2e7001e07d0412", SRG) as WizardStoragePlugin;
  const storage = useContract("0xef7aaf4f05a5ebf46c9357325c6a004698a13b4a", LGS) as LostGrimoireStorage;


  return (
    <div style={{"backgroundColor":"black", "color":"white", "height":"100%", "overflow": "scroll"}}>
      <Head>
        <title>Quantum Tunnel </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center">
        <button onClick={() => {setPage("storage")}}>storage</button>
        <button onClick={() => {setPage("tunnel")}}>tunnel</button>
          <div className="text-center">
            {showPending ? 
            <div className="p-12">
              <div className="text-left" >
                <button onClick={() => {setShowPending(false)}}>ᐊ back</button>
              </div>
              <div className="p-10">
                <PendingTxs account={account} t1={t1.address} t2={t2.address} qt1={qt1.address} qt2={qt2.address}/>
              </div>
            </div>
            :
            <div>
              <div className="p-10">
                <Account triedToEagerConnect={triedToEagerConnect} chainId={chainId} setWizard={setWizard} setShowPending={setShowPending}/>
                <h1 className="text-6xl p-18 pb-0">Quantum Tunnel</h1>
              </div>
              {chainId == senderChianId ? 
              <div>
                <img src={wizard? "/tunnel.gif":"/tunnel.png"} className="w-96 h-96 ml-auto mr-auto"></img>
                {wizard? <img
                  src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + wizard + ".png"}
                  className="w-[100px] h-[100px] z-10 ml-auto mr-auto mt-[-238px]"
                  onClick={()=> setWizard(wizard) 
                  }
                  alt="Wizard"
                /> : <div className="w-[100px] h-[100px] z-10 ml-auto mr-auto mt-[-238px]"></div> }
              </div>
              : chainId == receiverChianId ? 
              <div>
                <img src={wizard? "/tunnel-rev.gif":"/tunnel.png"} className="w-96 h-96 ml-auto mr-auto"></img>
                {wizard? <img
                  src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + wizard + ".png"}
                  className="w-[100px] h-[100px] z-10 ml-auto mr-auto mt-[-238px]"
                  onClick={()=> setWizard(wizard) 
                  }
                  alt="Wizard"
                /> : <div className="w-[100px] h-[100px] z-10 ml-auto mr-auto mt-[-238px]"></div> }
              </div>
              : <div className="w-96 h-96 ml-auto mr-auto"> Unsupported Network </div>
              }
            <div className="mt-[130px]">
            {isConnected && (
              <section>
                {page ==="tunnel" ? 
                <WizardBridge chainId={chainId} wizard={wizard} setWizard={setWizard} show={show} setShow={setShow} t1={t1} t2={t2} qt1={qt1} qt2={qt2}/>
                :
                <TokenStorage token={t2.address} tokenId={wizard} storage={storage} plugin={plugin} show={show} setShow={setShow} ></TokenStorage>
            }</section>
            )}
            <div className="pt-1">
              {show ?  
                <WizardList  account={account} chainId = {chainId} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}/> : ""  }
              </div>
            </div>
          </div>
          }
        </div>
      </main>

    </div>
  );
}

export default Home;

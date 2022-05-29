import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import {useState } from "react";
import Account from "../components/Account";
import WizardVerification from "../components/WizardVerfication";
import useContract from "../hooks/useContract";
import useEagerConnect from "../hooks/useEagerConnect";
const QT1 = require( "../contracts/QuantumTunnelL1.json");
const QT2 = require( "../contracts/QuantumTunnelL2.json");
const T1  = require("../contracts/L1Token.json");
const T2  = require("../contracts/L2Token.json");
import type { L1Token } from "../contracts/types";
//import create from 'zustand';


const senderChianId = 4;
const receiverChianId = 42;

function Home() {

  const { account, library, chainId } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const isConnected = typeof account === "string" && !!library;

  let [show, setShow] = useState(false)
  let [wizard, setWizard] = useState(null)


  const qt1 = useContract("0x2c647a0c03c694a3c133f3688af2163aeb839b12", QT1);
  const qt2 = useContract("0xe6f3d7cdcfecb71413d4de218879977a62d4f0ad", QT2);
  const t1 = useContract("0xf3cf95d0ba6130112b3580534ade4c27eeb7de99", T1) as L1Token ;
  const t2 = useContract("0x38689886476b6df21a0c3b78ff6ed0bae885b111", T2);


  

  const wizardTraits = require("../data/traits.json");

  return (
    <div style={{"backgroundColor":"black", "color":"white", "height":"100%", "overflow": "scroll"}}>
      <Head>
        <title>Quantum Tunnel </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center">
        <div>
          <div className="p-10">
            <Account triedToEagerConnect={triedToEagerConnect}/>
            <h1 className="text-6xl p-18 pb-0">Quantum Tunnel</h1>
          </div>
          <div className="text-center">
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
          </div>
          <div className="mt-[130px]">
          {isConnected && (
            <section>
              <WizardVerification wizard={wizard} setWizard={setWizard} show={show} setShow={setShow} t1={t1} t2={t2} qt1={qt1} qt2={qt2}/>
            </section>
          )}
          </div>
        </div>
      </main>

    </div>
  );
}

export default Home;

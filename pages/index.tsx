import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import {useState } from "react";
import Account from "../components/Account";
import WizardVerification from "../components/WizardVerfication";
import useTokensAreApproved from "../hooks/useTokensAreApproved";
import useContract from "../hooks/useContract";
import useEagerConnect from "../hooks/useEagerConnect";
const QT1 = require( "../contracts/QuantumTunnelL1.json");
const QT2 = require( "../contracts/QuantumTunnelL2.json");
const T1  = require("../contracts/L1Token.json");
const T2  = require("../contracts/L2Token.json");
import type { L1Token, L2Token, QuantumTunnelL1, QuantumTunnelL2 } from "../contracts/types";
//import create from 'zustand';


const senderChianId = 4;
const receiverChianId = 42;

function Home() {

  const { account, library, chainId } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const isConnected = typeof account === "string" && !!library;

  let [show, setShow] = useState(false)
  let [wizard, setWizard] = useState(null)


  const qt1 = useContract("0x6f2c020607a695860f6e580866feda65381c0f08", QT1) as QuantumTunnelL1;
  const qt2 = useContract("0xde297ECc1fFD698109372f7b2472Bd77306CA34f", QT2) as QuantumTunnelL2;
  const t1 = useContract("0x103f8048358da399cf0f4e10dfd792af64c1e1b3", T1) as L1Token;
  const t2 = useContract("0xa77f3bd33e0686d110f07c4f02f6293043b12ec4", T2) as L2Token;

  


  return (
    <div style={{"backgroundColor":"black", "color":"white", "height":"100%", "overflow": "scroll"}}>
      <Head>
        <title>Quantum Tunnel </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center">
        <div>
          <div className="p-10">
            <Account triedToEagerConnect={triedToEagerConnect} chainId={chainId} setWizard={setWizard}/>
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
              <WizardVerification chainId={chainId} wizard={wizard} setWizard={setWizard} show={show} setShow={setShow} t1={t1} t2={t2} qt1={qt1} qt2={qt2}/>
            </section>
          )}
          </div>
        </div>
      </main>

    </div>
  );
}

export default Home;

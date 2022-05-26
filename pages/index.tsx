import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import {useState } from "react";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import WizardVerification from "../components/WizardVerfication";
import useEagerConnect from "../hooks/useEagerConnect";
import useContract from "../hooks/useContract";

import { abi as L1Token } from "../contracts/L1Token.json";
import { abi as L2Token } from "../contracts/L2Token.json";
import { abi as QuantumTunnelL1 } from "../contracts/QuantumTunnelL1.json";
import { abi as QuantumTunnelL2 } from "../contracts/QuantumTunnelL2.json";
import { abi as ForgottenRunesWizardsCultAbi } from "../contracts/ForgottenRunesWizardsCult.json";


import create from 'zustand';

const l1tokenAddress = "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42";//"0x285136be0b5cadad2a7002bbdc809b35721a808e";
const l2tokenAddress = "0x69fE7e64091Aa0f61d0b0dd385f14a0338D61c71";
const quantumTunnelL1Address = "0x62817574fe3d1dd5461cfba78b45e256fc040e7e";
const quantumTunnelL2Address = "0xC3e4d2c0c480005000c7401C22b1eD0dbd65CDD5";

// export const useStore = create(set => ({
//   wizard: 0,
//   setWizard: (id) => set(state => ({ wizard: id }))
// }))

function Home() {
  const { account, library, chainId } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  let [show, setShow] = useState(false)
  let [wizard, setWizard] = useState(null)
  const l1Token = useContract("0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42", ForgottenRunesWizardsCultAbi);//useContract(l1tokenAddress, ForgottenRunesWizardsCultAbi);
  const l2Token = useContract(l2tokenAddress, L2Token);
  const quantumTunnelL1 = useContract(quantumTunnelL1Address, QuantumTunnelL1);
  const quantumTunnelL2 = useContract(quantumTunnelL2Address, QuantumTunnelL2);
  



  return (
    <div style={{"backgroundColor":"black", "color":"white", "height":"100%", "overflow": "scroll"}}>
      <Head>
        <title>Quantum Tunnel </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <div className="p-10">
            <Account triedToEagerConnect={triedToEagerConnect} />
            <h1 className="text-6xl p-20 pb-0">Quantum Tunnel</h1>
          </div>
          <div className="text-center">
            { chainId == 4 ? 
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
            : chainId == 42 ? 
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
            : <div className="w-96 h-96 ml-auto mr-auto"> Unsupported Network</div>
            }
          </div>
          <div className="mt-[130px]">
          {isConnected && (
            <section>
              <WizardVerification wizard={wizard} setWizard={setWizard} show={show} setShow={setShow} l1token={l1Token} tunnel={quantumTunnelL1Address} />
            </section>
          )}
          </div>
        </div>
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;

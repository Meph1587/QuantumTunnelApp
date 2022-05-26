import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import {useState } from "react";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import WizardVerification from "../components/WizardVerfication";
import useEagerConnect from "../hooks/useEagerConnect";


import create from 'zustand';
const storageAddress = "0x11398bf5967Cd37BC2482e0f4E111cb93D230B05";

export const useStore = create(set => ({
  wizard: 0,
  setWizard: (id) => set(state => ({ wizard: id }))
}))

function Home() {
  const { account, library, chainId } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  let [show, setShow] = useState(false)
  let [wizard, setWizard] = useState(null)



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
              <WizardVerification wizard={wizard} setWizard={setWizard} show={show} setShow={setShow} />
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

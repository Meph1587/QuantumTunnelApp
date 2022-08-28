import { useWeb3React} from "@web3-react/core";
import Head from "next/head";
import {useState } from "react";
import WizardBridge from "../components/WizardBridge";
import TokenStorage from "../components/TokenStorage";
import BaseQuestList from "../components/QuestsList";
import NavBar from "../components/NavBar";
import PendingTxs from "../components/PendingTxs";
import useContract from "../hooks/useContract";
const QT1 = require( "contracts/abi/QuantumTunnelL1.json");
const QT2 = require( "contracts/abi/QuantumTunnelL2.json");
const T1  = require("contracts/abi/IERC721Enumerable.json");
const T2  = require("contracts/abi/AltWizards.json");
const SRG  = require("contracts/abi/WizardStoragePlugin.json");
const LGS  = require("contracts/abi/LostGrimoireStorage.json");
const TVRN  = require("contracts/abi/JollyTavern.json");
const BQ  = require("contracts/abi/BaseQuest.json");
const GEMS  = require("contracts/abi/SoulGems.json");
import type { BaseQuest, JollyTavern,  ERC721Enumerable, AltWizards, QuantumTunnelL1, QuantumTunnelL2, WizardStoragePlugin, LostGrimoireStorage, SoulGems } from "../contracts/types";
import { SoulGemsList } from "../components/SoulGems";
//import create from 'zustand';

const wizardTraits = require("../data/traits.json");

const l1Id = 4;
const l2Id = 421611;

export enum Page {
  Tunnel,
  Storage,
  Quests,
  History,
  SoulGems,
}

function Home() {

  const { account, chainId} = useWeb3React();
  const isConnected = typeof account === "string";
  
  let [show, setShow] = useState(false)
  let [page, setPage] = useState(Page.Tunnel)
  let [wizard, setWizard] = useState(null)




  const qt1 = useContract("0x88c0b1d9523fd7c8f225d57067cb709a2c648e67", QT1) as QuantumTunnelL1;
  const qt2 = useContract("0x286faa336d2519a804034e99794ea584a85e08c4", QT2) as QuantumTunnelL2;
  const t1 = useContract("0x5ffb41ccafb6d7c50b9b077f117e62d51227580c", T1) as ERC721Enumerable;
  const t2 = useContract("0x50c9d2bfd88e243297c610b73f5b5ad55882e49a", T2) as AltWizards;
  const plugin = useContract("0xf522a2ae2b8d863e4d39cf98d8f5f1e06e3d174b", SRG) as WizardStoragePlugin;
  const storage = useContract("0x6c36529fbe328b5dd2afce4438fc6f34f2b51cbd", LGS) as LostGrimoireStorage;
  const tavern = useContract("0x88c0b1d9523fd7c8f225d57067cb709a2c648e67", TVRN) as JollyTavern;
  const bq = useContract("0x3Ce7A2cafF2905060Bf5590ff2Ac4D295A9F5221", BQ) as BaseQuest;
  const gems = useContract("0x658fb2bc9f9a450e6f94cc9239cb2b04a326b263", GEMS) as SoulGems;

  return (
    <div className="background-black text-white">
      <Head >
        <title>Forgotten Quests </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center">
        <NavBar l1Id={l1Id} l2Id={l2Id} setPage={setPage} setWizard={setWizard}  ></NavBar>
          <div className="text-center">
            
            {isConnected && (
              <section>
                {page === Page.Tunnel ?
                <WizardBridge l1Id={l1Id} l2Id={l2Id}  wizard={wizard} setWizard={setWizard} show={show} setShow={setShow} t1={t1} t2={t2} qt1={qt1} qt2={qt2}/>
                : page === Page.Storage ?
                <TokenStorage l1Id={l1Id} token={t2.address} tokenId={wizard} storage={storage} plugin={plugin} setWizard={setWizard} t1={t1} t2={t2}></TokenStorage>
                : page === Page.History ?
                <PendingTxs account={account} t1={t1.address} t2={t2.address} qt1={qt1.address} qt2={qt2.address}/>
                : page === Page.SoulGems ?
                 <SoulGemsList l1Id={l1Id} token={t2.address} tokenId={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2} gems={gems} ></SoulGemsList>
                :   <BaseQuestList l1Id={l1Id} bq={bq} token={t2.address} tokenId={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2} plugin={plugin} ></BaseQuestList>
            }</section>
            )}</div>
      </main>

    </div>
  );
}

export default Home;

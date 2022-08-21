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
const l2Id = 69;

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

  const qt1 = useContract("0x5e0f60ee176c268bebb67e3dca191c11275aa36b", QT1) as QuantumTunnelL1;
  const qt2 = useContract("0xb12bb899ca6de03ed0149e0cbf851633608c1e03", QT2) as QuantumTunnelL2;
  const t1 = useContract("0xdc15dd7e092d9e195ab6c03cbeb3f7d1afa082f1", T1) as ERC721Enumerable;
  const t2 = useContract("0xc1a8fd912c2fc45255ddf3aa3deb25af0023f549", T2) as AltWizards;
  const plugin = useContract("0x7614bfa46cfc3b158c1804e76d2e7001e07d0412", SRG) as WizardStoragePlugin;
  const storage = useContract("0xef7aaf4f05a5ebf46c9357325c6a004698a13b4a", LGS) as LostGrimoireStorage;
  const tavern = useContract("0x3d5cacf72b9675905d042fe668a0568c2ab79a69", TVRN) as JollyTavern;
  const bq = useContract("0xe6e27850a6dfad281073d0998c7527099a6575b4", BQ) as BaseQuest;
  const gems = useContract("0xf1b1aa31b9d6e4b0d2ccefc75e610a972dfa4d1d", GEMS) as SoulGems;

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
                 <SoulGemsList l1Id={l1Id} bq={bq} token={t2.address} tokenId={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2} gems={gems} ></SoulGemsList>
                :   <BaseQuestList l1Id={l1Id} bq={bq} token={t2.address} tokenId={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2} plugin={plugin} ></BaseQuestList>
            }</section>
            )}</div>
      </main>

    </div>
  );
}

export default Home;

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

  // let qt1Address = "0x5a3b381b0d23da7180ef6fb6a635368358281042"
  // let l1GemsAddress = "0x37a0f11940bd4884fa8dc0f0afa509b075ac96c6"
  // let l1WizAddress = "0x8144f311c0a94ab4faadbcda36de3deed4b2c861"
  // let qt2Address = "0x190e9eafb6caf31b0f8f99a44fcd23dbb25f2b34"
  // let rmAddress = "0x65ab01615b6acaaf47f014934c0927f0c010e786"
  // let randomAddress = "0xeeda71a03af20ce719f28a2d1527c148405fd8eb"
  // let l2GemsAddress = "0x3227b37c01039b1a074d9cac39ace902302aac7e"
  // let l2WizAddress = "0xe5a55eb09bb6248491f5af706b3a86f92e9a8504"
  // let storageAddress = "0x6c16e9b8edf110e5386b8b80916e018645bbc9a1"
  // let pluginAddress = "0x387a396484fc6f95851e87cd460726cb39326d34"
  // let grimoireAddress = "0x8ecfdcef47bee9eeb0d18101b222f410238b26ff"
  // let tavernAddress = "0x6a6442ae018fb422716a2752b6f0efbca8a7301b"
  // let questsAddress = "0x0cB948B6a558E99f22c66a07Da2A143f08bF3414"
  // let memoriesAddress = "0x68bb03647830c7c68e65b70cadb71fedf2c1234b"
  // let multicallAddress = "0xc8ac645fb4efccfaf8761ae2a1f9770b441cc3a6"

  const qt1 = useContract("0x5a3b381b0d23da7180ef6fb6a635368358281042", QT1) as QuantumTunnelL1;
  const qt2 = useContract("0x190e9eafb6caf31b0f8f99a44fcd23dbb25f2b34", QT2) as QuantumTunnelL2;
  const t1 = useContract("0x8144f311c0a94ab4faadbcda36de3deed4b2c861", T1) as ERC721Enumerable;
  const t2 = useContract("0xe5a55eb09bb6248491f5af706b3a86f92e9a8504", T2) as AltWizards;
  const storage = useContract("0x6c16e9b8edf110e5386b8b80916e018645bbc9a1", LGS) as LostGrimoireStorage;
  const plugin = useContract("0x387a396484fc6f95851e87cd460726cb39326d34", SRG) as WizardStoragePlugin;
  const tavern = useContract("0x6a6442ae018fb422716a2752b6f0efbca8a7301b", TVRN) as JollyTavern;
  const bq = useContract("0x0cB948B6a558E99f22c66a07Da2A143f08bF3414", BQ) as BaseQuest;
  const gems = useContract("0x3227b37c01039b1a074d9cac39ace902302aac7e", GEMS) as SoulGems;

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

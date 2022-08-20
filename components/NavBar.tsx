import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {Page} from "../pages/index";
import { useMemo, useState } from "react";
import Account from "../components/Account";
import useEagerConnect from "../hooks/useEagerConnect";

import {switchNetwork} from "../utils/switchNetwork"


const NavBar = ({ l1Id, l2Id,setPage, setWizard}) => {
    const {
      chainId,
      account,
    } = useWeb3React();
    const [showDetails, setShowDetails] = useState(false);

    const triedToEagerConnect = useEagerConnect();

    return(
        <div className="p-4">
            <Account triedToEagerConnect={triedToEagerConnect} />
            <div className="grid grid-flow-col grid-cols-auto pt-2 h-10">
               
                    <div className="text-left w-max" >
                        <h1 className="text-3xl">
                            Forgotten Quests
                        </h1 >
                        
                    </div>

                <div className="text-center z-10 overflow-visible mr-48 ">
                    {chainId ==l2Id ? 
                    <div>
                        <button className="p-2 underline underline-offset-2 text-xl" onClick={() => {setPage(Page.Tunnel)}}>Tunnel</button>
                        <button className="p-2 underline underline-offset-2 text-xl" onClick={() => {setPage(Page.Storage)}}>Storage</button>
                        <button className="p-2 underline underline-offset-2 text-xl" onClick={() => {setPage(Page.Quests)}}>Quests</button>
                    </div>
                    :<div>
                        <button className="p-2 underline underline-offset-2 text-xl" onClick={() => {setPage(Page.Tunnel)}}>Tunnel</button>
                    </div>
                    }
                </div>

                {account!=undefined ? 
                    <div className="text-right z-10 overflow-visible">
                        <div className="">
                            <button className=""  onClick={() => {switchNetwork(chainId===l2Id ? l1Id : l2Id); setWizard(null); setPage(Page.Tunnel)}}>ᐊ {chainId == l1Id ? "Rinkeby" : chainId == l2Id? "OP-Kovan": "Switch To Rinkeby Or OP-Kovan"} ᐅ</button>
                        </div>
                        <div className="pt-3 ">
                        <button className="underline underline-offset-2" onClick={() => setShowDetails(!showDetails)}>
                        {account.slice(0,6)+"..." + account.slice(28,32)} {showDetails? "ᐃ":"ᐁ"}
                        </button>
                        </div>
                        {
                        showDetails? 
                        <div className="">
                            <div className="pt-3" ><button onClick={ () => {setPage(Page.History)}}>Tx History</button></div>
                            <div className="pt-3" ><a href={"https://rinkeby.etherscan.io/address/" + account} target="_blank" rel="noreferrer">L1 Etherscan</a></div>
                            <div className="pt-3" ><a href={"https://kovan-optimistic.etherscan.io//address/" + account} target="_blank" rel="noreferrer">L2 Etherscan</a></div>
                        </div>
                        :null
                        }
                    </div>
                : <div></div>}
            </div>
        </div>
    )

}
export default NavBar;
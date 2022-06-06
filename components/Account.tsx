/* eslint-disable @next/next/no-img-element */
import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { injected } from "../connectors";

import {switchNetwork} from "../utils/switchNetwork"

type Props = {
  triedToEagerConnect: boolean;
};




const Account = ({ triedToEagerConnect, chainId, setWizard, setShowPending }) => {
  const {
    active,
    error,
    activate,
    account,
    setError,
  } = useWeb3React();

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>();

  useLayoutEffect(() => {
    onboarding.current = new MetaMaskOnboarding();
  }, []);

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      onboarding.current?.stopOnboarding();
    }
  }, [active, error]);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== "string") {
    const hasMetaMaskOrWeb3Available =
      MetaMaskOnboarding.isMetaMaskInstalled() ||
      (window as any)?.ethereum ||
      (window as any)?.web3;

    return (
      <div className="text-right">
        {hasMetaMaskOrWeb3Available ? (
          <button  className="border-solid border-white border-2  p-2 rounded-xs" 
            onClick={() => {
              setConnecting(true);

              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              });
            }}
          >
            {MetaMaskOnboarding.isMetaMaskInstalled()
              ? "Connect to MetaMask"
              : "Connect to Wallet"}
          </button>
        ) : (
          <button onClick={() => onboarding.current?.startOnboarding()}>
            Install Metamask
          </button>
        )}
      </div>
    );
  }else{
    return (
      <div className="grid grid-flow-col grid-cols-auto p-2 h-10">
          <div className="text-left" >
            <p onClick={() => onboarding.current?.startOnboarding()}>
              {chainId == 4 ? "Rinkeby" : chainId == 42? "Kovan": "Switch To Rinkeby Or Kovan"}
            </p>
            <button onClick={() => {switchNetwork(chainId===42 ? 4 : 42); setWizard(null)}}>ᐊ switch ᐅ</button>
          </div>
          <div className="text-right z-10 overflow-visible">
            <button onClick={() => setShowDetails(!showDetails)}>
              {account.slice(0,6)+"..." + account.slice(28,32)} {showDetails? "ᐃ":"ᐁ"}
            </button>
            {
              showDetails? 
              <div className="pt-5">
                  <div className=""><a href={"https://rinkeby.etherscan.io/address/" + account} target="_blank">L1 Etherscan</a></div><br/>
                  <div className=""><a href={"https://kovan.etherscan.io/address/" + account} target="_blank">L2 Etherscan</a></div><br/>
                  <div className=""><button onClick={ () => {setShowPending(true)}}>Tx History</button></div>
              </div>
              :null
            }
          </div>
      </div>
  )
  }
};


export default Account;

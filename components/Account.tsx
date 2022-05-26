/* eslint-disable @next/next/no-img-element */
import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { injected } from "../connectors";
import useENSName from "../hooks/useENSName";
import useContract from "../hooks/useContract";
import { formatEtherscanLink, shortenHex } from "../util";
import WizardStorage_ABI from "../contracts/WizardStorage.json";
import { abi as ForgottenRunesWizardsCultAbi } from "../contracts/ForgottenRunesWizardsCult.json";
import { useStore } from "../pages/index";
import {WizardList} from "./WizardGrid";

type Props = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: Props) => {
  const {
    active,
    error,
    activate,
    chainId,
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
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      onboarding.current?.stopOnboarding();
    }
  }, [active, error]);

  const ENSName = useENSName(account);
  const wizardsContract = useContract("0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42", ForgottenRunesWizardsCultAbi);
  const storageContract = useContract("0x11398bf5967Cd37BC2482e0f4E111cb93D230B05", WizardStorage_ABI);
  const wizardTraits = require("../data/traits.json");
  const verified = {};

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
      <div className="grid grid-flow-col grid-cols-auto p-2">
        
          <p className="text-left " onClick={() => onboarding.current?.startOnboarding()}>
            {chainId == 4 ? "Rinkeby" : chainId == 42? "Kovan": "Switch To Rinkeby Or Kovan"}
          </p>
          <p className="text-right" onClick={() => onboarding.current?.startOnboarding()}>
            {account.slice(0,6)+"..." + account.slice(28,32)}
          </p>
      </div>
  )
  }
};


export default Account;

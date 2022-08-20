/* eslint-disable @next/next/no-img-element */
import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { injected } from "../connectors";



const senderChianId = 4;
const receiverChianId = 69;


type Props = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect}) => {
  const {
    isActive,
    connector,
    account,
  } = useWeb3React();

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>();

  useLayoutEffect(() => {
    onboarding.current = new MetaMaskOnboarding();
  }, []);

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (!isActive) {
      setConnecting(false);
      onboarding.current?.stopOnboarding();
    }
  }, [isActive]);


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

               connector.activate(injected, undefined, true).then(()=>console.log("connected")).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  console.log(error)
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
      <div></div>
  )
  }
};


export default Account;

import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { injected } from "../connectors";

export default function useEagerConnect() {
  const { connector, isActive } = useWeb3React();

  const [tried, setTried] = useState(false);

  async function activate() {
      try{
          await connector.activate(injected, undefined, true)
      }catch{
        setTried(true)
      };
    }
  

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate()
      } else {
        setTried(true);
      }
    });
  }, [connector.activate]);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && isActive) {
      setTried(true);
    }
  }, [tried, isActive]);

  return tried;
}

import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { Web3Provider } from '@ethersproject/providers'


export default function useContract<T extends Contract = Contract>(
  address: string,
  ABI: any
): T | null {
  const { connector,provider, account, chainId } = useWeb3React();
  return useMemo(() => {
    if (!address || !ABI || !provider || !chainId) {
      return null;
    }

    try {
      return new Contract(address, ABI, provider.getSigner());
    } catch (error) {
      console.error("Failed To Get Contract", error);

      return null;
    }
  }, [address, ABI, provider, account]) as T;
}

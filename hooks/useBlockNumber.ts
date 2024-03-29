import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";

function getBlockNumber(library: Web3Provider) {
  return async () => {
    return library.getBlockNumber();
  };
}

export default function useBlockNumber() {
  const { provider } = useWeb3React<Web3Provider>();
  const shouldFetch = !!provider;

  return useSWR(shouldFetch ? ["BlockNumber"] : null, getBlockNumber(provider), {
    refreshInterval: 10 * 1000,
  });
}

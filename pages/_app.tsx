
import type { AppProps } from "next/app";
import { useWeb3React,Web3ReactHooks,Web3ReactProvider } from "@web3-react/core";
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import "../styles/globals.css";

const connectorList: [MetaMask,Web3ReactHooks ][] = [
  [metaMask, metaMaskHooks],
]


function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider connectors={connectorList}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default NextWeb3App;

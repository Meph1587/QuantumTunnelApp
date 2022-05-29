
import { hexlify } from "ethers/lib/utils";

export async function switchNetwork(chainId){
    if ((window as any)?.ethereum) {
      console.log(hexlify(chainId).replace("0x0", "0x"))
      try {
        await (window as any)?.ethereum.request({
        method: 'wallet_switchEthereumChain',
          params: [{ chainId:  hexlify(chainId).replace("0x0", "0x") }],
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
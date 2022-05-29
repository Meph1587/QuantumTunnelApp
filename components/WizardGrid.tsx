/* eslint-disable @next/next/no-img-element */
import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { injected } from "../connectors";
import useContract from "../hooks/useContract";
import { formatEtherscanLink, shortenHex } from "../util";
import WizardStorage_ABI from "../contracts/WizardStorage.json";
import { abi as ForgottenRunesWizardsCultAbi } from "../contracts/ForgottenRunesWizardsCult.json";



const WizardGrid = ({wizards, wizard, setWizard, wizardTraits}) => {
  const {
    chainId,
  } = useWeb3React();
  
    return (
          <div style={{"display": "flex", "flexDirection": "row", "flexWrap": "wrap", "alignContent": "center", "justifyContent": "center"}}>
          {wizards.length > 0 ? wizards.map((w: any) => (
            <div key={w} style={{ "opacity": w===wizard ? "100%": "50%", "backgroundImage": "url('/frame.png')", "backgroundSize": "cover", "width": "12em", "height": "12em", "display": "flex", "flexDirection": "column", "alignContent": "center", "justifyContent": "flex-start", "alignItems": "center"}}>
              <div style={{ "marginRight": "2.8em", "marginLeft": "3em", "height": "1.8em", "display": "flex", "alignItems": "center"}}>
                <h3 style={{"fontSize": "0.6em", "fontFamily": "Alagard", "color": "rgb(223, 209, 168)"}}> {wizardTraits['names'][w][1]}</h3>
              </div>
              <img
                src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + w + ".png"}
                style={{"width":"9em", "height":"9em"}}
                onClick={()=> setWizard(w) 
                }
                alt="Wizard"
              />
            </div>
          ))
          :
          <div>
            {chainId == 4 && wizards.length == 0? 
              <p className="p-8">Mint testnet tokens on Etherscan: <a href="https://rinkeby.etherscan.io/token/0xf3cf95d0ba6130112b3580534ade4c27eeb7de99#writeContract" target="_blank"><u>here</u></a></p>
              :
              <p className="p-8">Pending Transactions</p>
            }
          </div>
          }
          </div>
    );
  }
  
  
  export const WizardList = ( {account, wizard, setWizard, wizardTraits, t1, t2}) => {
    const [wizards, setWizards] = useState([]);
  
    const run = useCallback(async () => {
      const tokens: any = [];
      try {
        const balance = (await t1.balanceOf(account)).toNumber();
        for (let i=0; i<balance; i++) {
            tokens.push(
              await t1.tokenOfOwnerByIndex(account,i)
            )
        }
      } catch (err) {
        console.log("err: ", err);
      }
      setWizards(tokens);
    } ,[account,  t1])
    
    useEffect(() => {
      run();
    }, [run]);
  
    return <WizardGrid wizards={wizards} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits}/>
  }
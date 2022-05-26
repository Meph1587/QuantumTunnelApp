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


const WizardGrid = ({wizards, wizard, setWizard, wizardTraits}) => {
  
    return (
          <div style={{"display": "flex", "flexDirection": "row", "flexWrap": "wrap", "alignContent": "center", "justifyContent": "center"}}>
          {wizards.map((w: any) => (
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
          ))}
          </div>
    );
  }
  
  
  export const WizardList = ( {wizardsContract, account, wizard, setWizard, wizardTraits}) => {
    const [wizards, setWizards] = useState([]);
  
    const run = useCallback(async () => {
      const tokens: any = [];
      try {
        const result = await wizardsContract.tokensOfOwner(account);
  
        
  
      } catch (err) {
        console.log("err: ", err);
      }
      setWizards(tokens);
    } ,[account, {}, wizardsContract])
    
    useEffect(() => {
      run();
    }, [run]);
  
    return <WizardGrid wizards={wizards} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits}/>
  }
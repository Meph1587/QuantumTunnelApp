/* eslint-disable @next/next/no-img-element */
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";


const WizardGrid = ({l1Id, wizards, wizard, setWizard, wizardTraits,t1Address}) => {
  const {
    chainId,
  } = useWeb3React();
  
    return (
          <div style={{"display": "flex", "flexDirection": "row", "flexWrap": "wrap", "alignContent": "center", "justifyContent": "center"}}>
          {wizards.length > 0 ? wizards.map((w: any) => (
            <div key={w} style={{ "opacity": w.toNumber()==wizard? "100%": "50%", "backgroundImage": "url('/frame.png')", "backgroundSize": "cover", "width": "12em", "height": "12em", "display": "flex", "flexDirection": "column", "alignContent": "center", "justifyContent": "flex-start", "alignItems": "center"}}>
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
            {chainId == l1Id && wizards.length == 0? 
             <p></p>
              :
              <p className="p-8">No Bridged Wizards</p>
            }
          </div>
          }
          <br></br>
          
        </div>
    );
  }
  
  
  export const WizardList = ( {l1Id, account, chainId, wizard, setWizard, wizardTraits, t1, t2}) => {
    const [wizards, setWizards] = useState([]);
  
    const run = useCallback(async () => {
      const tokens: any = [];
      try {
        const balance = chainId === l1Id ? (await t1.balanceOf(account)).toNumber() : (await t2.balanceOf(account)).toNumber();
        for (let i=0; i<balance; i++) {
            tokens.push(
              chainId === l1Id ? await t1.tokenOfOwnerByIndex(account,i) : await t2.tokenOfOwnerByIndex(account,i)
            )
        }
      } catch (err) {
        console.log("err: ", err);
      }
      setWizards(tokens);
    } ,[account,  t1, t2, wizard, chainId ])
    
    useEffect(() => {
      run();
    }, [run]);
  
    return ( 
      <div>
        <WizardGrid l1Id={l1Id} wizards={wizards} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1Address={t1.address}/>
       
      </div>
    )
  }
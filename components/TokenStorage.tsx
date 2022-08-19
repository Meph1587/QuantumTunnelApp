import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useTokenHasStoredTraits from "../hooks/useTokenHasStoredTraits";
import useInput from "../hooks/useInput";
import useENSName from "../hooks/useENSName";
import {getProofForTraits, getProofForName} from "../utils/makeMerkleProof";
import { useMemo, useState } from "react";



const TokenStorage = ({ token, tokenId, storage, plugin, show, setShow }) => {
    const wizardTraits = require("../data/traits.json");
    let traits = wizardTraits.traits[tokenId]
    let name = wizardTraits.names[tokenId]
  const { account } = useWeb3React();


  const isVerified =  useTokenHasStoredTraits(storage, token, tokenId);
  console.log(isVerified.data)
  
  const ENSName = useENSName(account);
  let [isStoring, setIsStoring] = useState(false)

  async function verifyWizard() {

        const proofTraits = getProofForTraits(traits.slice(0,8))
        const proofName = getProofForName(name)
        console.log(tokenId, name[1], traits.slice(0,8), proofName, proofTraits)

    try {
      setIsStoring(true);
      console.log(traits.slice(0,8))

       let tx = await plugin.storeTokenData(tokenId, name[1], traits.slice(0,8), proofName, proofTraits)
      
      const result = await tx.wait();
      setIsStoring(false);

    } catch (error) {
      console.log(error)
      setIsStoring(false);
    }
  }

  return(
    <div className="flex-1">
          <div className="p-8">
        {tokenId? <div>{name[1]}</div>: "-"}
      </div>
        <button className="border-solid border-white border-2  p-4 pl-10 pr-10 rounded-xs w-96"
          disabled={
            !(tokenId) ||isVerified 
          } onClick={() => {tokenId? verifyWizard(): setShow(!show)}}
        >
          {!isStoring ? tokenId? !isVerified
          ? `Verify`
          : `Already Verified`: "Select Token": "Storing.."}
        
      </button>

      <br></br>
        {isStoring.toString()}
        <div style={{"display": "flex", "flexDirection": "row", "justifyContent": "center", "alignItems": "flex-end", "bottom": "0em", "position" : "relative", "marginRight": "3em"}}>
          <div style={{"marginTop": "5em"}}>
            <div>
              <img src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + tokenId + ".png"} alt=""/>
            </div>
          </div>
            <div style={{"marginBottom": "50px"}}>{tokenId? 
              <div>
                <h3>
                Traits:
                </h3>
                <p> Background: {traits[1] != 7777 ? traits[1]:"None"}</p>
                <p> Body: {traits[2] != 7777 ? traits[2]:"None"}</p>
                <p> Familiar: {traits[3] != 7777 ? traits[3]:"None"}</p>
                <p> Head: {traits[4] != 7777 ? traits[4]:"None"}</p>
                <p> Prop: {traits[5] != 7777 ? traits[5]:"None"}</p>
                <p> Rune: {traits[6] != 7777 ? traits[6]:"None"}</p>
              </div>
              : ``}
            </div>
          </div>
    </div>
  );
};

export default TokenStorage;

import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
  } from 'ethereum-multicall';
  import { BaseProvider } from "@ethersproject/providers";
  import type { WizardStoragePlugin } from "../contracts/types";

export async function getTraitNames(plugin: WizardStoragePlugin, p: BaseProvider, traitIds: number[]) {
    
    const multicall = new Multicall({ ethersProvider: p, tryAggregate: true,multicallCustomContractAddress: '0x18cdb9593493f9867242022637e768073503f83d' });
  
      const contractCallContext: ContractCallContext[] = [
        {
            reference: 'WizardStoragePlugin',
            contractAddress: plugin.address,
            abi: [ { name: 'getTraitName', type: 'function', stateMutability: "view",inputs: [ { name: 'traitId', type: 'uint256' } ], outputs: [ { name: 'name', type: 'string' }] } ],
            calls: []
        },
    ];
    traitIds.forEach(traitId => {
      contractCallContext[0].calls.push({ reference: 'c'+traitId, methodName: 'getTraitName', methodParameters: [traitId] })
    });
    const results: ContractCallResults = await multicall.call(contractCallContext);
   
    let names = results.results["WizardStoragePlugin"].callsReturnContext.map(r => {
      if(r.methodParameters[0] > 341){
        return r.returnValues[0] == undefined ? " - ": "Aff:"+r.returnValues[0]
      }else{
        return r.returnValues[0]
      }
    })
  
    return names
  }
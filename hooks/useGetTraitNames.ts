import useSWR from "swr";
import type { WizardStoragePlugin } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";

import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';
import { ethers } from 'ethers';
import { useWeb3React} from "@web3-react/core";
import { BaseProvider } from "@ethersproject/providers";

function getTraitNames(plugin: WizardStoragePlugin, p: BaseProvider, traitIds: number[]) {
  return async (_: string) => {
    const multicall = new Multicall({ ethersProvider: p, tryAggregate: true });

    const contractCallContext: ContractCallContext[] = [
      {
          reference: 'WizardStoragePlugin',
          contractAddress: plugin.address,
          abi: [ { name: 'getTraitNames', type: 'function', inputs: [ { name: 'traitId', type: 'uint256' } ], outputs: [ { name: 'name', type: 'string' }] } ],
          calls: []
      },
  ];
  traitIds.forEach(traitId => {
    contractCallContext[0].calls.push({ reference: 'c'+traitId, methodName: 'getTraitNames', methodParameters: [traitId] })
  });
  const results: ContractCallResults = await multicall.call(contractCallContext);
  console.log(results)
  
    return results
  };
}

export default function useGetTraitNames(
  plugin: WizardStoragePlugin,
  traitIds: number[],
  suspense = false
){

  let {connector, provider} = useWeb3React()
  let p = provider as unknown as BaseProvider


  const shouldFetch =
  traitIds.length != 0 &&
    !!plugin;

  const result = useSWR(
    shouldFetch ? ["getTraitNames",plugin, p, traitIds] : null,
    getTraitNames(plugin, p, traitIds),
    {
      suspense,
    }
  );

  console.log(result)

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
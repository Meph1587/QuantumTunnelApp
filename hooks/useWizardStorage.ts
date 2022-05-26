import WizardStorage_ABI from "../contracts/WizardStorage.json";
import type { WizardStorage } from "../contracts/types";
import useContract from "./useContract";

export default function useStorageContract(tokenAddress?: string) {
  return useContract<WizardStorage>(tokenAddress, WizardStorage_ABI);
}

import { utils } from "@worldcoin/id";
import {
  solidityPack,
  defaultAbiCoder as abi,
} from "ethers/lib/utils";

export const encode = (userAddress: string, orbName: string): string => {
  if (!userAddress || !orbName) return "";

  return utils.worldIDHash(
    solidityPack(["address", "string"], [userAddress, orbName])
  ).digest;
};

export const decode = <T>(type: string, encodedString: string): T => {
  return abi.decode([type], encodedString)[0];
};

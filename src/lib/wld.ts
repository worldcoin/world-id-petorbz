import {
  solidityPack,
  solidityKeccak256,
  defaultAbiCoder as abi,
} from "ethers/lib/utils";

export const encode = (userAddress: string, orbName: string): string => {
  if (!userAddress || !orbName) return "";

  const rawDigest = (
    BigInt(
      solidityKeccak256(
        ["bytes"],
        [solidityPack(["address", "string"], [userAddress, orbName])]
      )
    ) >> BigInt(8)
  ).toString(16);

  return `0x${rawDigest.padStart(64, "0")}`;
};

export const decode = <T>(type: string, encodedString: string): T => {
  return abi.decode([type], encodedString)[0];
};

import { solidityPack, solidityKeccak256 } from "ethers/lib/utils";

export const encode = (userAddress: string, orbName: string): string => {
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

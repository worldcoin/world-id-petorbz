import { decode } from "@/lib/wld";
import PetOrbz from "@/abi/PetOrbz.json";
import { Contract, providers } from "ethers";
import { Relayer } from "defender-relay-client";
import { VerificationResponse } from "@worldcoin/id";
import { NextApiRequest, NextApiResponse } from "next";

type Request = {
  name: string;
  address: string;
  proof: VerificationResponse;
};

const relayer = new Relayer({
  apiKey: process.env.OZ_KEY,
  apiSecret: process.env.OZ_SECRET,
});

const contract = new Contract(
  process.env.NEXT_PUBLIC_PETORBZ_ADDR,
  PetOrbz,
  new providers.InfuraProvider(137, process.env.NEXT_PUBLIC_INFURA_ID)
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).end();

  const { address, name, proof }: Request = req.body;
  if (!address || !name || !proof) return res.status(400).end();

  const call = await contract.populateTransaction.adopt(
    address,
    name,
    decode<BigInt>("uint256", proof.merkle_root),
    decode<BigInt>("uint256", proof.nullifier_hash),
    decode<BigInt[]>("uint256[8]", proof.proof)
  );

  const tx = await relayer.sendTransaction({
    data: call.data,
    gasLimit: 500_000,
    to: process.env.NEXT_PUBLIC_PETORBZ_ADDR,
  });

  return res.status(200).send(tx.hash);
};

export default handler;

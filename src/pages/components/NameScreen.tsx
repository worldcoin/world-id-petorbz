import Icon from "./Icon";
import cn from "classnames";
import Button from "./Button";
import Header from "./Header";
import Footer from "./Footer";
import dynamic from "next/dynamic";
import { encode } from "@/lib/wld";
import PetOrbz from "@/abi/PetOrbz.json";
import { useAccount, useContractRead } from "wagmi";
import { VerificationResponse } from "@worldcoin/id";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
const WorldIDWidget = dynamic(
  () => import("@worldcoin/id").then((module) => module.WorldIDWidget),
  { ssr: false }
);

const NameScreen = () => {
  const { address } = useAccount();
  const [name, setName] = useState<string>("");
  const inputReference = useRef<HTMLInputElement>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [proof, setProof] = useState<VerificationResponse | null>(null);
  const { data: nextId } = useContractRead({
    chainId: 137,
    contractInterface: PetOrbz,
    functionName: "nextTokenId",
    addressOrName: process.env.NEXT_PUBLIC_PETORBZ_ADDR,
  });

  const mintOrb = useCallback(() => {
    setLoading(true);

    return fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({ address, name, proof }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => setLoading(false));
  }, [address, name, proof]);

  const handleOpenKeyboard = useCallback(() => {
    if (inputReference.current) inputReference.current.focus();
  }, []);

  // Handle keyboard to capture pet name
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (proof || e.ctrlKey || e.metaKey) return;
      if (e.key === "Backspace") return setName(name.slice(0, -1));
      if (e.key === "Delete") return setName(name.slice(1));

      if (e.key.length === 1 && e.key.match(/[\s\w._\-!?]/)) {
        setName((prevState) => {
          const newValue = prevState.length < 9 ? prevState + e.key : prevState;

          return newValue.replaceAll(/^\s/g, "").replaceAll(/\s+/g, " ");
        });
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [name, proof]);

  const [isClaimed, setIsClaimed] = useState(false);

  const handleVerify = useCallback((proof: VerificationResponse) => {
    setProof(proof);
  }, []);

  const handleClaim = useCallback(() => {
    if (!proof) return;

    mintOrb().then(() => setIsClaimed(true));
  }, [mintOrb, proof]);

  const signal = useMemo(() => encode(address, name), [address, name]);

  return (
    <>
      <div className="grid h-full pt-2 pb-2 md:pt-8 md:pb-12 grid-rows-auto/1fr/auto gap-y-3 md:gap-y-12">
        <Header className="gap-y-4.5">
          {proof && (
            <Button
              className={cn(
                "grid grid-flow-col gap-x-3 mt-5 items-center md:hidden bg-fff !backdrop-blur-none text-default",
                "font-semibold bg-transparent"
              )}
              variant="blurred-gradient"
              size="small"
            >
              <span className="relative w-6 h-6 rounded-full bg-217237">
                <Icon className="absolute inset-2" name="check" />
              </span>
              Verified with
              <Icon className="h-8 ml-6 w-9" noMask name="world-id" />
            </Button>
          )}

          <p
            className={cn(
              "mt-6 text-transparent md:mt-0 md:-translate-x-1/2 md:absolute md:left-1/2 text-32 bg-clip-text",
              "text-gradient-pink"
            )}
          >
            Adopt your PetOrb
          </p>
        </Header>

        <div
          className="relative grid items-start justify-items-center"
          onClick={handleOpenKeyboard}
        >
          <input ref={inputReference} className="absolute -top-[200vh]" />

          <span
            className={cn(
              "relative max-w-full px-5 md:px-16 overflow-hidden font-serif text-transparent text-gradient-dark",
              "bg-clip-text text-[60px] md:text-280 whitespace-nowrap"
            )}
          >
            {name || "Name me"}

            {!proof && (
              <Icon
                className={cn(
                  "text-ffffff absolute w-[9px] h-[46px] top-[18px] md:top-4 md:w-9 md:h-[200px] animate-pulse",
                  "duration-75",
                  { "left-0": name.length <= 0 },
                  { "left-full -translate-x-full": name.length > 0 }
                )}
                name="cursor"
              />
            )}
          </span>

          {name.length > 0 && nextId && (
            <span
              className={cn(
                "absolute top-0 md:-translate-x-full right-0 md:right-16 text-20b078 text-[24px] leading-[1.6]",
                "font-medium font-sans"
              )}
            >
              #{nextId.toString().padStart(3, "0")}
            </span>
          )}

          <img
            className={cn(
              "absolute -translate-x-1/2 top-12 md:top-1/4 left-1/2 bg-ffffff/02",
              { "top-20": proof }
            )}
            src="/images/pet.png"
            alt=""
          />
        </div>

        <div className="grid px-5 md:px-0 mb-[110px] md:mb-0 gap-y-3 md:place-self-end justify-items-stretch">
          {!proof && (
            <div
              className={`z-20 transition ${
                name.trim() === ""
                  ? "cursor-not-allowed pointer-events-none opacity-30"
                  : ""
              }`}
            >
              <WorldIDWidget
                // @ts-ignore
                signal={signal}
                enableTelemetry={true}
                onSuccess={handleVerify}
                advancedUseRawSignal={true}
                actionId={process.env.NEXT_PUBLIC_WLD_SIGNAL}
              />
            </div>
          )}

          {!isClaimed && (
            <Button
              className={cn(
                "text-[20px]",
                "!fixed bottom-0 left-0 right-0 z-10 rounded-bl-none rounded-br-none",
                "md:!relative rounded-bl-lg rounded-br-lg",
                {
                  "text-977cc0 cursor-not-allowed": !proof,
                  "animate-pulse cursor-wait pointer-events-none": isLoading,
                }
              )}
              variant={!proof ? "blurred" : "primary"}
              size="medium"
              onClick={handleClaim}
            >
              Complete Adoption
            </Button>
          )}

          {isClaimed && (
            <Button
              className={cn(
                "!fixed bottom-0 left-0 right-0 z-10 rounded-bl-none rounded-br-none",
                "md:!relative rounded-bl-lg rounded-br-lg"
              )}
              variant="blurred-success"
              size="medium"
            >
              Succesfully Claimed
            </Button>
          )}

          <Footer className="hidden mt-6 md:grid justify-self-center md:justify-self-end" />
        </div>
      </div>
    </>
  );
};

export default memo(NameScreen);

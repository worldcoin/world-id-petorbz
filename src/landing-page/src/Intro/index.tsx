import { Dispatch, memo, SetStateAction, useCallback } from "react";
import cn from "classnames";
import { ScreenType } from "../App";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { WalletConnect } from "./WalletConnect";

export const Intro = memo(function Intro(props: {
  setScreen: Dispatch<SetStateAction<ScreenType>>;
}) {
  const handleWalletConfirm = useCallback(
    () => props.setScreen("name"),
    [props]
  );

  return (
    <>
      <div className="h-full pt-2 md:pt-28 md:pb-12 grid md:grid-cols-[400px_auto] justify-between">
        <div className="grid grid-rows-auto place-items-center md:place-items-start gap-y-6">
          <div className="grid place-items-center md:place-items-start">
            <Header />

            <h1
              className={cn(
                "mt-6 md:mt-20 font-sans font-bold text-center text-gradient-pink text-40 md:text-72 md:text-left ",
                "text-transparent bg-clip-text"
              )}
            >
              Adopt a Pet Orb
            </h1>

            <p className="mt-6 text-center md:text-left text-22 text-c2a4e5">
              Meet Pet Orbz. They love to cuddle, and will protect you from
              sybil attacks. Five hundred of them are visiting ETH NYC, and need
              a loving home.
            </p>

            <img
              className="md:hidden drop-shadow-img"
              src="/images/pet.png"
              alt=""
            />

            <WalletConnect onConfirm={handleWalletConfirm} />
          </div>

          <Footer className="self-end" />
        </div>

        <img
          className="hidden md:block drop-shadow-img"
          src="/images/pet.png"
          alt=""
        />
      </div>
    </>
  );
});

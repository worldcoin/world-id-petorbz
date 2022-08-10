import cn from "classnames";
import Header from "./Header";
import Footer from "./Footer";
import { ScreenType } from "../index";
import ConnectWallet from "./ConnectWallet";
import { Dispatch, memo, SetStateAction, useCallback } from "react";

type Props = {
  setScreen: Dispatch<SetStateAction<ScreenType>>;
};

const IntroScreen = ({ setScreen }: Props) => {
  const handleWalletConfirm = useCallback(() => setScreen("name"), [setScreen]);

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
              sybil attacks. Five hundred of them are visiting ETHMexico and
              need a loving home.
            </p>

            <img
              className="md:hidden drop-shadow-img"
              src="/images/pet.png"
              alt=""
            />

            <ConnectWallet onConfirm={handleWalletConfirm} />
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
};

export default memo(IntroScreen);

import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import cn from "classnames";
import { ScreenType } from "../App";
import { Header } from "../common/Header";
import { Button } from "../common/Button";
import { Footer } from "../common/Footer";
import { WalletConnect } from "./WalletConnect";

export const Intro = memo(function Intro(props: {
  setScreen: Dispatch<SetStateAction<ScreenType>>;
}) {
  const [isModalOpened, setIsModalOpened] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = isModalOpened ? "hidden" : "";

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isModalOpened]);

  const handleOpenModal = useCallback(() => setIsModalOpened(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpened(false), []);
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
              Let’s adopt your own PetOrb
            </h1>

            <p className="mt-6 text-center md:text-left text-22 text-c2a4e5">
              Lorem ipsum, dolor sit amet, consectetur adipisicing elit.
            </p>

            <img
              className="md:hidden drop-shadow-img"
              src="/images/pet.png"
              alt=""
            />

            <Button onClick={handleOpenModal} size="large" className="md:mt-12">
              Connect Wallet to Claim
            </Button>
          </div>

          <Footer className="self-end" />
        </div>

        <img
          className="hidden md:block drop-shadow-img"
          src="/images/pet.png"
          alt=""
        />
      </div>
      
      <WalletConnect
        show={isModalOpened}
        requestClose={handleCloseModal}
        onConfirm={handleWalletConfirm}
      />
    </>
  );
});

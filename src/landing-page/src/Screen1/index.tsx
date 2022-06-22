import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import cn from "classnames";
import { ReactComponent as PetLogo } from "./../assets/images/petorbz.svg";
import { ReactComponent as WorldCoinLogo } from "./../assets/images/worldcoin.svg";

export const Screen1 = memo(function Screen1(props: {
  setScreen: Dispatch<SetStateAction<number>>;
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
  const handleSetNextScreen = useCallback(
    () => props.setScreen((p: number) => p + 1),
    [props]
  );

  return (
    <>
      <div className="col-start-2 mt-5 mb-12 md:mt-28 grid md:grid-cols-[400px_auto] justify-between">
        <div className="grid grid-rows-auto place-items-center md:place-items-start">
          <div className="grid place-items-center md:place-items-start">
            <PetLogo className="h-5 md:h-7" />

            <h1
              className={cn(
                "mt-6 font-mono font-bold text-center text-gradient-pink text-40 md:text-72 md:text-left md:mt-20",
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

            <button
              onClick={handleOpenModal}
              className={cn(
                "text-20 block bg-btn-solid rounded-lg px-12 py-8 md:mt-12 font-medium w-full md:w-auto whitespace-nowrap"
              )}
            >
              Connect Wallet to Claim
            </button>
          </div>

          <div className="grid self-end grid-cols-2 gap-3">
            <p className="text-13 text-c2a4e5">Powered by</p>
            <WorldCoinLogo className="h-3.5" />
          </div>
        </div>

        <img
          className="hidden md:block drop-shadow-img"
          src="/images/pet.png"
          alt=""
        />
      </div>

      {isModalOpened && (
        <div
          className="fixed inset-0 grid w-screen h-screen px-6 bg-1b0f2c/80 backdrop-blur-xl place-items-center"
          onClick={handleCloseModal}
        >
          <div className="grid w-full px-8 py-12 md:max-w-[440px] bg-1e1e23 rounded-2xl gap-y-6">
            <button
              className="px-12 py-8 rounded-lg bg-btn-solid text-20"
              onClick={handleSetNextScreen}
            >
              Process
            </button>
          </div>
        </div>
      )}
    </>
  );
});

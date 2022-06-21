import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import cn from "classnames";
import { Button } from "../common/Button";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { Icon } from "../common/Icon";
import { WorldcoinConnect } from "./WorldcoinConnect";

export const Name = memo(function Name() {
  const inputReference = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>("");

  const handleOpenKeyboard = useCallback(() => {
    if (inputReference.current) {
      inputReference.current.focus();
    }
  }, []);

  // Handle keyboard to capture pet name
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
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
  }, [name]);

  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  // Open connect on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsModalOpened(true);
    }
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpened(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpened(false);
  }, []);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
    setIsModalOpened(false);
  }, []);

  const handleClaim = useCallback(() => {
    if (!isConnected) {
      return;
    }

    setIsClaimed(true);
  }, [isConnected]);

  return (
    <Fragment>
      <div className="grid h-full pt-2 pb-2 md:pt-8 md:pb-12 grid-rows-auto/1fr/auto gap-y-3 md:gap-y-12">
        <Header className="gap-y-4.5">
          {isConnected && (
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

            <Icon
              className={cn(
                "text-ffffff absolute w-[9px] h-[46px] top-[18px] md:top-4 md:w-9 md:h-[200px] animate-pulse",
                "duration-75",
                { "left-0": name.length <= 0 },
                { "left-full -translate-x-full": name.length > 0 }
              )}
              name="cursor"
            />
          </span>

          {name.length > 0 && (
            <span
              className={cn(
                "absolute top-0 md:-translate-x-full right-0 md:right-16 text-20b078 text-[24px] leading-[1.6]",
                "font-medium font-sans"
              )}
            >
              #001
            </span>
          )}

          <img
            className={cn(
              "absolute -translate-x-1/2 top-12 md:top-1/4 left-1/2 bg-ffffff/02",
              { "top-20": isConnected }
            )}
            src="/images/pet.png"
            alt=""
          />
        </div>

        <div className="grid px-5 md:px-0 mb-[110px] md:mb-0 gap-y-3 md:place-self-end justify-items-stretch">
          {!isConnected && (
            <Button
              className="justify-center hidden grid-flow-col md:grid place-items-center auto-cols-min whitespace-nowrap"
              variant="blurred-gradient"
              size="medium"
              onClick={handleOpenModal}
            >
              <span className="w-5 h-5 rounded-full border-[2px] border-ffffff" />
              <span className="ml-3">I’m a unique person</span>
              <Icon className="w-10 h-10 ml-5" noMask name="world-id" />
            </Button>
          )}

          {!isClaimed && (
            <Button
              className={cn(
                "text-[20px]",
                "!fixed bottom-0 left-0 right-0 z-10 rounded-bl-none rounded-br-none",
                "md:!relative rounded-bl-lg rounded-br-lg", 
                {"cursor-default text-977cc0": !isConnected}
              )}
              variant={!isConnected ? "blurred" : "primary"}
              size="medium"
              onClick={handleClaim}
            >
              Claim my PetOrb
            </Button>
          )}

          <Button
            className="grid items-center justify-center grid-flow-col auto-cols-max gap-x-6 text-[18px]"
            variant="blurred-gradient-two"
            size="medium"
          >
            <Icon className="w-5 h-6" noMask name="share" />
            Share my NFT
          </Button>

          {isClaimed && (
            <Button
              className={cn(
                "!fixed bottom-0 left-0 right-0 z-10 rounded-bl-none rounded-br-none",
                "md:!relative rounded-bl-lg rounded-br-lg", 
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

      {isModalOpened && (
        <WorldcoinConnect
          show={isModalOpened}
          requestClose={handleCloseModal}
          onConfirm={handleConnect}
        />
      )}
    </Fragment>
  );
});

import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import cn from "classnames";
import { ReactComponent as PetLogo } from "./../assets/images/petorbz.svg";
import { ReactComponent as Cursor } from "./../assets/images/cursor.svg";
import { Button } from "../common/Button";

export const Screen2 = memo(function Screen2(props: {
  setScreen: Dispatch<SetStateAction<number>>;
}) {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    console.log(props);

    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Backspace") return setName(name.slice(0, -1));
      if (e.key === "Delete") return setName(name.slice(1));

      if (e.key.length === 1 && e.key.match(/[\s\w._\-!?]/)) {
        setName((prevState) =>
          prevState.length <= 9 ? prevState + e.key : prevState
        );
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  });

  return (
    <div className="grid items-start col-start-2 mt-8 grid-colums-[1fr_1fr_auto] mb-11">
      <div className="relative grid items-center py-5">
        <PetLogo />

        <p className="absolute text-transparent -translate-x-1/2 left-1/2 text-32 bg-clip-text text-gradient-pink">
          Adopt your PetOrb
        </p>
      </div>

      <div className="relative">
        <p
          className={cn(
            "relative inline pl-10 font-serif text-transparent text-gradient-dark bg-clip-text text-280 whitespace-nowrap"
          )}
        >
          {name || "Name me"}

          <Cursor
            className={cn("animate-pulse absolute top-[19px] left-0 h-50", {
              "left-auto -right-10": name.length > 0,
            })}
          />
        </p>

        <img
          className="absolute -translate-x-1/2 -translate-y-40 top-full left-1/2 bg-ffffff/02"
          src="/images/pet.png"
          alt=""
        />
      </div>

      <div className="place-self-end">
        <Button>I`m unique person</Button>
      </div>
    </div>
  );
});

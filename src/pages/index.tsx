import cn from "classnames";
import dynamic from "next/dynamic";
import IntroScreen from "./components/IntroScreen";
import { FC, memo, useEffect, useState } from "react";
const NameScreen = dynamic(() => import("./components/NameScreen"), {
  ssr: false,
});

export type ScreenType = "intro" | "name";

export const App: FC = () => {
  const [screen, setScreen] = useState<ScreenType>("intro");

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <main className="bg-1b0f2c grid grid-cols-1fr/minmax(0/360)/1fr px-6 text-ffffff h-screen overflow-hidden">
      <div className="z-10 col-start-2">
        {screen === "intro" && <IntroScreen setScreen={setScreen} />}
        {screen === "name" && <NameScreen />}
      </div>

      <div
        className={cn(
          "absolute inset-0 min-h-screen min-w-screen bg-[url(/images/lines.png)] mix-blend-lighten",
          "bg-[position:45%_-220%] bg-no-repeat md:bg-center md:bg-cover",
          "after:absolute after:inset-0 after:bg-[url(/images/wave.png)] after:mix-blend-lighten",
          "after:bg-[position:66%] md:after:bg-center after:bg-no-repeat after:bg-cover after:opacity-[64%]",
          { "opacity-50": screen !== "intro" }
        )}
      />
    </main>
  );
};

export default memo(App);

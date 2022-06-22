import { memo, useState } from "react";
import cn from "classnames";
import { Screen1 } from "./Screen1";
import { Screen2 } from "./Screen2";

export const App = memo(function App() {
  const [screen, setScreen] = useState(1);

  return (
    <main className="grid grid-cols-1fr/minmax(0/360)/1fr px-6 text-ffffff h-screen overflow-hidden">
      {screen === 1 && <Screen1 setScreen={setScreen} />}
      {screen === 2 && <Screen2 setScreen={setScreen} />}

      <div
        className={cn(
          "absolute inset-0 -z-10 min-h-screen min-w-screen bg-[url(/public/images/lines.png)] mix-blend-lighten",
          "bg-[position:45%_-220%] bg-no-repeat md:bg-center md:bg-cover",
          "after:absolute after:inset-0 after:bg-[url(/public/images/wave.png)] after:mix-blend-lighten",
          "after:bg-[position:66%] md:after:bg-center after:bg-no-repeat after:bg-cover "
        )}
      />
    </main>
  );
});

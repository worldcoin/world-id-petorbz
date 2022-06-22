import { memo, useEffect, useLayoutEffect, useRef } from "react";
import worldID, { VerificationResponse } from "@worldcoin/id";
import { useAccount } from "wagmi";
import { encode } from "./utils";

export const WorldcoinConnect = memo(function WorldcoinConnect(props: {
  name: string;
  className?: string;
  onConfirm: (proof: VerificationResponse) => void;
}) {
  const { data: account } = useAccount();
  const worldIdReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    worldID.enable().then(props.onConfirm);
  }, []);

  useLayoutEffect(() => {
    const options = {
      enable_telemetry: true,
      action_id: "wid_staging_fMY8wNIw2AKLjcb7tVyI",
      signal: encode(account?.address as string, props.name),
      advanced_use_raw_signal: true,
    };

    if (worldID.isInitialized()) worldID.update(options);
    else worldID.init(worldIdReference.current as HTMLElement, options);
  }, [account?.address, props.name]);

  return <div className={props?.className} ref={worldIdReference} />;
});

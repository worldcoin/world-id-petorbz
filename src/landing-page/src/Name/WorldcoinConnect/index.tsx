import { memo, useCallback, useLayoutEffect, useRef } from "react";
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

  const armWLDID = useCallback(() => {
    worldID.enable().then(props.onConfirm, armWLDID);
  }, [props.onConfirm]);

  useLayoutEffect(() => {
    const options = {
      enable_telemetry: true,
      action_id: process.env.REACT_APP_WLD_SIGNAL as string,
      signal: encode(account?.address as string, props.name),
      advanced_use_raw_signal: true,
    };

    if (worldID.isInitialized()) worldID.update(options);
    else worldID.init(worldIdReference.current as HTMLElement, options);

    if (!worldID.isEnabled()) armWLDID();
  }, [account?.address, props.name, armWLDID]);

  return <div className={props?.className} ref={worldIdReference} />;
});

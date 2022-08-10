import Button from "./Button";
import { useAccount } from "wagmi";
import { FC, memo, useEffect } from "react";
import { ConnectKitButton } from "connectkit";

type Props = { onConfirm: () => void };

const ConnectWallet: FC<Props> = ({ onConfirm }) => {
  const { address } = useAccount();

  useEffect(() => {
    if (!address) return;

    onConfirm();
  });

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show }) => {
        if (isConnected || isConnecting) return null;

        return (
          <Button onClick={show} size="large" className="md:mt-12">
            Connect wallet to adopt one
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default memo(ConnectWallet);

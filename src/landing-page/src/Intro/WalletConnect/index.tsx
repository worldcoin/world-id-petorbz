import { memo, useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../../common/Button";

export const WalletConnect = memo(function WalletConnect(props: {
  onConfirm: () => void;
}) {
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();

  useEffect(() => {
    if (!account?.address || !activeChain || activeChain.unsupported) return;

    props.onConfirm();
  });

  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, mounted }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button
                    onClick={openConnectModal}
                    size="large"
                    className="md:mt-12"
                  >
                    Connect wallet to adopt
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    size="large"
                    className="md:mt-12"
                  >
                    Wrong network
                  </Button>
                );
              }

              return null;
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
});

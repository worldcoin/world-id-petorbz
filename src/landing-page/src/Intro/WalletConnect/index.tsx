import { Fragment, memo, useEffect, useState } from "react";
import { Button } from "../../common/Button";
import { CopyButton } from "../../common/CopyButton";
import { Icon } from "../../common/Icon";
import { Modal } from "../../common/Modal";
import { CloseButton } from "../../common/Modal/CloseButton";

export const WalletConnect = memo(function WalletConnect(props: {
  show: boolean;
  requestClose: () => void;
  onConfirm: () => void;
}) {
  const [connected, setIsConnected] = useState(false);

  // FIXME: Simulate connect
  useEffect(() => {
    if (!props.show) return;
    let timer: NodeJS.Timeout;

    timer = setTimeout(() => {
      clearTimeout(timer);
      setIsConnected(true);
    }, 3500);

    return () => {
      setIsConnected(false)
      clearTimeout(timer);
    };
  }, [props.show]);

  // FIXME: Simulate accept
  useEffect(() => {
    if (!props.show || !connected) return;
    let timer: NodeJS.Timeout;

    timer = setTimeout(() => {
      clearTimeout(timer);
      props.requestClose();
      props.onConfirm();
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [connected, props]);

  return (
    <Modal
      className="grid w-full px-8 py-12 md:max-w-[440px] bg-1e1e23 rounded-2xl gap-y-6"
      requestClose={props.requestClose}
      show={props.show}
    >
      {!connected ? (
        <Fragment>
          <div className="grid grid-flow-col auto-cols-min items-center justify-between whitespace-nowrap gap-x-1.5">
            <span className="grid grid-flow-col gap-x-1.5">
              <Icon className="text-[#3b99fc] w-8 h-5" name="tmp-wallet" />
              <p className="text-ffffff">Wallet Connect</p>
            </span>

            <CloseButton onClick={props.requestClose} />
          </div>

          <div className="grid grid-flow-col-dense gap-x-2">
            <Button className="shadow-none" size="small">
              QR Code
            </Button>

            <Button className="bg-ffffff/[4%]" variant="simple" size="small">
              Wallet
            </Button>
          </div>

          <p className="text-[14px] text-c2a4e5 leading-[1]">
            Scan QR code with WalletConnect compatible wallet
          </p>

          <img src="/images/tmp-qr-1.png" alt="qr code" />

          {/* FIXME: provide real data */}
          <CopyButton data="qr code">Copy to clipboard</CopyButton>
        </Fragment>
      ) : (
        <Fragment>
          <div className="grid items-center justify-between grid-flow-col auto-cols-max">
            <Icon className="w-8 h-8 text-df57bc animate-spin" name="loader" />
            <CloseButton onClick={props.requestClose} />
          </div>

          <p className="text-ffffff text-[24px] leading-[1.3] font-sans font-medium">
            Waiting for confirmation
          </p>

          <p className="text-c2a4e5 leading-[1.2]">
            We’ve established a connection to your wallet, now please confirm
            the signature request.{" "}
          </p>
        </Fragment>
      )}
    </Modal>
  );
});

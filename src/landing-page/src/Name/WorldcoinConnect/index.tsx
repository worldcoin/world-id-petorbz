import { Fragment, memo, useCallback, useEffect, useState } from "react";
import { Button, Link } from "../../common/Button";
import { CopyButton } from "../../common/CopyButton";
import cn from "classnames";
import { Icon } from "../../common/Icon";
import { Modal } from "../../common/Modal";
import { CloseButton } from "../../common/Modal/CloseButton";

export const WorldcoinConnect = memo(function WorldcoinConnect(props: {
  show: boolean;
  requestClose: () => void;
  onConfirm: () => void;
}) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timer;

    timer = setTimeout(() => {
      clearTimeout(timer);
      setIsConfirmed(true);
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClickContinue = useCallback(() => {
    setIsConfirmed(false);
    props.onConfirm();
    props.requestClose();
  }, [props]);

  return (
    <Modal
      className="grid gap-y-6 md:max-w-[500px]"
      requestClose={props.requestClose}
      show={props.show}
    >
      {!isConfirmed ? (
        <Fragment>
          <div className="grid p-8 gap-y-5 bg-1e1e23 rounded-2xl">
            <div className="grid items-center justify-between grid-flow-col auto-cols-min">
              <Icon className="h-6 w-36 text-ffffff" name="worldcoin" />
              <CloseButton onClick={props.requestClose} />
            </div>

            <div className="grid gap-y-3 md:grid-cols-[1fr_auto]">
              <div className="contents md:grid justify-items-start gap-y-3">
                <p
                  className={cn(
                    "text-[24px] leading-[1.2] font-sans font-bold text-transparent bg-clip-text text-gradient-purple"
                  )}
                >
                  Prove your <br /> unique-humanness with WorldID.
                </p>

                <p className="text-c2a4e5 text-[14px] leading-[1.2]">
                  Scan or copy this QR code with your phone’s camera or
                  Worldcoin mobile app.
                </p>

                {/* FIXME: provide real qr code */}
                <CopyButton
                  className="order-last md:justify-self-start"
                  data="qr code"
                >
                  Copy to clipboard
                </CopyButton>
              </div>

              <div className="p-2.5 place-self-center md:place-self-start">
                <img src="/images/tmp-qr-2.png" alt="scan qr code" />
              </div>
            </div>
          </div>

          <div className="grid p-8 gap-y-8 bg-1e1e23 rounded-2xl">
            <p className="font-sans font-bold text-ffffff text-20">
              Don’t have the Worldcoin app yet?
            </p>

            <div className="grid md:grid-cols-[1fr_auto] gap-y-4 gap-x-14">
              <p className="text-c2a4e5 text-[14px] leading-[1.2]">
                Proving unique-humanness through biometrics, without intruding
                privacy.
              </p>

              {/* FIXME: Provide real link */}
              <Link
                className="place-self-center"
                variant="rounded"
                size="small"
                href="#"
              >
                Install Now
              </Link>
            </div>
          </div>
        </Fragment>
      ) : (
        <div className="grid px-12 py-8 text-center bg-1e1e23 rounded-2xl justify-items-center gap-y-4">
          <Icon className="h-6 w-36 text-ffffff" name="worldcoin" />

          <span className="relative grid w-20 h-20 mt-8 rounded-full place-items-center bg-5e54ff text-ffffff">
            <Icon className="absolute inset-6" name="check" />
          </span>

          <p className="text-transparent text-gradient-purple bg-clip-text text-[24px] leading-[1]">
            Identity Confirmed!
          </p>

          <p className="px-12 text-c2a4e5 text-[14px] leading-[1.2]">
            Yay! Your identity has been successfully confirmed. You can start
            using your WorldID.
          </p>

          <Button className='!shadow-none' size="small" onClick={handleClickContinue}>
            Continue
          </Button>
        </div>
      )}
    </Modal>
  );
});

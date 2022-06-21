import {
  memo,
  MouseEventHandler,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import cn from "classnames";

export const Modal = memo(function Modal(props: {
  children?: ReactNode;
  className?: string;
  requestClose: () => void;
  show: boolean;
}): ReactPortal | null {
  const modalRoot = document.querySelector("#modal-root");

  useEffect(() => {
    if (!modalRoot || !props.show) {
      return;
    }

    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.requestClose();
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [modalRoot, props]);

  const bodyReference = useRef<HTMLDivElement>(null);

  const handleClickOverlay = useCallback<MouseEventHandler>(
    (e) => {
      if (
        !bodyReference.current ||
        bodyReference.current.contains(e.target as Node)
      ) {
        return;
      }

      props.requestClose();
    },
    [props]
  );

  if (!modalRoot || !props.show) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid w-screen h-screen px-6 bg-1b0f2c/80 backdrop-blur-xl place-items-center"
      onClick={handleClickOverlay}
    >
      <div
        className={cn("relative max-w-full md:max-w-[440px]", props.className)}
        ref={bodyReference}
      >
        {props.children}
      </div>
    </div>,
    modalRoot
  );
});

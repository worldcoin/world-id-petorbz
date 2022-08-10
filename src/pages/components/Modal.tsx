import cn from "classnames";
import { createPortal } from "react-dom";
import {
  FC,
  memo,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useRef,
} from "react";

type Props = PropsWithChildren<{
  show: boolean;
  className?: string;
  children?: ReactNode;
  requestClose: () => void;
}>;

export const Modal: FC<Props> = ({
  show,
  className,
  children,
  requestClose,
}): ReactPortal | null => {
  const modalRoot = document.body;

  useEffect(() => {
    if (!modalRoot || !show) return;

    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [modalRoot, show, requestClose]);

  const bodyReference = useRef<HTMLDivElement>(null);

  const handleClickOverlay = useCallback<MouseEventHandler>(
    (e) => {
      if (
        !bodyReference.current ||
        bodyReference.current.contains(e.target as Node)
      ) {
        return;
      }

      requestClose();
    },
    [requestClose]
  );

  if (!modalRoot || !show) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid w-screen h-screen px-6 bg-1b0f2c/80 backdrop-blur-xl place-items-center"
      onClick={handleClickOverlay}
    >
      <div
        className={cn("relative max-w-full md:max-w-[440px]", className)}
        ref={bodyReference}
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default memo(Modal);

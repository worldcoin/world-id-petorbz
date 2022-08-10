import Icon from "./Icon";
import cn from "classnames";
import Button from "./Button";
import {
  FC,
  Fragment,
  memo,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from "react";

type Props = PropsWithChildren<{
  className?: string;
  copiedChildren?: ReactNode;
  data: string;
}>;

const CopyButton: FC<Props> = ({
  data,
  children,
  className,
  copiedChildren,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (window.navigator.clipboard) {
      window.navigator.clipboard.writeText(data);
    }

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [data]);

  return (
    <Button
      className={cn(
        "grid items-center grid-flow-col gap-x-2 justify-self-center bg-ffffff/[4%] rounded-lg hover:opacity-70 transition-opacity",
        className
      )}
      variant="simple"
      size="small"
      onClick={handleCopy}
    >
      {!copied
        ? children ?? "Copy"
        : copiedChildren ?? (
            <Fragment>
              <span className="grid p-1 rounded-full bg-08955a">
                <Icon className="w-2 h-2 text-ffffff" name="check" />
              </span>
              Copied!
            </Fragment>
          )}
    </Button>
  );
};

export default memo(CopyButton);

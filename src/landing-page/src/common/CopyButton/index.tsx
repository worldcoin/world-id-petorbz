import { Fragment, memo, ReactNode, useCallback, useState } from "react";
import { Button } from "../Button";
import cn from "classnames";
import { Icon } from "../Icon";

export const CopyButton = memo(function CopyButton(props: {
  className?: string;
  children?: ReactNode;
  copiedChildren?: ReactNode;
  data: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (window.navigator.clipboard) {
      window.navigator.clipboard.writeText(props.data);
    }

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [props.data]);

  return (
    <Button
      className={cn(
        "grid items-center grid-flow-col gap-x-2 justify-self-center bg-ffffff/[4%] rounded-lg hover:opacity-70 transition-opacity",
        props.className
      )}
      variant="simple"
      size="small"
      onClick={handleCopy}
    >
      {!copied ? (
        props.children ?? "Copy"
      ) : props.copiedChildren ?? (
        <Fragment>
          <span className="grid p-1 rounded-full bg-08955a">
            <Icon className="w-2 h-2 text-ffffff" name="check" />
          </span>
          
          Copied!
        </Fragment>
      )}
    </Button>
  );
});

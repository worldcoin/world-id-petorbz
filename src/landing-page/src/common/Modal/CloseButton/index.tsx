import { memo } from "react";
import { Button } from "../../Button";
import cn from "classnames";
import { Icon } from "../../Icon";

export const CloseButton = memo(function CloseButton(props: {
  className?: string;
  onClick: () => void;
}) {
  return (
    <Button
      className={cn(
        "grid p-3.5 border border-[#bbbec7] rounded-lg hover:bg-ffffff hover:border-ffffff hover:text-current transition-colors",
        props.className
      )}
      variant="simple"
      onClick={props.onClick}
    >
      <Icon className="w-[9px] h-[9px]" name="cross" />
    </Button>
  );
});

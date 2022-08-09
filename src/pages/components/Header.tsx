import Icon from "./Icon";
import cn from "classnames";
import { FC, memo, PropsWithChildren } from "react";

type Props = PropsWithChildren<{ className?: string }>;

const Header: FC<Props> = ({ className, children }) => {
  return (
    <div
      className={cn("grid place-items-center md:place-items-start", className)}
    >
      <Icon className="w-[150px] h-8 text-ffffff" name="logo" />
      {children}
    </div>
  );
};

export default memo(Header);

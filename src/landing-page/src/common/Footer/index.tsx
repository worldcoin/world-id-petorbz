import { memo } from "react";
import cn from "classnames";
import { Icon } from '../Icon';

export const Footer = memo(function Footer(props: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", props.className)}>
      <p className="text-13 text-c2a4e5">Powered by</p>
      <Icon className="text-ffffff" name="worldcoin"/>
    </div>
  );
});
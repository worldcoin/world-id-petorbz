import Icon from "./Icon";
import cn from "classnames";
import { memo } from "react";

const Footer = (props: { className?: string }) => (
  <a
    href="https://worldcoin.org/"
    target="_blank"
    className={cn("grid grid-cols-2 gap-3", props.className)}
    rel="noreferrer"
  >
    <p className="text-13 text-c2a4e5">Powered by</p>
    <Icon className="text-ffffff" name="worldcoin" />
  </a>
);

export default memo(Footer);

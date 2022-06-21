import { CSSProperties, memo } from "react";
import cn from "classnames";
import './styles.css'

const iconNames = [
  "check",
  "cross",
  "cursor",
  "loader",
  "logo",
  "share",
  "tmp-wallet",
  "world-id",
  "worldcoin",
] as const;

export type IconType = typeof iconNames[number];

export const Icon = memo(function Icon(
  props: {
    className?: string;
    noMask?: boolean;
    testId?: string;
  } & (
    | {
        name: IconType;
        path?: never;
      }
    | {
        name?: never;
        path: string;
      }
  )
) {
  return (
    <span
    className={cn(
      "icon inline-block pointer-events-none",

      {
        "bg-current": !props.noMask,
        "no-mask": props.noMask,
      },

      props.className
    )}
    {...(props.testId && { "data-testid": props.testId })}
    role="icon"
    style={
      {
        "--image": `url("${props.path ?? `/icons/${props.name}.svg`}")`,
      } as CSSProperties
    }
  />
  );
});

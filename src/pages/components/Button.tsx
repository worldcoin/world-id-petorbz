import cn from "classnames";
import {
  FC,
  memo,
  ReactNode,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";

type ButtonBaseProps = {
  children?: ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
  variant?:
    | "simple"
    | "primary"
    | "blurred"
    | "blurred-gradient"
    | "blurred-gradient-two"
    | "blurred-success"
    | "rounded";
};

type LinkProps = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

const getClassNames = ({
  variant = "primary",
  size = "medium",
  className,
}: ButtonBaseProps) => {
  return cn(
    //common
    "text-center leading-[1.2] text-ffffff font-sans",

    //size
    { "px-12 py-8": size === "large" },
    { "p-6": size === "medium" },
    { "px-8 py-4": size === "small" },

    //variant
    variant === "primary" &&
      `rounded-lg bg-[linear-gradient(257.03deg,_#f66651_-13.93%,_#6448e7_119.81%)]
        shadow-[0px_4px_24px] shadow-641e82/80 [background-size:100%] hover:[background-size:200%] transition-all
        duration-[.35s]`,

    variant.startsWith("blurred") &&
      `rounded-xl bg-ffffff/[4%] relative backdrop-blur-sm md:backdrop-blur-2xl before:absolute before:inset-0 before:p-px
        before:rounded-xl before:border-gradient
        hover:bg-ffffff/[5%] transition-colors duration-[.35s]
        before:[background-size:100%] hover:before:[background-size:200%] before:transition-all before:duration-[.45s]`,

    variant === "blurred-gradient" &&
      `before:bg-gradient-to-l before:from-f66651 before:to-6448e7`,

    variant === "blurred-gradient-two" &&
      `rounded-md before:rounded-md before:bg-gradient-to-tr before:from-b954f5 before:via-transparent  before:to-ca74fe/30`,

    variant === "blurred-success" &&
      `rounded-md bg-105f48/60 border border-21725a hover:bg-105f48/[50%] transition-colors`,

    variant === "rounded" &&
      `relative rounded-full before:rounded-full before:absolute before:inset-0 before:p-px before:rounded-xl
        before:border-gradient before:bg-gradient-to-l before:from-f66651 before:to-6448e7
        before:[background-size:100%] hover:before:[background-size:200%] before:transition-all before:duration-[.45s]`,

    className
  ).replaceAll(/\s+/g, " ");
};

export const Link = memo(({ children, ...props }: LinkProps) => (
  <a {...props} className={getClassNames(props)}>
    {children}
  </a>
));
Link.displayName = "Link";

const Button: FC<ButtonProps> = ({
  size,
  variant,
  className,
  children,
  ...restProps
}) => (
  <button
    {...restProps}
    className={getClassNames({ size, variant, className })}
  >
    {children}
  </button>
);

export default memo(Button);

import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  memo,
  ReactNode,
} from "react";
import cn from "classnames";

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

const getClassNames = (props: ButtonBaseProps) => {
  const variant = props.variant || "primary";
  const size = props.size || "medium";

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

    // from props
    props.className
  ).replaceAll(/\s+/g, " ");
};

export const Link = memo(function Link(props: LinkProps) {
  return (
    <a {...props} className={getClassNames(props)}>
      {props.children}
    </a>
  );
});

export const Button = memo(function Button(props: ButtonProps) {
  const { size, variant, className, ...restProps } = props;

  return (
    <button
      {...restProps}
      className={getClassNames({ size, variant, className })}
    >
      {props.children}
    </button>
  );
});

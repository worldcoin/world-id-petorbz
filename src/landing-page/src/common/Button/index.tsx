import { memo, ReactNode } from "react";
import cn from "classnames";

export const Button = memo(function Button(props: {
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "disabled"
    | "success"
    | "rounded";
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      className={cn(
        "text-center px-6 py-8 btn-gradient-two rounded-1.5 backdrop-blur-32",
        {
          "bg-[linear-gradient(257.03deg,_#F66651_-13.93%,_#6448E7_119.81%)]":
            props.variant === "primary",
        },
        { "rounded-lg": props.variant === "secondary" },
        { "rounded-xl": props.variant === "tertiary" },
        { "rounded-xl": props.variant === "disabled" },
        { "rounded-xl": props.variant === "success" },
        { "rounded-full": props.variant === "rounded" },
        props.className
      )}
    >
      {props.children}
    </button>
  );
});

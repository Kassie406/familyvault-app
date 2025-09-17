import clsx from "clsx";
import { PropsWithChildren, HTMLAttributes } from "react";

const base =
  "relative rounded-2xl border border-white/8 " +
  "bg-gradient-to-b from-[#0b0b0e] to-[#0e0e14] " +
  "shadow-[0_10px_28px_rgba(0,0,0,.45)] " +
  "transition-all duration-200 " +
  "hover:border-white/12 hover:shadow-[0_16px_40px_rgba(0,0,0,.55)]";

export function Card({
  className,
  children,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={clsx(base, className)} {...rest}>
      {children}
    </div>
  );
}
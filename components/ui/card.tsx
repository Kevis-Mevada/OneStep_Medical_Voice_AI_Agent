import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h2
      className={cn("text-lg font-semibold text-slate-900", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: CardProps) {
  return (
    <p
      className={cn("text-sm text-slate-600 leading-relaxed", className)}
      {...props}
    />
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const Eyebrow = React.forwardRef<HTMLSpanElement, EyebrowProps>(
  ({ className, children, ...props }, ref) => (
    <span 
      ref={ref} 
      className={cn("eyebrow", className)} 
      {...props}
    >
      {children}
    </span>
  )
);
Eyebrow.displayName = "Eyebrow";

export { Eyebrow };
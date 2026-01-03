import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ className, children, ...props }, ref) => (
    <span 
      ref={ref} 
      className={cn("gradient-text", className)} 
      {...props}
    >
      {children}
    </span>
  )
);
GradientText.displayName = "GradientText";

export { GradientText };
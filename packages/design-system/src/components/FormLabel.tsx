import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FormLabel = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1",
          className
        )}
        {...props}
      />
    );
  }
);
FormLabel.displayName = "FormLabel";

export { FormLabel }; 
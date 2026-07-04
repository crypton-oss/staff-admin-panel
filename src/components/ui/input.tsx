import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  endAdornment?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, endAdornment, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-zinc-500/40",
            icon && "pl-10",
            endAdornment && "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
            {endAdornment}
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }

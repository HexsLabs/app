import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-neutral-900 to-neutral-950 text-neutral-100 shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-neutral-800 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:border-neutral-700 hover:from-neutral-800 hover:to-neutral-900 active:from-neutral-950 active:to-neutral-900",
        gradient: "bg-gradient-to-r from-neutral-900 to-neutral-950 text-neutral-100 shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-neutral-800 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:border-neutral-700 hover:from-neutral-800 hover:to-neutral-900 active:from-neutral-950 active:to-neutral-900",
        destructive:
          "bg-destructive/90 text-destructive-foreground shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:bg-destructive hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]",
        outline:
          "border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm text-neutral-100 hover:bg-neutral-900/50 hover:border-neutral-700 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]",
        secondary:
          "bg-neutral-900/80 backdrop-blur-sm text-neutral-100 border border-neutral-800 hover:bg-neutral-800/80 hover:border-neutral-700",
        ghost: "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50",
        link: "text-neutral-100 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-11 rounded-xl px-8",
        xl: "h-12 rounded-2xl px-8 py-2.5 text-lg font-medium tracking-wide",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
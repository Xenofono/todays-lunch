import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// shadcn Button, restyled for the Lunchbladet broadsheet: tracked uppercase
// Archivo labels, flat ink, 2px radius, no shadows. Labels are plain text.
const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 font-bold tracking-[.16em] whitespace-nowrap transition-colors disabled:cursor-default disabled:opacity-70",
  {
    variants: {
      variant: {
        ink: "rounded-[2px] bg-foreground text-background hover:bg-primary",
        outline: "rounded-[2px] border border-foreground text-foreground hover:bg-foreground hover:text-background",
        pill: "rounded-full border border-border text-foreground hover:bg-foreground hover:text-background",
        kicker: "text-muted-foreground hover:text-primary",
      },
      // size sets font size and line height together: a leading-* in the base would be
      // dropped by tailwind-merge in cn(), since a later text-* overrides it
      size: {
        default: "px-[18px] py-3 text-[11px]/6",
        sm: "px-3.5 py-[7px] text-[11px]/6",
        lg: "px-5 py-[13px] text-[12px]/6",
        inline: "p-0 text-[10px]/6",
      },
    },
    defaultVariants: {
      variant: "ink",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button }

import { cn } from "@/lib/utils"

// Lunchbladet: flat hairline bars, radius 0 (design/README.md, loading skeleton)
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse bg-hairline", className)}
      {...props}
    />
  )
}

export { Skeleton }

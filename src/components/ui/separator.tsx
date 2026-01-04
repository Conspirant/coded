import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "relative shrink-0",
        orientation === "horizontal"
          ? "h-[1px] w-full before:absolute before:inset-0 before:bg-border after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-white/5"
          : "w-[1px] h-full before:absolute before:inset-0 before:bg-border after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-white/5",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

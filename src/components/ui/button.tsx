import * as React from 'react'
import { Slot as SlotPrimitive } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/40 focus-visible:ring-[3px] tracking-tight",
  {
    variants: {
      variant: {
        default:
          "text-white shadow-[0_18px_40px_rgba(37,99,235,0.2)] [background:linear-gradient(120deg,var(--bluegreen-emerald),var(--bluegreen-azure),var(--bluegreen-dusk))] hover:brightness-110 focus-visible:ring-blue-300/60",
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          "border border-transparent [background:linear-gradient(#fff,#fff),linear-gradient(135deg,var(--bluegreen-emerald),var(--bluegreen-azure))] bg-origin-border bg-clip-padding text-slate-900 hover:text-slate-900/90 dark:[background:linear-gradient(#0f172a,#0f172a),linear-gradient(135deg,var(--bluegreen-emerald),var(--bluegreen-azure))] dark:text-white",
        muted:
          'bg-white/70 text-slate-700 hover:bg-white/90 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20',
        ghost:
          'text-blue-700 hover:bg-white/60 hover:text-blue-900 dark:text-emerald-200 dark:hover:bg-white/10',
        link: 'text-blue-600 underline-offset-4 hover:text-emerald-500 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2.5 has-[>svg]:px-4',
        sm: 'h-8 rounded-full gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-12 rounded-full px-7 has-[>svg]:px-5 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? SlotPrimitive.Root : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

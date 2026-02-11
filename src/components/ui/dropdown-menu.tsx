"use client";

import * as React from "react";
import { DropdownMenu as RadixDropdownMenu } from "radix-ui";

import { cn } from "@/lib/utils";

const DropdownMenu = RadixDropdownMenu.Root;
const DropdownMenuTrigger = RadixDropdownMenu.Trigger;

const DropdownMenuContent = React.forwardRef<
   React.ComponentRef<typeof RadixDropdownMenu.Content>,
   React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
   <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
         ref={ref}
         sideOffset={sideOffset}
         className={cn(
            "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
         )}
         {...props}
      />
   </RadixDropdownMenu.Portal>
));
DropdownMenuContent.displayName = RadixDropdownMenu.Content.displayName;

const DropdownMenuItem = React.forwardRef<
   React.ComponentRef<typeof RadixDropdownMenu.Item>,
   React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item> & {
      inset?: boolean;
   }
>(({ className, inset, ...props }, ref) => (
   <RadixDropdownMenu.Item
      ref={ref}
      className={cn(
         "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
         inset && "pl-8",
         className,
      )}
      {...props}
   />
));
DropdownMenuItem.displayName = RadixDropdownMenu.Item.displayName;

const DropdownMenuSeparator = React.forwardRef<
   React.ComponentRef<typeof RadixDropdownMenu.Separator>,
   React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator>
>(({ className, ...props }, ref) => (
   <RadixDropdownMenu.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
   />
));
DropdownMenuSeparator.displayName = RadixDropdownMenu.Separator.displayName;

export {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
};

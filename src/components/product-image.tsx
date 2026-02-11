"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
   src: string;
   alt: string;
   className?: string;
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
   const [hasError, setHasError] = useState(false);

   if (hasError || !src) {
      return (
         <div
            className={cn(
               "flex items-center justify-center rounded bg-muted text-muted-foreground",
               className,
            )}
         >
            <ImageOff className="size-5" />
         </div>
      );
   }

   return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
         src={src}
         alt={alt}
         className={cn("rounded object-cover", className)}
         onError={() => setHasError(true)}
      />
   );
}

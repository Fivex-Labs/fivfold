"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Click the image to open a large view. Use with static files under `public/`.
 * For arbitrary dimensions, native img avoids Next/Image layout requirements.
 */
export function ZoomableDocImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className={cn(
            "max-h-[92vh] w-[min(96vw,1400px)] max-w-[min(96vw,1400px)] overflow-auto border border-white/15 bg-zinc-950 p-3 sm:max-w-[min(96vw,1400px)]"
          )}
        >
          <DialogTitle className="sr-only">{alt} (enlarged)</DialogTitle>
          {/* User-supplied diagram assets — dimensions vary */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="mx-auto h-auto max-h-[85vh] w-full max-w-full object-contain"
          />
        </DialogContent>
      </Dialog>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative w-full cursor-zoom-in overflow-hidden rounded-lg border border-white/15 bg-black/40 outline-none transition hover:border-white/25 focus-visible:ring-2 focus-visible:ring-brand-secondary/60",
          className
        )}
        aria-label={`Enlarge diagram: ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="mx-auto max-h-[min(24rem,50vh)] w-full object-contain"
        />
        <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-xs text-white/95 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Click to zoom
        </span>
      </button>
    </>
  );
}

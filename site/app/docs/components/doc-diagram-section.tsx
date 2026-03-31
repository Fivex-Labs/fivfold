import * as React from "react";
import { ZoomableDocImage } from "./zoomable-doc-image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function DiagramImagePlaceholder({
  publicPathExample,
  className,
}: {
  /** Shown in the box so authors know where to drop the file */
  publicPathExample: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-white/20 bg-white/[0.03] px-6 py-10 text-center",
        className
      )}
    >
      <ImageIcon className="h-10 w-10 text-white/35" aria-hidden />
      <p className="max-w-md text-sm text-white/65">
        Add your exported diagram PNG (or WebP) under{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-brand-secondary">
          site/public{publicPathExample}
        </code>{" "}
        and set the matching <code className="rounded bg-white/10 px-1 font-mono text-xs">imageSrc</code> constant in{" "}
        <code className="rounded bg-white/10 px-1 font-mono text-xs">stripe-diagram-assets.ts</code>. The preview below will
        become clickable to zoom.
      </p>
    </div>
  );
}

export function DocDiagramSection({
  id,
  title,
  description,
  imageSrc,
  imageAlt,
  publicPathExample,
  className,
}: {
  id: string;
  title: string;
  description?: React.ReactNode;
  /** Public URL path, e.g. /docs/kits/stripe/payment-intents-sequence.png — or null for placeholder */
  imageSrc: string | null;
  imageAlt: string;
  /** Example path after public/, e.g. /docs/kits/stripe/payment-intents-sequence.png */
  publicPathExample: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6",
        className
      )}
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description ? (
          <div className="text-sm leading-relaxed text-white/75">{description}</div>
        ) : null}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/45">Figure</p>
        {imageSrc ? (
          <ZoomableDocImage src={imageSrc} alt={imageAlt} />
        ) : (
          <DiagramImagePlaceholder publicPathExample={publicPathExample} />
        )}
      </div>
    </section>
  );
}

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Media Uploader Kit",
  description:
    "Direct-to-cloud uploads with presign, finalize, accessUrl, and audit-only database rows. UI + API for S3, Azure Blob, GCS, Cloudinary, and Dropbox.",
  openGraph: {
    title: "Media Uploader Kit | FivFold",
    description:
      "Direct-to-cloud uploads with presign, finalize, accessUrl, and audit-only database rows. UI + API for S3, Azure Blob, GCS, Cloudinary, and Dropbox.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Uploader Kit | FivFold",
    description:
      "Direct-to-cloud uploads with presign, finalize, accessUrl, and audit-only database rows. UI + API for S3, Azure Blob, GCS, Cloudinary, and Dropbox.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/kits/media-uploader",
  },
}

export default function MediaUploaderKitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

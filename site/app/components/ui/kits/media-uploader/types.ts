export type DirectUploadInstruction =
  | {
      kind: "http-put"
      url: string
      method?: "PUT" | "POST"
      headers?: Record<string, string>
    }
  | {
      kind: "post-multipart"
      url: string
      fields: Record<string, string>
    }

export interface PresignResponse {
  uploadSessionId: string
  upload: DirectUploadInstruction
}

export interface FinalizeUploadPayload {
  uploadSessionId: string
  outcome: "success" | "failure"
  failureReason?: string
  storageHttpStatus?: number
}

export type FinalizeUploadResult =
  | { success: true; accessUrl: string; auditId: string }
  | { success: false; error: string }

export interface TrackedFile {
  id: string
  file: File
  status: "queued" | "presigning" | "uploading" | "finalizing" | "done" | "error"
  progress: number
  accessUrl?: string
  error?: string
}

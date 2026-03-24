import type { DirectUploadInstruction } from "./types"

/**
 * Upload file bytes directly to object storage using presign / multipart instructions.
 * Uses XHR for reliable upload progress.
 */
export function uploadToDirectStorage(
  file: File,
  instruction: DirectUploadInstruction,
  onProgress: (percent: number) => void,
  options?: { simulate?: boolean }
): Promise<void> {
  if (options?.simulate) {
    return (async () => {
      for (let p = 0; p <= 100; p += 9) {
        await new Promise((r) => setTimeout(r, 45))
        onProgress(Math.min(100, p))
      }
      onProgress(100)
    })()
  }

  return new Promise((resolve, reject) => {
    if (instruction.kind === "http-put") {
      const xhr = new XMLHttpRequest()
      xhr.open(instruction.method ?? "PUT", instruction.url)
      for (const [k, v] of Object.entries(instruction.headers ?? {})) {
        xhr.setRequestHeader(k, v)
      }
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.min(100, Math.round((100 * e.loaded) / e.total)))
        }
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress(100)
          resolve()
        } else {
          reject(new Error(`Storage upload failed: HTTP ${xhr.status}`))
        }
      }
      xhr.onerror = () => reject(new Error("Network error during upload"))
      xhr.send(file)
      return
    }

    const fd = new FormData()
    for (const [k, v] of Object.entries(instruction.fields)) {
      fd.append(k, v)
    }
    fd.append("file", file)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", instruction.url)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.min(100, Math.round((100 * e.loaded) / e.total)))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100)
        resolve()
      } else {
        reject(new Error(`Storage upload failed: HTTP ${xhr.status}`))
      }
    }
    xhr.onerror = () => reject(new Error("Network error during upload"))
    xhr.send(fd)
  })
}

/** Run async tasks with max concurrency (1 = sequential). */
export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = new Array(tasks.length)
  let next = 0
  const workers = Math.min(Math.max(1, concurrency), tasks.length)

  async function worker(): Promise<void> {
    while (true) {
      const i = next++
      if (i >= tasks.length) break
      results[i] = await tasks[i]!()
    }
  }

  await Promise.all(Array.from({ length: workers }, () => worker()))
  return results
}

/* Cloudinary unsigned upload.
 *
 * SETUP (one-time, in your Cloudinary dashboard):
 *   1. Copy your **Cloud name** (Dashboard → top of the page).
 *   2. Settings (gear) → Upload → Upload presets → Add upload preset →
 *      set **Signing Mode = Unsigned** → Save. Copy the preset **name**.
 *   3. Paste both below.
 *
 * Unsigned uploads are safe to run from the browser: the preset name is public
 * and can only create uploads (no delete/admin access, no API secret exposed).
 * Optionally restrict the preset to an "Allowed formats" / folder in Cloudinary.
 */
export const CLOUDINARY = {
  cloudName: "e7fw2vvs",
  uploadPreset: "shanzster_unsigned",
};

export function cloudinaryConfigured(): boolean {
  const { cloudName, uploadPreset } = CLOUDINARY;
  return (
    !!cloudName &&
    !!uploadPreset &&
    cloudName !== "REPLACE_WITH_CLOUD_NAME" &&
    uploadPreset !== "REPLACE_WITH_UNSIGNED_PRESET"
  );
}

/** Upload a file (image or video) to Cloudinary; resolves to the secure URL. */
export async function uploadToCloudinary(file: File): Promise<string> {
  if (!cloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured — set cloudName and uploadPreset in src/lib/cloudinary.ts");
  }
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY.uploadPreset);

  // `auto` lets one endpoint accept images and videos.
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/auto/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json())?.error?.message ?? "";
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Upload failed (${res.status})`);
  }

  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error("Upload succeeded but no URL was returned.");
  return data.secure_url;
}

/**
 * Given a Cloudinary PDF URL, return a JPEG URL for page 1.
 * Cloudinary serves this natively — no extra API call needed.
 *
 * e.g. https://res.cloudinary.com/e7fw2vvs/image/upload/v123/file.pdf
 *   →  https://res.cloudinary.com/e7fw2vvs/image/upload/pg_1,f_jpg,q_80,w_800/v123/file.pdf
 *
 * Falls back to the original URL if it doesn't look like a Cloudinary PDF.
 */
export function cloudinaryPdfThumbnail(pdfUrl: string): string {
  if (!pdfUrl) return pdfUrl;
  // Only transform Cloudinary-hosted PDFs
  if (!pdfUrl.includes("res.cloudinary.com")) return pdfUrl;
  // Insert transformation flags after /upload/
  return pdfUrl.replace("/upload/", "/upload/pg_1,f_jpg,q_80,w_800/");
}

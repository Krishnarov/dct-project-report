import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "general";
    const publicId = formData.get("publicId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadOptions = {
      folder: `student-portal/${folder}`,
      ...(publicId && { public_id: publicId }), // For updates
      overwrite: !!publicId, // Allow overwriting existing files
      invalidate: true // Refresh CDN cache
    };

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ 
      url: (result as any).secure_url,
      public_id: (result as any)?.public_id,
      original_filename: (result as any)?.original_filename
    });
  } catch (err) {
  console.error("Upload error:", err);
  return NextResponse.json(
    { 
      error: "Upload failed", 
      details: err instanceof Error ? err.message : "Unknown error occurred"
    }, 
    { status: 500 }
  );
}
}
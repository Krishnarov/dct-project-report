// import { NextRequest, NextResponse } from "next/server";
// import cloudinary from "@/lib/cloudinary";

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get("file") as File;

//   if (!file) {
//     return NextResponse.json({ error: "No file provided" }, { status: 400 });
//   }

//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   try {
//     const res = await new Promise((resolve, reject) => {
//         // student_projects
//       cloudinary.uploader.upload_stream({ folder: "college-logos" }, (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }).end(buffer);
//     });

//     return NextResponse.json({ url: (res as any).secure_url , public_id: (res as any)?.public_id});
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import cloudinary from "@/lib/cloudinary";

// export async function POST(req: NextRequest) {
//   try {
//     const { file, folder } = await req.json();
    
//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     // Remove the data:image/...;base64, prefix if present
//     const base64Data = file.replace(/^data:\w+\/\w+;base64,/, '');
//     const buffer = Buffer.from(base64Data, 'base64');

//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { folder: `student-portal/${folder}` },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result);
//         }
//       ).end(buffer);
//     });

//     return NextResponse.json({ 
//       url: (result as any).secure_url,
//       public_id: (result as any)?.public_id
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Upload failed" }, 
//       { status: 500 }
//     );
//   }
// }



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
      { error: "Upload failed", details: err.message }, 
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StudentForm from "@/models/StudentForm";
import { NextRequest } from "next/server";
import cloudinary from "@/lib/cloudinary";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const student = await StudentForm.findById(params.id);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { id } = params;
  const body = await req.json();

  const updated = await StudentForm.findByIdAndUpdate(id, body, { new: true });

  if (!updated) {
    return Response.json({ message: "Student not found" }, { status: 404 });
  }

  return Response.json({
    message: "Student updated successfully",
    student: updated,
  });
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { id } = params;
  const student = await StudentForm.findById(id);

  if (!student) {
    return Response.json({ message: "Student not found" }, { status: 404 });
  }
  // Delete collegeLogo
  const collegeLogoId = student.collegeInfo?.collegeLogo?.public_id;
  if (collegeLogoId) {
    try {
      await cloudinary.uploader.destroy(collegeLogoId);
    } catch (error) {
      console.error("Error deleting college logo from Cloudinary:", error);
    }
  }

  // Delete uiScreenshots
  const uiScreenshots = student.projectAssets?.uiScreenshots || [];
  for (const img of uiScreenshots) {
    if (img.public_id) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (err) {
        console.error("Cloudinary delete error (uiScreenshot):", err);
      }
    }
  }

  // Delete dfdDiagram
  const dfdId = student.projectAssets?.dfdDiagram?.public_id;
  if (dfdId) {
    try {
      await cloudinary.uploader.destroy(dfdId);
    } catch (err) {
      console.error("Cloudinary delete error (dfdDiagram):", err);
    }
  }
  // Delete erDiagram
  const erId = student.projectAssets?.erDiagram?.public_id;
  if (erId) {
    try {
      await cloudinary.uploader.destroy(erId);
    } catch (err) {
      console.error("Cloudinary delete error (erDiagram):", err);
    }
  }

  // Delete student from DB
  await StudentForm.findByIdAndDelete(id);

  if (!student) {
    return Response.json({ message: "Student not found" }, { status: 404 });
  }

  return Response.json({ message: "Student deleted successfully" });
}

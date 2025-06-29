import connectDB from "@/lib/db";
import StudentForm from "@/models/StudentForm";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  const { status } = await req.json();

  if (!["new", "accept", "reject"].includes(status)) {
    return Response.json({ message: "Invalid status" }, { status: 400 });
  }

  const updated = await StudentForm.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updated) {
    return Response.json({ message: "Student not found" }, { status: 404 });
  }

  return Response.json({ message: "Status updated successfully", student: updated });
}

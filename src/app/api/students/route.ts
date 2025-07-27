import connectDB from "@/lib/db";
import StudentForm from "@/models/StudentForm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let filter = {};
  if (status) {
    filter = { status };
  }

  try {
    const students = await StudentForm.find(filter).sort({ createdAt: -1 });
    return Response.json({ students });
  } catch (error) {
    return Response.json({ message: "Error fetching students" }, { status: 500 });
  }
}

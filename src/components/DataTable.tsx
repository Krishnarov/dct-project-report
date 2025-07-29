"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Student {
  _id: string;
  personalDetails?: {
    name: string;
    email: string;
    phone: string;
    enrollmentNumber?: string;
  };
  collegeInfo?:{
    collegeName:string;
  }
  status?: string;
  projectId?:string;
}

export default function DataTable({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/students?status=${status}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch students");
        return res.json();
      })
      .then((data) => {
        setStudents(data.students || []);
        setError("");
      })
      .catch(() => {
        setError("Failed to load students. Please try again.");
        setStudents([]);
      })
      .finally(() => setLoading(false));
  }, [status]);

  const filteredStudents = students.filter(
    (s) =>
      s.personalDetails?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.projectId || s.personalDetails?.phone
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setStudents(students.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete student");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/students/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      setStudents(students.filter((s) => s._id !== id));
    } catch {
      alert("Failed to update status");
    }
  };


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...{" "}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow rounded">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <input
          placeholder="Search by name or enrollment"
          className="border p-2 rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 border">Project_Id</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Collage Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td className="p-2 border">
                  {student?.projectId || "NA"}
                </td>
                <td className="p-2 border">
                  {student.personalDetails?.name || "-"}
                </td>
                <td className="p-2 border">
                  {student.collegeInfo?.collegeName || "-"}
                </td>
                <td className="p-2 border">
                  {student.personalDetails?.phone || "-"}
                </td>
                <td className="p-2 border space-x-2">
                  <Link href={`/dashboard/view/${student._id}`}>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                  </Link>
                  {status === "reject" && (
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                  {status === "new" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(student._id, "accept")
                        }
                        className="bg-purple-500 text-white px-2 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(student._id, "reject")
                        }
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {status === "accept" && (
                    <>
                      <Link
                        href={`/dashboard/pdf/${student._id}`}
                        target="_blank"
                      >
                        <button className="bg-green-500 text-white px-2 py-1 rounded">
                          PDF
                        </button>
                      </Link>
                      <button
                        onClick={() =>
                          handleStatusChange(student._id, "reject")
                        }
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

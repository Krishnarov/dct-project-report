// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";

// interface Student {
//   _id: string;
//   isPrint: number;
//   personalDetails?: {
//     name: string;
//     email: string;
//     phone: string;
//     enrollmentNumber?: string;
//   };
//   collegeInfo?:{
//     collegeName:string;
//   }
//   status?: string;
//   projectId?:string;
// }

// export default function DataTable({
//   title,
//   status,
// }: {
//   title: string;
//   status: string;
// }) {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingbtn, setLoadingbtn] = useState("");
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     setLoading(true);
//     fetch(`/api/students?status=${status}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch students");
//         return res.json();
//       })
//       .then((data) => {
//         setStudents(data.students || []);
//         setError("");
//       })
//       .catch(() => {
//         setError("Failed to load students. Please try again.");
//         setStudents([]);
//       })
//       .finally(() => setLoading(false));
//   }, [status]);

//   const filteredStudents = students.filter(
//     (s) =>
//       s.personalDetails?.name?.toLowerCase().includes(search.toLowerCase()) ||
//       s.projectId || s.personalDetails?.phone
//         ?.toLowerCase()
//         .includes(search.toLowerCase())
//   );

//   const handleDelete = async (id: string) => {
//     setLoadingbtn(`delete-${id}`)
//     if (!confirm("Are you sure you want to delete this student?")) return;

//     try {
//       const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Delete failed");
//       setStudents(students.filter((s) => s._id !== id));
//     } catch {
//       alert("Failed to delete student");
//     }
//     setLoadingbtn("")
//   };

//   const handleStatusChange = async (id: string, newStatus: string) => {
//     setLoadingbtn(`${newStatus}-${id}`)
//     try {
//       const res = await fetch(`/api/students/${id}/status`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (!res.ok) throw new Error("Status update failed");
//       setStudents(students.filter((s) => s._id !== id));
//     } catch {
//       alert("Failed to update status");
//     }
//      setLoadingbtn("")
//   };


//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         Loading...{" "}
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   if (error) return <div className="p-4 text-red-500">{error}</div>;

//   return (
//     <div className="bg-white dark:bg-gray-800 p-4 shadow rounded">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-bold">{title}</h2>
//         <input
//           placeholder="Search by name or enrollment"
//           className="border p-2 rounded w-60"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full border">
//           <thead className="bg-gray-100 dark:bg-gray-800">
//             <tr>
//               <th className="p-2 border w-[10%]">Project_Id</th>
//               <th className="p-2 border w-[12%]">Name</th>
//               <th className="p-2 border w-[40%]">Collage Name</th>
//               <th className="p-2 border w-[10%]">Phone</th>
//               <th className="p-2 border w-[28%]">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredStudents.map((student) => (
//               <tr key={student._id}>
//                 <td className="p-2 border w-[10%]">
//                   {student?.projectId || "NA"}
//                 </td>
//                 <td className="p-2 border w-[20%]">
//                   {student.personalDetails?.name || "-"}
//                 </td>
//                 <td className="p-2 border w-[40%]">
//                   {student.collegeInfo?.collegeName || "-"}
//                 </td>
//                 <td className="p-2 border w-[10%]">
//                   {student.personalDetails?.phone || "-"}
//                 </td>
//                 <td className="p-2 border space-x-2 w-[20%]">
//                   <Link href={`/dashboard/view/${student._id}`}>
//                     <button onClick={()=>setLoadingbtn(student._id)} className="bg-blue-500 text-white px-2 py-1 rounded">
//                        {loadingbtn === student._id ? "Edit...":"Edit"}
//                     </button>
//                   </Link>
//                   {status === "reject" && (
//                     <button
//                       onClick={() => handleDelete(student._id)}
//                       className="bg-red-500 text-white px-2 py-1 rounded"
//                     >
//                        {loadingbtn === `delete-${student._id}` ? "Deleteing...":"Delete"}
//                     </button>
//                   )}
//                   {status === "new" && (
//                     <>
//                       <button
//                         onClick={() =>
//                           handleStatusChange(student._id, "accept")
//                         }
//                         className="bg-purple-500 text-white px-2 py-1 rounded"
//                       >
//                          {loadingbtn === `accept-${student._id}` ? "Accepting...":"Accept"}
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleStatusChange(student._id, "reject")
//                         }
//                         className="bg-yellow-500 text-white px-2 py-1 rounded"
//                       >
//                         {loadingbtn === `reject-${student._id}` ? "Rejecting...":"Reject"}
//                       </button>
//                     </>
//                   )}
//                   {status === "accept" && (
//                     <>
//                       <Link
//                         href={`/dashboard/pdf/${student._id}`}
//                         target="_blank"
//                       >
//                         <button className="bg-green-500 text-white px-2 py-1 rounded ">
//                           PDF <span className="text-xs font-bold bg-green-300 text-orange-600 rounded-full z-10 px-1  ">{student?.isPrint}</span>
//                         </button>
//                       </Link>
//                       <button
//                         onClick={() =>
//                           handleStatusChange(student._id, "reject")
//                         }
//                         className="bg-yellow-500 text-white px-2 py-1 rounded"
//                       >
//                          {loadingbtn === `reject-${student._id}` ? "Rejecting...":"Reject"}
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleStatusChange(student._id, "isSendToPrint")
//                         }
//                         className="bg-yellow-500 text-white px-2 py-1 rounded"
//                       >
//                          {loadingbtn === `isSendToPrint-${student._id}` ? "SentToPrint...":"SentToPrint"}
//                       </button>
//                     </>
//                   )}
//                   {status === "isSendToPrint" && (
//                     <>
//                       <Link
//                         href={`/dashboard/pdf/${student._id}`}
//                         target="_blank"
//                       >
//                         <button className="bg-green-500 text-white px-2 py-1 rounded ">
//                           PDF <span className="text-xs font-bold bg-green-300 text-orange-600 rounded-full z-10 px-1  ">{student?.isPrint}</span>
//                         </button>
//                       </Link>
//                       <button
//                         onClick={() =>
//                           handleStatusChange(student._id, "reject")
//                         }
//                         className="bg-yellow-500 text-white px-2 py-1 rounded"
//                       >
//                          {loadingbtn === `reject-${student._id}` ? "Rejecting...":"Reject"}
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleStatusChange(student._id, "isSendToStudent")
//                         }
//                         className="bg-yellow-500 text-white px-2 py-1 rounded"
//                       >
//                          {loadingbtn === `isSendToStudent-${student._id}` ? "SendToStudent...":"SendToStudent"}
//                       </button>
//                     </>
//                   )}
//                   {status === "isSendToStudent" && (
//                     <>
//                       <Link
//                         href={`/dashboard/pdf/${student._id}`}
//                         target="_blank"
//                       >
//                         <button className="bg-green-500 text-white px-2 py-1 rounded ">
//                           PDF <span className="text-xs font-bold bg-green-300 text-orange-600 rounded-full z-10 px-1  ">{student?.isPrint}</span>
//                         </button>
//                       </Link>
//                       <button
//                         onClick={() =>
//                           handleStatusChange(student._id, "reject")
//                         }
//                         className="bg-yellow-500 text-white px-2 py-1 rounded"
//                       >
//                          {loadingbtn === `reject-${student._id}` ? "Rejecting...":"Reject"}
//                       </button>
//                       {/* <button
//                         onClick={() =>
//                           handleStatusChange(student._id, "isSendToStudent")
//                         }
//                         className="bg-yellow-500 text-white px-2 py-1 rounded"
//                       >
//                          {loadingbtn === `isSendToStudent-${student._id}` ? "SendToStudent...":"SendToStudent"}
//                       </button> */}
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//             {filteredStudents.length === 0 && (
//               <tr>
//                 <td colSpan={5} className="text-center p-4 text-gray-500">
//                   No students found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiX, FiPrinter, FiEdit, FiTrash2, FiCheck, FiXCircle, FiSend, FiUser, FiCalendar } from "react-icons/fi";

interface Student {
  _id: string;
  isPrint: number;
  createdAt: string;
  personalDetails?: {
    name: string;
    email: string;
    phone: string;
    enrollmentNumber?: string;
  };
  collegeInfo?: {
    collegeName: string;
  };
  status?: string;
  projectId?: string;
}

interface FilterOptions {
  search: string;
  college: string;
  dateFrom: string;
  dateTo: string;
  prints: string;
}

interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
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
  const [loadingbtn, setLoadingbtn] = useState("");
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: "",
    college: "",
    dateFrom: "",
    dateTo: "",
    prints: "all"
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "createdAt",
    direction: "desc"
  });

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

  // Get unique college names for filter dropdown
  const collegeOptions = useMemo(() => {
    const colleges = students
      .map(s => s.collegeInfo?.collegeName)
      .filter((college): college is string => !!college);
    return Array.from(new Set(colleges));
  }, [students]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = [...students];
    
    // Apply filters
    if (filterOptions.search) {
      const searchTerm = filterOptions.search.toLowerCase();
      result = result.filter(s => 
        s.personalDetails?.name?.toLowerCase().includes(searchTerm) ||
        s.projectId?.toLowerCase().includes(searchTerm) ||
        s.personalDetails?.phone?.toLowerCase().includes(searchTerm) ||
        s.personalDetails?.enrollmentNumber?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filterOptions.college) {
      result = result.filter(s => 
        s.collegeInfo?.collegeName === filterOptions.college
      );
    }
    
    if (filterOptions.dateFrom) {
      const fromDate = new Date(filterOptions.dateFrom);
      result = result.filter(s => new Date(s.createdAt) >= fromDate);
    }
    
    if (filterOptions.dateTo) {
      const toDate = new Date(filterOptions.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(s => new Date(s.createdAt) <= toDate);
    }
    
    if (filterOptions.prints !== "all") {
      if (filterOptions.prints === "printed") {
        result = result.filter(s => s.isPrint > 0);
      } else if (filterOptions.prints === "not_printed") {
        result = result.filter(s => s.isPrint === 0);
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortOptions.field) {
        case "name":
          aValue = a.personalDetails?.name || "";
          bValue = b.personalDetails?.name || "";
          break;
        case "college":
          aValue = a.collegeInfo?.collegeName || "";
          bValue = b.collegeInfo?.collegeName || "";
          break;
        case "projectId":
          aValue = a.projectId || "";
          bValue = b.projectId || "";
          break;
        case "prints":
          aValue = a.isPrint;
          bValue = b.isPrint;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a[sortOptions.field as keyof Student] || "";
          bValue = b[sortOptions.field as keyof Student] || "";
      }
      
      if (sortOptions.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return result;
  }, [students, filterOptions, sortOptions]);

  const handleDelete = async (id: string) => {
    setLoadingbtn(`delete-${id}`)
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setStudents(students.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete student");
    }
    setLoadingbtn("")
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingbtn(`${newStatus}-${id}`)
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
     setLoadingbtn("")
  };

  const handleSort = (field: string) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setFilterOptions({
      search: "",
      college: "",
      dateFrom: "",
      dateTo: "",
      prints: "all"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="p-4 text-red-500 bg-red-50 rounded-md">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              value={filterOptions.search}
              onChange={(e) => setFilterOptions({...filterOptions, search: e.target.value})}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-white"
          >
            <FiFilter /> Filters
            {Object.values(filterOptions).some(val => val !== "" && val !== "all") && (
              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {Object.values(filterOptions).filter(val => val !== "" && val !== "all").length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">College</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
              value={filterOptions.college}
              onChange={(e) => setFilterOptions({...filterOptions, college: e.target.value})}
            >
              <option value="">All Colleges</option>
              {collegeOptions.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                value={filterOptions.dateFrom}
                onChange={(e) => setFilterOptions({...filterOptions, dateFrom: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                value={filterOptions.dateTo}
                onChange={(e) => setFilterOptions({...filterOptions, dateTo: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Print Status</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
              value={filterOptions.prints}
              onChange={(e) => setFilterOptions({...filterOptions, prints: e.target.value})}
            >
              <option value="all">All</option>
              <option value="printed">Printed</option>
              <option value="not_printed">Not Printed</option>
            </select>
          </div>
          
          <div className="md:col-span-2 lg:col-span-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              <FiX /> Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer"
                onClick={() => handleSort("projectId")}
              >
                <div className="flex items-center gap-1">
                  Project ID
                  {sortOptions.field === "projectId" ? (
                    sortOptions.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />
                  ) : <FiChevronDown className="opacity-30" />}
                </div>
              </th>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  {sortOptions.field === "name" ? (
                    sortOptions.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />
                  ) : <FiChevronDown className="opacity-30" />}
                </div>
              </th>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer"
                onClick={() => handleSort("college")}
              >
                <div className="flex items-center gap-1">
                  College
                  {sortOptions.field === "college" ? (
                    sortOptions.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />
                  ) : <FiChevronDown className="opacity-30" />}
                </div>
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Phone
              </th>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Registered
                  {sortOptions.field === "createdAt" ? (
                    sortOptions.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />
                  ) : <FiChevronDown className="opacity-30" />}
                </div>
              </th>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer"
                onClick={() => handleSort("prints")}
              >
                <div className="flex items-center gap-1">
                  Prints
                  {sortOptions.field === "prints" ? (
                    sortOptions.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />
                  ) : <FiChevronDown className="opacity-30" />}
                </div>
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {filteredStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3 text-sm text-gray-800 dark:text-white">
                  {student?.projectId || "NA"}
                </td>
                <td className="p-3 text-sm font-medium text-gray-800 dark:text-white">
                  {student.personalDetails?.name || "-"}
                </td>
                <td className="p-3 text-sm text-gray-800 dark:text-white">
                  {student.collegeInfo?.collegeName || "-"}
                </td>
                <td className="p-3 text-sm text-gray-800 dark:text-white">
                  {student.personalDetails?.phone || "-"}
                </td>
                <td className="p-3 text-sm text-gray-800 dark:text-white">
                  {formatDate(student.createdAt)}
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                    student.isPrint > 0 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}>
                    {student.isPrint}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/dashboard/view/${student._id}`}>
                      <button 
                        onClick={() => setLoadingbtn(student._id)} 
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-sm"
                        disabled={loadingbtn === student._id}
                      >
                        <FiEdit size={14} />
                        {loadingbtn === student._id ? "..." : "Edit"}
                      </button>
                    </Link>
                    
                    {status === "reject" && (
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm"
                        disabled={loadingbtn === `delete-${student._id}`}
                      >
                        <FiTrash2 size={14} />
                        {loadingbtn === `delete-${student._id}` ? "..." : "Delete"}
                      </button>
                    )}
                    
                    {status === "new" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(student._id, "accept")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md text-sm"
                          disabled={loadingbtn === `accept-${student._id}`}
                        >
                          <FiCheck size={14} />
                          {loadingbtn === `accept-${student._id}` ? "..." : "Accept"}
                        </button>
                        <button
                          onClick={() => handleStatusChange(student._id, "reject")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md text-sm"
                          disabled={loadingbtn === `reject-${student._id}`}
                        >
                          <FiXCircle size={14} />
                          {loadingbtn === `reject-${student._id}` ? "..." : "Reject"}
                        </button>
                      </>
                    )}
                    
                    {status === "accept" && (
                      <>
                        <Link href={`/dashboard/pdf/${student._id}`} target="_blank">
                          <button className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-md text-sm">
                            <FiPrinter size={14} />
                            PDF
                          </button>
                        </Link>
                        <button
                          onClick={() => handleStatusChange(student._id, "reject")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md text-sm"
                          disabled={loadingbtn === `reject-${student._id}`}
                        >
                          <FiXCircle size={14} />
                          {loadingbtn === `reject-${student._id}` ? "..." : "Reject"}
                        </button>
                        <button
                          onClick={() => handleStatusChange(student._id, "isSendToPrint")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md text-sm"
                          disabled={loadingbtn === `isSendToPrint-${student._id}`}
                        >
                          <FiSend size={14} />
                          {loadingbtn === `isSendToPrint-${student._id}` ? "..." : "To Print"}
                        </button>
                      </>
                    )}
                    
                    {status === "isSendToPrint" && (
                      <>
                        <Link href={`/dashboard/pdf/${student._id}`} target="_blank">
                          <button className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-md text-sm">
                            <FiPrinter size={14} />
                            PDF
                          </button>
                        </Link>
                        <button
                          onClick={() => handleStatusChange(student._id, "reject")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md text-sm"
                          disabled={loadingbtn === `reject-${student._id}`}
                        >
                          <FiXCircle size={14} />
                          {loadingbtn === `reject-${student._id}` ? "..." : "Reject"}
                        </button>
                        <button
                          onClick={() => handleStatusChange(student._id, "isSendToStudent")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md text-sm"
                          disabled={loadingbtn === `isSendToStudent-${student._id}`}
                        >
                          <FiUser size={14} />
                          {loadingbtn === `isSendToStudent-${student._id}` ? "..." : "To Student"}
                        </button>
                      </>
                    )}
                    
                    {status === "isSendToStudent" && (
                      <>
                        <Link href={`/dashboard/pdf/${student._id}`} target="_blank">
                          <button className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-md text-sm">
                            <FiPrinter size={14} />
                            PDF
                          </button>
                        </Link>
                        <button
                          onClick={() => handleStatusChange(student._id, "reject")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md text-sm"
                          disabled={loadingbtn === `reject-${student._id}`}
                        >
                          <FiXCircle size={14} />
                          {loadingbtn === `reject-${student._id}` ? "..." : "Reject"}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FiFilter className="text-4xl text-gray-300 mb-2" />
                    <p>No students found matching your filters.</p>
                    {Object.values(filterOptions).some(val => val !== "" && val !== "all") && (
                      <button
                        onClick={clearFilters}
                        className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredStudents.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      )}
    </div>
  );
}
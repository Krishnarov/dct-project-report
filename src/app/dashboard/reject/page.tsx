"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoginPage from "@/components/login";
import DataTable from "@/components/DataTable";
// interface Student {
//   _id: string;
//   personalDetails?: {
//     name: string;
//     email: string;
//     phone: string;
//     enrollmentNumber?: string;
//   };
//   status?: string;
// }

export default function NewStudent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") setIsLoggedIn(true);
  }, []);

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={() => {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 space-y-4">
        <h2 className="text-xl font-bold text-center mb-4">Dashboard</h2>
        <nav className="space-y-2">
          <Link
            href={"/dashboard"}
            className={`block w-full text-left p-2 rounded hover:bg-gray-200 hover:dark:bg-gray-400`}
          >
            Dashboard
          </Link>
          <Link
            href={"/dashboard/new"}
            className={`block w-full text-left p-2 rounded hover:bg-gray-200 hover:dark:bg-gray-400`}
          >
            New
          </Link>
          <Link
            href={"/dashboard/accept"}
            className={`block w-full text-left p-2 rounded hover:bg-gray-200  hover:dark:bg-gray-400`}
          >
            Accepted
          </Link>
          <Link
            href={"/dashboard/reject"}
            className={`block w-full text-left p-2 rounded hover:bg-gray-200 bg-gray-200 dark:bg-gray-400 hover:dark:bg-gray-400`}
          >
            Rejected
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              setIsLoggedIn(false);
            }}
            className="block w-full text-left p-2 rounded hover:bg-red-100 text-red-600"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <DataTable title="Rejected Students" status="reject" />
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoginPage from "@/components/login";
import DashboardChart from "@/components/DashboardChart";
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

export default function StudentDashboard() {
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 space-y-4">
        <h2 className="text-xl font-bold text-center mb-4">Dashboard</h2>
        <nav className="space-y-2">
          <Link
            href={"/dashboard"}
            className={`block w-full text-left p-2 rounded hover:bg-gray-200 bg-gray-200`}
          >
            Dashboard
          </Link>
          <Link
            href={"/dashboard/new"}
            className={`block w-full text-left p-2 rounded hover:bg-gray-200`}
          >
            New
          </Link>
          <Link
            href={"/dashboard/accept"}
            className={`block w-full text-left p-2 rounded hover:bg-gray-200  `}
          >
            Accepted
          </Link>
          <Link
            href={"/dashboard/reject"}
            className={`block w-full text-left p-2 rounded hover:bg-gray-200 `}
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

        <DashboardChart />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 shadow rounded text-center">
            <h3 className="text-lg font-bold">New</h3>
            <DashboardCount status="new" />
          </div>
          <div className="bg-white p-6 shadow rounded text-center">
            <h3 className="text-lg font-bold">Accepted</h3>
            <DashboardCount status="accept" />
          </div>
          <div className="bg-white p-6 shadow rounded text-center">
            <h3 className="text-lg font-bold">Rejected</h3>
            <DashboardCount status="reject" />
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCount({ status }: { status: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`/api/students/count?status=${status}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch((err) => console.error("Error fetching count:", err));
  }, [status]);

  return <p className="text-3xl mt-2">{count}</p>;
}

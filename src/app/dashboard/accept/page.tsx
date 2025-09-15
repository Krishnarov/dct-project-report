"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoginPage from "@/components/login";
import DataTable from "@/components/DataTable";
import DashboardLayout from "@/components/Dashboardlayout";
interface Student {
  _id: string;
  personalDetails?: {
    name: string;
    email: string;
    phone: string;
    enrollmentNumber?: string;
  };
  status?: string;
}

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
    <DashboardLayout>
      <DataTable title="Accepted Students" status="accept" />
    </DashboardLayout>
  );
}

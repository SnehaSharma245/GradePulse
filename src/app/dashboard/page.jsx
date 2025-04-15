"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const renderDashboardContent = () => {
    switch (session.user.role) {
      case "student":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Welcome, {session.user.name}!</h3>
              <p className="mt-2 text-gray-600">This is your student dashboard. Here you can view your courses, grades, and other student-related information.</p>
            </div>
          </div>
        );
      case "teacher":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Welcome, {session.user.name}!</h3>
              <p className="mt-2 text-gray-600">This is your teacher dashboard. Here you can manage your courses, students, and grades.</p>
            </div>
          </div>
        );
      case "institute":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Institute Dashboard</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Welcome, {session.user.name}!</h3>
              <p className="mt-2 text-gray-600">This is your institute dashboard. Here you can manage your institute's information, teachers, and students.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
} 
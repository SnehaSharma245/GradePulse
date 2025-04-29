"use client";

import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-spin-slow flex items-center justify-center">
          <Loader className="w-8 h-8 text-white" />
        </div>
        {/* Loading Text */}
        <p className="text-gray-700 text-lg font-medium">
          Loading... Please wait
        </p>
      </div>
    </div>
  );
}

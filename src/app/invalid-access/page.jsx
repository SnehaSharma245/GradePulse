"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

function InvalidAccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-lg text-center"
      >
        <div className="flex flex-col items-center">
          <div className="bg-purple-100 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-purple-900 mt-4">
            Access Denied
          </h1>
          <p className="text-purple-700 mt-2">
            Oops! You don’t have the necessary permissions to access this page.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/")}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            Go Back to Homepage
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default InvalidAccess;

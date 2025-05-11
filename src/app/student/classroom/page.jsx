import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

function Page() {
  const options = [
    {
      title: "View Syllabus",
      link: "/syllabus",
    },
    {
      title: "Test Yourself",
      link: "/test-yourself",
    },
    {
      title: "View Assignments",
      link: "/assignments",
    },
    {
      title: "Analyze Your Progress",
      link: "/analyze-progress",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 space-y-12 px-6 ">
      <h1 className="text-4xl font-bold text-purple-800 mt-24">Classroom</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {options.map((option, index) => (
          <Card
            key={index}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow card-hover"
          >
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                {option.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {/* You can modify this text based on your needs */}
                Click to view {option.title}.
              </p>
              <Link href={option.link}>
                <Button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
                  Go to {option.title}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Page;

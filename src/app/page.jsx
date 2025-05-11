"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  BookOpen,
  Brain,
  Clock,
  Shield,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();

  const handleNavigation = (route) => {
    if (route === pathname) {
      return;
    }
    setLoading(true);
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Transform Education with GradePulse
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The next-generation student progress tracking platform for modern
              educational institutions
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={"/register"}
                onClick={() => handleNavigation("/register")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 button-hover p-2 px-4 rounded-lg text-white flex items-center"
              >
                {loading ? (
                  <div className="flex items-center space-x-2 cursor-not-allowed">
                    <svg
                      className="animate-spin h-6 w-6 text-purple-200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M12 2a10 10 0 0 1 10 10H12V2z"
                      />
                    </svg>
                    <span className="text-purple-100 font-semibold">
                      Loading...
                    </span>
                  </div>
                ) : (
                  "Get Started"
                )}

                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Button size="lg" variant="outline" className="button-hover">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage educational progress
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow card-hover"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get started</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="p-6 rounded-xl bg-white shadow-lg card-hover">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-purple-600">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">
              Hear from educational institutions using GradePulse
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white shadow-lg card-hover"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of educational institutions using GradePulse
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 button-hover"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GradePulse</h3>
              <p className="text-gray-400">
                Transforming education through technology
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 GradePulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: "Role-Based Access",
    description:
      "Seamless management with distinct roles for Admins, Teachers, and Students",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-blue-600" />,
    title: "Course Management",
    description:
      "Easily create and manage courses with detailed information and structure",
  },
  {
    icon: <Brain className="h-6 w-6 text-blue-600" />,
    title: "AI-Powered Testing",
    description:
      "Generate intelligent quizzes and get detailed performance analytics",
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-600" />,
    title: "Real-time Progress",
    description:
      "Track student progress in real-time with comprehensive analytics",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6 text-blue-600" />,
    title: "Automated Grading",
    description: "Save time with automated grading and feedback systems",
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-600" />,
    title: "Secure Platform",
    description: "Enterprise-grade security to protect your institution's data",
  },
];

const steps = [
  {
    title: "Institute Registration",
    description: "Register your institution and set up your admin account",
  },
  {
    title: "Configure Courses",
    description: "Add courses, set up classrooms, and invite teachers",
  },
  {
    title: "Start Teaching",
    description:
      "Teachers can create assignments and students can begin learning",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "University Administrator",
    content:
      "GradePulse has revolutionized how we track student progress. The AI-powered testing feature is particularly impressive.",
  },
  {
    name: "Michael Chen",
    role: "High School Teacher",
    content:
      "The platform's intuitive interface and comprehensive analytics have made my job so much easier.",
  },
  {
    name: "Emily Rodriguez",
    role: "College Student",
    content:
      "I love how easy it is to track my progress and get personalized feedback through GradePulse.",
  },
];

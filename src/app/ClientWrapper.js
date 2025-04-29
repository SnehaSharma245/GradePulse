"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

import { useSession } from "next-auth/react";
import Loading from "@/components/LoadingScreen";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();

  const { status } = useSession();

  // Check if the route matches specific paths
  const noNavbarPages =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify");

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <>
      {!noNavbarPages && <Navbar />}
      <main>{children || <p>No children to render</p>}</main>
    </>
  );
}

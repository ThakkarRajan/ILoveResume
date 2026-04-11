// src/components/NavbarWrapper.js
"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Navbar = dynamic(() => import("./Navbar"), { ssr: true });

export default function NavbarWrapper() {
  const pathname = usePathname();
  const showNavbar = pathname !== "/" && pathname !== "/not-found";
  return showNavbar ? <Navbar /> : null;
}

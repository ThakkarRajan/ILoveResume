// src/components/NavbarWrapper.js
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const showNavbar = pathname !== "/" && pathname !== "/not-found";
  return showNavbar ? <Navbar /> : null;
}

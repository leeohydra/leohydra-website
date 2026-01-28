"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open and handle Escape key
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMenuOpen(false);
        }
      };
      
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscape);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[0.5px] border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top bar */}
          <div className="flex items-baseline justify-between py-4 relative">

            {/* LEFT — Mobile hamburger */}
            <button
              className="md:hidden text-2xl leading-none w-6"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              ☰
            </button>

            {/* CENTER — Logo (centered on mobile) */}
            <Link
              href="/"
              aria-label="LeoHydra Home"
              className="transition-opacity duration-[400ms] hover:opacity-70 absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none"
            >
              <img
                src="/Logo/logo_black.png"
                alt="LeoHydra logo"
                className="h-7 w-auto relative top-[2px]"
              />
            </Link>

            {/* CENTER — Desktop nav */}
            <nav className="hidden md:flex items-baseline gap-10 lg:gap-14 text-sm">
              <Link href="/original-artworks" className="link-editorial">
                Original Artworks
              </Link>
              <Link href="/prints" className="link-editorial">
                Prints
              </Link>
              <Link href="/request-project" className="link-editorial">
                Request Project
              </Link>
              <Link href="/request-catalogue" className="link-editorial">
                Catalogue
              </Link>
              <Link href="/about" className="link-editorial">
                About
              </Link>
              <Link href="/contact" className="link-editorial">
                Contact
              </Link>
            </nav>

            {/* RIGHT — Cart */}
            <button
              className="relative p-2 text-gray-900 hover:opacity-60"
              aria-label="Shopping cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 relative top-[2px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a2.25 2.25 0 00-2.25 2.25m15.75 0a2.25 2.25 0 00-2.25-2.25M5.25 7.5a2.25 2.25 0 112.25 2.25M5.25 19.5h15a2.25 2.25 0 002.25-2.25V9.75A2.25 2.25 0 0019.5 7.5h-15a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 005.25 19.5z"
                />
              </svg>

              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] flex items-center justify-center text-white bg-red-500 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay - Full screen, independent of navbar */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-white"
          style={{
            animation: "slideFromLeft 0.3s ease-out",
          }}
        >
          <div className="h-full flex flex-col">
            {/* Header with close button on left and logo centered */}
            <div className="flex items-baseline justify-between px-4 sm:px-6 py-4 border-b border-[var(--border-subtle)] relative">
              {/* Close button on left */}
              <button
                className="text-2xl leading-none"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                ✕
              </button>
              
              {/* Logo centered */}
              <Link
                href="/"
                aria-label="LeoHydra Home"
                className="transition-opacity duration-[400ms] hover:opacity-70 absolute left-1/2 transform -translate-x-1/2"
                onClick={closeMenu}
              >
                <img
                  src="/Logo/logo_black.png"
                  alt="LeoHydra logo"
                  className="h-7 w-auto relative top-[2px]"
                />
              </Link>
              
              {/* Spacer to balance layout */}
              <div className="w-6"></div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 flex flex-col px-4 sm:px-6 py-6 space-y-6 text-sm">
              <Link
                href="/original-artworks"
                onClick={closeMenu}
                className="link-editorial py-2"
              >
                Original Artworks
              </Link>
              <Link
                href="/prints"
                onClick={closeMenu}
                className="link-editorial py-2"
              >
                Prints
              </Link>
              <Link
                href="/request-project"
                onClick={closeMenu}
                className="link-editorial py-2"
              >
                Request Project
              </Link>
              <Link
                href="/request-catalogue"
                onClick={closeMenu}
                className="link-editorial py-2"
              >
                Catalogue
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className="link-editorial py-2"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="link-editorial py-2"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

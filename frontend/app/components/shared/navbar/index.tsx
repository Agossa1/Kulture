"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import { navGroups } from "./navbar.config";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav 
      className={`w-full sticky top-0 z-50 font-sans transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
      }`} 
      ref={navbarRef}
    >
      <div className={`container mx-auto px-4 flex flex-row items-center justify-between transition-all duration-300 ${isScrolled ? "py-3" : "py-4"}`}>

        {/* Logo */}
        <div className="text-2xl font-extrabold  text-yellow-600">
          <Link href="/">Kulture</Link>
        </div>

        {/* Hamburger (Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-gray-600 hover:text-black focus:outline-none transition-colors"
        >
          {isMobileMenuOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation */}
        <DesktopMenu
          navGroups={navGroups}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        {/* Desktop Actions */}
        <div className="hidden lg:flex flex-row gap-4 items-center text-[16px] font-semibold">
          <Link href="/login" className="text-gray-600 transition hover:text-black">
            Connexion
          </Link>
          <Link
            href="/register"
            className="bg-yellow-500 text-white px-5 py-2.5 rounded-full font-semibold transition hover:bg-yellow-600  shadow-yellow-500/10"
          >
            Inscription
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          navGroups={navGroups}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}

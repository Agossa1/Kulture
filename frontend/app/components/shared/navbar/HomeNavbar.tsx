"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LuMenu, LuX, LuSearch, LuUser, LuBell, LuHeart, LuShoppingCart } from "react-icons/lu";

import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/app/features/auth/services/auth.thunk";
import { useRouter } from "next/navigation";


export default function HomeNavbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

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

const handleLogout = async () => {
  setOpenDropdown(null);
  await dispatch(logoutUser())
  router.push('/login')
}

  return (
    <nav 
      className={`w-full sticky top-0 z-50 font-sans transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
      }`} 
      ref={navbarRef}
    >
      <div className={`container mx-auto px-4 flex flex-row items-center justify-between transition-all duration-300 ${isScrolled ? "py-3" : "py-4"}`}>

        {/* Logo */}
        <div className="text-2xl font-extrabold text-yellow-600 flex-shrink-0">
          <Link href="/">Kulture</Link>
        </div>

        {/* Barre de recherche (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
          <input 
            type="text" 
            placeholder="Rechercher un événement, un artiste, une œuvre..." 
            className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all placeholder-gray-400 text-gray-700"
          />
          <LuSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/notifications" className="flex items-center gap-2 hover:text-yellow-600 transition">
            <LuBell className="w-5 h-5" />
            Notifications
          </Link>
          <Link href="/favoris" className="flex items-center gap-2 hover:text-yellow-600 transition">
            <LuHeart className="w-5 h-5" />
            Favoris
          </Link>
          <Link href="/panier" className="flex items-center gap-2 hover:text-yellow-600 transition">
            <LuShoppingCart className="w-5 h-5" />
            Panier
          </Link>
        </div>

        {/* Actions (Recherche mobile, Compte & Hamburger) */}
        <div className="flex flex-row items-center gap-3 sm:gap-5">
            
          {/* Icône de recherche (Mobile) */}
          <button className="md:hidden text-gray-600 hover:text-yellow-600 transition p-2">
            <LuSearch className="w-6 h-6" />
          </button>

          {/* Bouton Compte avec Menu Déroulant */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setOpenDropdown(openDropdown === "account" ? null : "account")}
              className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 transition font-medium focus:outline-none"
            >
              <div className={`p-2.5 rounded-full transition ${openDropdown === "account" ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"}`}>
                <LuUser className="w-5 h-5" />
              </div>
              <span className="text-sm hidden lg:block">Mon Compte</span>
            </button>

            {/* Menu Déroulant */}
            {openDropdown === "account" && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                <Link 
                  href="/profile" 
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition"
                  onClick={() => setOpenDropdown(null)}
                >
                  Voir le profil
                </Link>
                <Link 
                  href="/settings" 
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition"
                  onClick={() => setOpenDropdown(null)}
                >
                  Paramètres
                </Link>
                <Link 
                  href="/tickets" 
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition"
                  onClick={() => setOpenDropdown(null)}
                >
                  Mes billets
                </Link>
                <div className="h-px bg-gray-100 my-1"></div>
                <button
                  className="w-full text-left block px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Hamburger (Mobile/Tablet) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-600 hover:text-black focus:outline-none transition-colors p-1"
          >
            {isMobileMenuOpen ? <LuX className="w-7 h-7" /> : <LuMenu className="w-7 h-7" />}
          </button>

        </div>
      </div>

      {/* Barre de recherche déroulante pour Mobile (Optionnelle si on clique sur la loupe mobile) */}
      {/* On peut l'ajouter ici plus tard si nécessaire */}

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-inner">
          <div className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            <Link href="/notifications" className="flex items-center gap-3 p-3 hover:bg-yellow-50 hover:text-yellow-600 rounded-xl transition" onClick={() => setIsMobileMenuOpen(false)}>
              <LuBell className="w-5 h-5" />
              Notifications
            </Link>
            <Link href="/favoris" className="flex items-center gap-3 p-3 hover:bg-yellow-50 hover:text-yellow-600 rounded-xl transition" onClick={() => setIsMobileMenuOpen(false)}>
              <LuHeart className="w-5 h-5" />
              Favoris
            </Link>
            <Link href="/panier" className="flex items-center gap-3 p-3 hover:bg-yellow-50 hover:text-yellow-600 rounded-xl transition" onClick={() => setIsMobileMenuOpen(false)}>
              <LuShoppingCart className="w-5 h-5" />
              Panier
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

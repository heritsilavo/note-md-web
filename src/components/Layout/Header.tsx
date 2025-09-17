"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiSettings, FiBell, FiUser, FiMenu, FiX } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import SearchNotes from "../SearchNotes/SearchNotes";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="w-full bg-white px-4 sm:px-8 py-4 flex items-center justify-between">
      <div onClick={()=>{router.push('/')}} className="flex items-center gap-3 cursor-pointer">
        <Image alt="logo" src="/icone-45x50.svg" width={40} height={40}/>
        <span className="font-bold text-2xl tracking-tight">NoteMD</span>
      </div>
      {/* Desktop nav */}
      <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
        <Link href="/" className="font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1"><MdDashboard className="text-lg" /> Tableau de bord</Link>
        <Link href="/" className="font-medium text-gray-700 hover:text-blue-600">Paramètres</Link>
        <Link href="/historique" className="font-medium text-gray-700 hover:text-blue-600">Historique</Link>
      </nav>
      <div className="hidden md:flex items-center gap-4">
        <SearchNotes />
        <button className="p-2 rounded-full hover:bg-gray-100"><FiBell className="text-xl text-gray-500" /></button>
        <button className="p-2 rounded-full hover:bg-gray-100"><FiSettings className="text-xl text-gray-500" /></button>
        <button className="p-2 rounded-full hover:bg-gray-100"><FiUser className="text-xl text-gray-500" /></button>
      </div>
      {/* Hamburger menu button */}
      <button className="md:hidden p-2 rounded-full hover:bg-gray-100 ml-auto" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX className="text-2xl text-gray-700" /> : <FiMenu className="text-2xl text-gray-700" />}
      </button>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b shadow-md z-50 flex flex-col items-center py-4 gap-4 md:hidden">
          <nav className="flex flex-col items-center gap-4 w-full">
            <Link href="/" className="font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1"><MdDashboard className="text-lg" /> Tableau de bord</Link>
            <Link href="/" className="font-medium text-gray-700 hover:text-blue-600">Paramètres</Link>
            <Link href="/historique" className="font-medium text-gray-700 hover:text-blue-600">Historique</Link>
          </nav>
          <div className="flex flex-col items-center gap-2 w-full px-4">
            <input type="text" placeholder="Rechercher des notes..." className="px-3 py-1.5 rounded-md border bg-gray-50 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <div className="flex items-center gap-2 mt-2">
              <button className="p-2 rounded-full hover:bg-gray-100"><FiBell className="text-xl text-gray-500" /></button>
              <button className="p-2 rounded-full hover:bg-gray-100"><FiSettings className="text-xl text-gray-500" /></button>
              <button className="p-2 rounded-full hover:bg-gray-100"><FiUser className="text-xl text-gray-500" /></button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

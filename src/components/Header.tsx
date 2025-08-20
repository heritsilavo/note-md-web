import React from "react";
import { FaRegStickyNote } from "react-icons/fa";
import { FiSettings, FiBell, FiUser } from "react-icons/fi";
import { HiOutlineClock } from "react-icons/hi2";
import { MdDashboard } from "react-icons/md";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-white border-b">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <FaRegStickyNote className="text-3xl text-blue-600" />
        <span className="font-bold text-2xl tracking-tight">NoteMD</span>
      </div>
      <nav className="flex-1 flex items-center justify-center gap-8">
        <a href="#" className="font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1"><MdDashboard className="text-lg" /> Tableau de bord</a>
        <a href="#" className="font-medium text-gray-700 hover:text-blue-600">Paramètres</a>
        <a href="#" className="font-medium text-gray-700 hover:text-blue-600">Historique</a>
      </nav>
      <div className="flex items-center gap-4">
        <input type="text" placeholder="Rechercher des notes..." className="px-3 py-1.5 rounded-md border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <button className="p-2 rounded-full hover:bg-gray-100"><FiBell className="text-xl text-gray-500" /></button>
        <button className="p-2 rounded-full hover:bg-gray-100"><FiSettings className="text-xl text-gray-500" /></button>
        <button className="p-2 rounded-full hover:bg-gray-100"><FiUser className="text-xl text-gray-500" /></button>
      </div>
    </header>
  );
}

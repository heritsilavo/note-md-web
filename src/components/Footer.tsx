import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t py-4 px-8 text-gray-600 text-sm flex items-center justify-between">
      <div className="flex gap-8">
        <a href="#" className="hover:underline">Produit</a>
        <a href="#" className="hover:underline">Ressources</a>
        <a href="#" className="hover:underline">Légal</a>
      </div>
      <span>© {new Date().getFullYear()} NoteMD. Tous droits réservés.</span>
      <div className="flex gap-4">
        <a href="#" aria-label="Twitter" className="hover:text-blue-500"><FaTwitter /></a>
        <a href="#" aria-label="LinkedIn" className="hover:text-blue-700"><FaLinkedin /></a>
        <a href="#" aria-label="GitHub" className="hover:text-gray-800"><FaGithub /></a>
      </div>
    </footer>
  );
}

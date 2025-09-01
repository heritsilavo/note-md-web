import { FaGithub, FaTwitter, FaLinkedin, FaFacebook, FaLink } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t py-4 px-8 text-gray-600 text-sm flex items-center justify-between">
      <div className="flex gap-8">
        <a href="mailto:heritsilavo4835@gmail.com" className="hover:underline">Me contacter 😊</a>
      </div>
      <span>© {new Date().getFullYear()} NoteMD. Tous droits réservés.</span>
      <div className="flex gap-4">
        <a href="https://tsilavo.vercel.app/" aria-label="GitHub" className="hover:text-gray-800"><FaLink /></a>
        <a href="https://www.facebook.com/her.tslav/" aria-label="Twitter" className="hover:text-blue-500"><FaFacebook /></a>
        <a href="https://mg.linkedin.com/in/heritsilavo-andriantsilavina-86b4302b4" aria-label="LinkedIn" className="hover:text-blue-700"><FaLinkedin /></a>
        <a href="https://github.com/heritsilavo" aria-label="GitHub" className="hover:text-gray-800"><FaGithub /></a>
      </div>
    </footer>
  );
}

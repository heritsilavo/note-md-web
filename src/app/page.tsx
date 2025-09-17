import Summary from "@/components/NotesList/Summary";
import NotesList from "../components/NotesList/NotesList";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";

export const dynamic = 'force-dynamic';

export default function Home() {
  const is_in_test_env = process.env.NEXT_PUBLIC_ENV_TEST == "true";

  return (
    <div className="w-[100dvw] h-[calc(100vh-(53px+68px))] overflow-x-hidden overflow-y-scroll outline-none border-none">
      <main className="flex flex-col gap-16 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
        {/* Hero section */}
        {is_in_test_env && <HeroSection />}

        {/* Aperçu des notes */}
        <Summary />

        {/* Toutes vos notes */}
        <NotesList />
        
        {/* Aperçu des pièces jointes récentes */}
        {/* <section>
          <h2 className="text-2xl font-bold mb-6">Aperçu des pièces jointes récentes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
              <span className="font-semibold">Notes de réunion.pdf</span>
              <span className="text-xs text-gray-500">Document</span>
            </div>
            <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
              <span className="font-semibold">Budget Marketing.xlsx</span>
              <span className="text-xs text-gray-500">Document</span>
            </div>
            <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
              <span className="font-semibold">Image du plan de projet.png</span>
              <span className="text-xs text-gray-500">Image</span>
            </div>
            <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
              <span className="font-semibold">Infographie Statistiques.png</span>
              <span className="text-xs text-gray-500">Image</span>
            </div>
          </div>
        </section> */}

        {/* Call to action final */}
        <section className="bg-gray-50 rounded-xl p-8 flex flex-col items-center mt-8">
          <h3 className="text-xl font-bold mb-2">Commencez à organiser vos pensées !</h3>
          <p className="text-gray-700 mb-4">Créez votre première note, explorez les catégories et les tags, et définissez des rappels.</p>
          <Link href="/note-editor?action=new_note" className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold">
            Créer une nouvelle note
          </Link>
        </section>
      </main>
    </div>
  );
}

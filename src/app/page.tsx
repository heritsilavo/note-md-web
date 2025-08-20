export default function Home() {
  return (
    <main className="flex flex-col gap-16 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
      {/* Hero section */}
      {/* <section className="bg-blue-50 rounded-xl p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">Organisez vos pensées, synchronisez sans effort.</h1>
          <p className="text-gray-700 mb-6">MindKeep Notes est votre solution complète pour une gestion de notes Markdown sans accroc, avec synchronisation en temps réel et organisation intelligente.</p>
          <button className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold">Créer votre première note</button>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="/next.svg" alt="Aperçu application" className="rounded-lg shadow-lg w-full max-w-md" />
        </div>
      </section> */}

      {/* Aperçu des notes */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">Aperçu de vos notes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-3xl font-bold">1 245</span>
            <span className="text-gray-500 mt-2">Notes totales</span>
          </div>
          <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-3xl font-bold">12</span>
            <span className="text-gray-500 mt-2">Créées cette semaine</span>
          </div>
          <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-3xl font-bold">3</span>
            <span className="text-gray-500 mt-2">Rappels à venir</span>
          </div>
          <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
            <span className="text-3xl font-bold">2</span>
            <span className="text-gray-500 mt-2">En attente de synchronisation</span>
          </div>
        </div>
      </section>

      {/* Toutes vos notes */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Toutes vos notes</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input type="text" placeholder="Rechercher des notes par titre ou contenu..." className="px-3 py-2 rounded-md border bg-gray-50 text-sm flex-1" />
          <select className="px-3 py-2 rounded-md border bg-gray-50 text-sm">
            <option>Filtrer par statut</option>
          </select>
          <select className="px-3 py-2 rounded-md border bg-gray-50 text-sm">
            <option>Filtrer par catégorie</option>
          </select>
          <select className="px-3 py-2 rounded-md border bg-gray-50 text-sm">
            <option>Filtrer par tag</option>
          </select>
          <button className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold">Nouvelle Note</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Note cards statiques */}
          <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-2">
            <h3 className="font-bold text-lg">Plan de projet Q3</h3>
            <span className="text-xs text-gray-500">10 juillet 2024</span>
            <p className="text-gray-700 text-sm">Résumé des objectifs du projet pour le troisième trimestre, y compris les étapes clés et les responsabilités de l'équipe.</p>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">Travail</span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">projet</span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">planification</span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">équipe</span>
              <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">Synchronisé</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>3 pièce(s) jointe(s)</span>
              <a href="#" className="text-blue-700">Voir PJ</a>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button className="text-blue-700 text-xs">Modifier</button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-2">
            <h3 className="font-bold text-lg">Idées de contenu pour le blog</h3>
            <span className="text-xs text-gray-500">9 juillet 2024</span>
            <p className="text-gray-700 text-sm">Brainstorming des sujets potentiels pour les prochains articles de blog. Les idées incluent l'optimisation SEO, les études de cas et la rédaction.</p>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">Idées</span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">marketing</span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">blog</span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">rédaction</span>
              <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">En attente</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>1 pièce(s) jointe(s)</span>
              <a href="#" className="text-blue-700">Voir PJ</a>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button className="text-blue-700 text-xs">Modifier</button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-2">
            <h3 className="font-bold text-lg">Liste de courses hebdomadaire</h3>
            <span className="text-xs text-gray-500">8 juillet 2024</span>
            <p className="text-gray-700 text-sm">Articles à acheter pour la semaine : légumes frais, fruits, produits laitiers, viande et articles ménagers. Ne pas oublier le pain et le beurre.</p>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">Personnel</span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">maison</span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded">courses</span>
              <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">Synchronisé</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>1 pièce(s) jointe(s)</span>
              <a href="#" className="text-blue-700">Voir PJ</a>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button className="text-blue-700 text-xs">Modifier</button>
            </div>
          </div>
        </div>
      </section>

      {/* Aperçu des pièces jointes récentes */}
      <section>
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
      </section>

      {/* Call to action final */}
      <section className="bg-gray-50 rounded-xl p-8 flex flex-col items-center mt-8">
        <h3 className="text-xl font-bold mb-2">Commencez à organiser vos pensées !</h3>
        <p className="text-gray-700 mb-4">Créez votre première note, explorez les catégories et les tags, et définissez des rappels.</p>
        <button className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold">Créer une nouvelle note</button>
      </section>
    </main>
  );
}

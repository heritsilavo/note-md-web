"use client"
import React, { useState } from "react";
import { FiSave, FiTag, FiCalendar, FiPaperclip, FiTrash2, FiPlus, FiEdit } from "react-icons/fi";
import { useSearchParams } from "next/navigation";

export default function NoteEditor() {
  
  const searchParams = useSearchParams();
  const action = searchParams.get("action") || "new_note";

  //STATES
  const [categories, setCategories] = useState(["Projet", "Développement"]);
  const [tags, setTags] = useState(["API", "Déploiement", "Backend"]);
  const [reminder, setReminder] = useState("2024-07-25T10:00");
  const [attachments, setAttachments] = useState([
    { name: "spécifications_api.pdf", size: "1.2 Mo" },
    { name: "maquettes_ui.zip", size: "5.8 Mo" },
    { name: "diagramme_architecture.png", size: "0.5 Mo" },
  ]);
  const [note, setNote] = useState(`# Planification du projet T3 : Améliorations de l'API et déploiement\n\n## Résumé du projet\nCe projet vise à améliorer l'API existante pour de meilleures performances et une plus grande flexibilité. Le déploiement continu sera optimisé.\n\n## Objectifs clés\n- **Optimisation de l'API :** Réduire le temps de réponse de l'API de 20 %.\n- **Déploiement automatisé :** Mettre en place des pipelines CI/CD pour des déploiements sans accroc.\n- **Documentation :** Mettre à jour la documentation de l'API avec les nouvelles spécifications.\n\n### Tâches Backend\n\n	typescript\n	// src/api/users.ts\n	async function getUsers() {\n	  const response = await fetch('/api/users');\n	  return response.json();\n	}\n\n- Refactoriser les points de terminaison d'authentification.\n- Implémenter la mise en cache des requêtes pour les points de terminaison critiques.\n`);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col gap-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-center w-full">Planification du projet Q3 : Améliorations de l'API et déploiement</h1>
        <button className="bg-blue-900 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2"><FiSave /> Enregistrer</button>
      </div>

      {/* Catégories, Balises, Rappel */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 justify-between">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2 font-semibold text-gray-700"><FiTag /> Catégories</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {categories.map((cat, i) => (
              <span key={i} className="bg-gray-100 px-3 py-1 rounded text-sm">{cat}</span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Nouvelle catégorie" className="px-2 py-1 rounded border text-sm flex-1" />
            <button className="p-2 rounded bg-gray-100"><FiPlus /></button>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2 font-semibold text-gray-700"><FiTag /> Balises</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, i) => (
              <span key={i} className="bg-gray-100 px-3 py-1 rounded text-sm">{tag}</span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Nouvelle balise" className="px-2 py-1 rounded border text-sm flex-1" />
            <button className="p-2 rounded bg-gray-100"><FiPlus /></button>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2 font-semibold text-gray-700"><FiCalendar /> Rappel</div>
          <input type="datetime-local" value={reminder} onChange={e => setReminder(e.target.value)} className="px-2 py-1 rounded border text-sm" />
        </div>
      </div>

      {/* Pièces jointes */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2 font-semibold text-gray-700"><FiPaperclip /> Pièces jointes</div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 mb-4">
          <FiPaperclip className="text-3xl mb-2" />
          Glissez-déposez des fichiers ici ou <span className="text-blue-700 cursor-pointer">cliquez pour téléverser</span>
        </div>
        <div className="flex flex-col gap-2">
          {attachments.map((file, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded px-4 py-2">
              <span>{file.name}</span>
              <span className="text-xs text-gray-500">{file.size}</span>
              <div className="flex gap-2">
                <button className="p-1 rounded hover:bg-gray-200"><FiEdit /></button>
                <button className="p-1 rounded hover:bg-gray-200"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editeur Markdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full h-80 resize-none border rounded p-3 text-sm font-mono bg-gray-50"
          />
        </div>
        <div className="bg-white rounded-xl shadow p-6 overflow-auto">
          <div className="prose prose-sm max-w-none">
            {/* Pour le rendu markdown, utiliser react-markdown et remark-gfm */}
            {/* <ReactMarkdown children={note} remarkPlugins={[remarkGfm]} /> */}
            <pre className="whitespace-pre-wrap text-sm font-mono">{note}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

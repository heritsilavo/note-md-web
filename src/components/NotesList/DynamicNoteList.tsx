"use client"

import { NoteDto } from "@/database/note-dto"
import Link from "next/link"
import { FiEdit, FiGrid, FiList, FiTable } from "react-icons/fi"
import NoteItem from "./NoteItem"
import { useState, useMemo, useEffect } from "react"
import NoteListItem from "./NoteListItem"
import NoteArrayItem from "./NoteArrayItem"

type DynamicNotesListProps = {
    notes: NoteDto[]
}

type ViewMode = "grid" | "list" | "array"

export default function DynamicNotesList({ notes }: DynamicNotesListProps) {
    // Fonction pour charger le viewMode depuis le localStorage
    const loadViewMode = (): ViewMode => {
        if (typeof window === 'undefined') {
            return "grid"
        }
        
        const saved = localStorage.getItem('notesViewMode')
        return (saved as ViewMode) || "grid"
    }

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedTag, setSelectedTag] = useState("")
    const [viewMode, setViewMode] = useState<ViewMode>("grid")
    const [showOnlyOrphanNotes, setShowOnlyOrphanNotes] = useState(true)

    // Charger le viewMode au montage du composant
    useEffect(() => {
        const savedViewMode = loadViewMode()
        setViewMode(savedViewMode)
    }, [])

    // Sauvegarder le viewMode à chaque changement
    useEffect(() => {
        localStorage.setItem('notesViewMode', viewMode)
    }, [viewMode])

    // Extraire les catégories uniques
    const categories = useMemo(() => {
        const allCategories = notes.flatMap(note => note.categorie)
        return Array.from(new Set(allCategories)).filter(Boolean).sort()
    }, [notes])

    // Extraire les balises uniques
    const tags = useMemo(() => {
        const allTags = notes.flatMap(note => note.balises)
        return Array.from(new Set(allTags)).filter(Boolean).sort()
    }, [notes])

    // Filtrer les notes
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            // Filtre par recherche
            const matchesSearch = searchTerm === "" || 
                note.nom_note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.contenu_note.toLowerCase().includes(searchTerm.toLowerCase())
            
            // Filtre par statut
            const matchesStatus = selectedStatus === "" || note.status === selectedStatus
            
            // Filtre par catégorie
            const matchesCategory = selectedCategory === "" || 
                note.categorie.includes(selectedCategory)
            
            // Filtre par tag
            const matchesTag = selectedTag === "" || 
                note.balises.includes(selectedTag)
            
            // Filtre par notes sans parent
            const matchesOrphanFilter = !showOnlyOrphanNotes || note.parents.length === 0
            
            return matchesSearch && matchesStatus && matchesCategory && matchesTag && matchesOrphanFilter
        })
    }, [notes, searchTerm, selectedStatus, selectedCategory, selectedTag, showOnlyOrphanNotes])

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Toutes vos notes</h2>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Affichage:</span>
                    <button 
                        className={`cursor-pointer p-2 rounded-md ${viewMode === "grid" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-600"}`}
                        onClick={() => setViewMode("grid")}
                        aria-label="Vue grille"
                    >
                        <FiGrid className="w-5 h-5" />
                    </button>
                    <button 
                        className={`cursor-pointer p-2 rounded-md ${viewMode === "list" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-600"}`}
                        onClick={() => setViewMode("list")}
                        aria-label="Vue liste"
                    >
                        <FiList className="w-5 h-5" />
                    </button>
                    <button 
                        className={`cursor-pointer p-2 rounded-md ${viewMode === "array" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-600"}`}
                        onClick={() => setViewMode("array")}
                        aria-label="Vue tableau"
                    >
                        <FiTable className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 items-end">
                <input 
                    type="text" 
                    placeholder="Rechercher des notes par titre ou contenu..." 
                    className="border-[0.2px] border-gray-400 cursor-text outline-0 px-3 py-2 rounded-md bg-gray-50 text-sm w-full" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <select 
                    className="px-3 py-2 rounded-md border-[0.2px] border-gray-400 cursor-pointer outline-0 bg-gray-50 text-sm w-full"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="">Filtrer par statut</option>
                    <option value="synced">Synchronisé</option>
                    <option value="modified">Modifié</option>
                    <option value="deleted">Supprimé</option>
                    <option value="created">Créé</option>
                </select>
                
                <select 
                    className="px-3 py-2 rounded-md border-[0.2px] border-gray-400 cursor-pointer outline-0 bg-gray-50 text-sm w-full"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Filtrer par catégorie</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                
                <select 
                    className="px-3 py-2 rounded-md border-[0.2px] border-gray-400 cursor-pointer outline-0 bg-gray-50 text-sm w-full"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                >
                    <option value="">Filtrer par tag</option>
                    {tags.map((tag, index) => (
                        <option key={index} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
                
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md border-[0.2px] border-gray-400">
                    <input 
                        type="checkbox" 
                        id="orphan-notes"
                        checked={showOnlyOrphanNotes}
                        onChange={(e) => setShowOnlyOrphanNotes(e.target.checked)}
                        className="cursor-pointer"
                    />
                    <label htmlFor="orphan-notes" className="text-sm cursor-pointer whitespace-nowrap">
                        Notes principales
                    </label>
                </div>
                
                <Link 
                    href="/note-editor?action=new_note" 
                    className="bg-blue-900 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 w-full md:w-auto"
                >
                    <FiEdit className="w-5 h-5" />
                    Nouvelle Note
                </Link>
            </div>

            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredNotes.map((note, idx) => (
                        <NoteItem key={idx} note={note} />
                    ))}
                </div>
            ) : viewMode === "list" ? (
                <div className="space-y-4">
                    {filteredNotes.map((note, idx) => (
                        <NoteListItem key={idx} note={note} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégories</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredNotes.map((note, idx) => (
                                <NoteArrayItem key={idx} note={note} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredNotes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Aucune note ne correspond à vos critères de filtrage.
                </div>
            )}
        </section>
    )
}
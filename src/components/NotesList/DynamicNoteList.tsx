"use client"

import { NoteDto } from "@/database/note-dto"
import Link from "next/link"
import { FiEdit } from "react-icons/fi"
import NoteItem from "./NoteItem"
import { useState, useMemo } from "react"

type DynamicNotesListProps = {
    notes: NoteDto[]
}

export default function DynamicNotesList({ notes }: DynamicNotesListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedTag, setSelectedTag] = useState("")

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
            
            return matchesSearch && matchesStatus && matchesCategory && matchesTag
        })
    }, [notes, searchTerm, selectedStatus, selectedCategory, selectedTag])

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Toutes vos notes</h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-end">
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
                
                <Link 
                    href="/note-editor?action=new_note" 
                    className="bg-blue-900 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 w-full md:w-auto"
                >
                    <FiEdit className="w-5 h-5" />
                    Nouvelle Note
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredNotes.map((note, idx) => (
                    <NoteItem key={idx} note={note} />
                ))}
            </div>

            {filteredNotes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Aucune note ne correspond à vos critères de filtrage.
                </div>
            )}
        </section>
    )
}
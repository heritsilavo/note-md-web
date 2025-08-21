"use client";
import React, { useState } from "react";
import { FiPlus, FiTag } from "react-icons/fi";

type CategoriesSelectorProps = {
    categories: string[];
    setCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

const NOTES_CATEGORIES = [
    'All',
    'Important',
    'Lecture notes',
    'To-do lists',
    'Shopping',
    'Work',
    'Personal',
    'Travel',
];

export default function CategoriesSelector({ categories, setCategories }: CategoriesSelectorProps) {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleAddCategory = (newCategory: string) => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
        }
        setInputValue("");
    };

    const handleRemoveCategory = (category: string) => {
        setCategories(categories.filter(cat => cat !== category));
    };

    // Suggestions dynamiques
    const filteredSuggestions = NOTES_CATEGORIES.filter(
        cat =>
            (inputValue
                ? cat.toLowerCase().includes(inputValue.toLowerCase())
                : true)
            && !categories.includes(cat)
    );

    return (
        <div className="flex-1 flex flex-col gap-2 rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2 font-semibold text-gray-700"><FiTag /> Catégories</div>
            <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((cat, i) => (
                    <span onClick={()=>handleRemoveCategory(cat)} key={i} className="cursor-pointer text-blue-900 px-3 py-1 rounded-full text-sm font-medium shadow hover:bg-blue-50 transition">{cat}</span>
                ))}
            </div>
            <div className="flex gap-2 relative">
                <input
                    type="text"
                    placeholder="Nouvelle catégorie"
                    className="px-2 py-1 rounded-lg border border-gray-300 text-sm flex-1 focus:border-blue-400 outline-none transition"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                />
                <button
                    className="p-2 rounded-lg text-blue-900 hover:bg-blue-50 transition"
                    onClick={() => handleAddCategory(inputValue)}
                    type="button"
                >
                    <FiPlus />
                </button>
                {isFocused && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-full border rounded-lg shadow z-10 bg-white">
                        {filteredSuggestions.map((cat, i) => (
                            <div
                                key={i}
                                className="px-3 py-1 cursor-pointer hover:bg-blue-50 text-sm rounded transition"
                                onMouseDown={() => handleAddCategory(cat)}
                            >
                                {cat}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
"use client";
import React, { useState } from "react";
import { FiPlus, FiTag } from "react-icons/fi";

type BaliseSelectorProps = {
    balises: string[];
    setBalises: React.Dispatch<React.SetStateAction<string[]>>;
};

const NOTES_BALISES = [
    "#urgent",
    "#idée",
    "#projet",
    "#perso",
    "#travail",
    "#à-faire",
    "#archive",
    "#meeting",
];

export default function BaliseSelector({ balises, setBalises }: BaliseSelectorProps) {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleAddBalise = (newBalise: string) => {
        if (newBalise && !balises.includes(newBalise)) {
            setBalises([...balises, newBalise]);
        }
        setInputValue("");
    };

    const handleRemoveBalise = (balise: string) => {
        setBalises(balises.filter(b => b !== balise));
    };

    const filteredSuggestions = NOTES_BALISES.filter(
        b => (inputValue ? b.toLowerCase().includes(inputValue.toLowerCase()) : true) && !balises.includes(b)
    );

    return (
        <div className="flex-1 flex flex-col gap-2 rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2 font-semibold text-gray-700"><FiTag /> Balises</div>
            <div className="flex flex-wrap gap-2 mb-2">
                {balises.map((b, i) => (
                    <span onClick={() => handleRemoveBalise(b)} key={i} className="cursor-pointer text-purple-900 px-3 py-1 rounded-full text-sm font-medium shadow hover:bg-purple-50 transition">{b}</span>
                ))}
            </div>
            <div className="flex gap-2 relative">
                <input
                    type="text"
                    placeholder="Nouvelle balise"
                    className="px-2 py-1 rounded-lg border border-gray-300 text-sm flex-1 focus:border-purple-400 outline-none transition"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                />
                <button
                    className="p-2 rounded-lg text-purple-900 hover:bg-purple-50 transition"
                    onClick={() => handleAddBalise(inputValue)}
                    type="button"
                >
                    <FiPlus />
                </button>
                {isFocused && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-full border rounded-lg shadow z-10 bg-white">
                        {filteredSuggestions.map((b, i) => (
                            <div
                                key={i}
                                className="px-3 py-1 cursor-pointer hover:bg-purple-50 text-sm rounded transition"
                                onMouseDown={() => handleAddBalise(b)}
                            >
                                {b}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

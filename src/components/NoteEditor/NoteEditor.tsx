"use client";
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";

const ToastEditor = dynamic(() => import("@toast-ui/react-editor").then(mod => mod.Editor), { ssr: false });

interface NoteEditorProps {
    contenu: string;
    setContenu: (val: string) => void;
    defaultPreview?: boolean;
}

export default function NoteEditor({ contenu, setContenu, defaultPreview = false }: NoteEditorProps) {
    const editorRef = useRef<any>(null);
    const [editorView, setEditorView] = React.useState<'split' | 'single'>('split');

    let previewStyle = editorView === 'split' ? 'vertical' : 'tab';
    let hideModeSwitch = false;
    let initialEditType = 'markdown';
    let tab = undefined;
    if (editorView === 'single') {
        tab = defaultPreview ? 'preview' : 'markdown';
    }

    return (
        <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
            <div className="flex gap-2 mb-6">
                <button
                    className={`px-3 py-2 cursor-pointer rounded-lg font-semibold shadow border border-blue-200 ${editorView === 'split' ? 'bg-white text-blue-900' : 'bg-gray-50 text-blue-900'} transition`}
                    onClick={() => setEditorView('split')}
                >Code + Aperçu</button>
                <button
                    className={`px-3 py-2 cursor-pointer rounded-lg font-semibold shadow border border-blue-200 ${editorView === 'single' ? 'bg-white text-blue-900' : 'bg-gray-50 text-blue-900'} transition`}
                    onClick={() => setEditorView('single')}
                >Vue unique</button>
            </div>
            <div className="rounded-xl shadow border border-gray-200 p-2 transition-all duration-300 bg-white">
                <ToastEditor
                    ref={editorRef}
                    initialValue={contenu}
                    height="600px"
                    width="100%"
                    previewStyle={previewStyle as any}
                    initialEditType={initialEditType as any}
                    useCommandShortcut={true}
                    hideModeSwitch={hideModeSwitch}
                    tab={tab}
                    onChange={() => {
                        const instance = editorRef.current;
                        if (instance) {
                            setContenu(instance.getInstance().getMarkdown());
                        }
                    }}
                />
            </div>
        </div>
    );
}

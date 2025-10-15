import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, 
  Image as ImageIcon, Code, List, ListOrdered, CheckSquare
} from "lucide-react";
import useHelpWriter from "../Ai/Helpwriter";

const lowlight = createLowlight(common);

const Editor = ({ initialValue, onChange }) => {
  const [tone, setTone] = useState("default");
  const [correctionType, setCorrectionType] = useState("grammar"); // Track the correction type
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      CodeBlockLowlight.configure({ lowlight }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const { generateSuggestion, applySuggestion, isLoading, suggestion } = useHelpWriter(editor, tone, correctionType);

  if (!editor) return null;

  const addLink = () => {
    const url = prompt("Enter the URL");
    if (url && /^https?:\/\/.+\..+/.test(url)) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      alert("Invalid URL");
    }
  };

  const addImage = () => {
    const url = prompt("Enter the image URL");
    if (url && /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(url)) {
      editor.chain().focus().setImage({ src: url }).run();
    } else {
      alert("Invalid Image URL");
    }
  };

  const buttonClass = (isActive) =>
    `w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
      isActive 
        ? "bg-white/30 text-white border border-white/40" 
        : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white"
    }`;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
      <div className="bg-white/5 backdrop-blur-sm min-h-screen p-6">
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Editor control buttons */}
          <button
            className={buttonClass(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon size={18} />
          </button>
          <button 
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white"
            onClick={addLink}
          >
            <LinkIcon size={18} />
          </button>
          <button 
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white"
            onClick={addImage}
          >
            <ImageIcon size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("codeBlock"))}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("taskList"))}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <CheckSquare size={18} />
          </button>

          {/* Tone selection */}
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 w-40"
          >
            <option value="default" className="bg-gray-800 text-white">Default</option>
            <option value="formal" className="bg-gray-800 text-white">Formal</option>
            <option value="casual" className="bg-gray-800 text-white">Casual</option>
            <option value="creative" className="bg-gray-800 text-white">Creative</option>
            <option value="poetic" className="bg-gray-800 text-white">Poetic</option>
            <option value="storytelling" className="bg-gray-800 text-white">Storytelling</option>
          </select>

          {/* Correction type dropdown */}
          <select
            value={correctionType}
            onChange={(e) => setCorrectionType(e.target.value)}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 w-40"
          >
            <option value="grammar" className="bg-gray-800 text-white">Grammar Correction</option>
            <option value="word" className="bg-gray-800 text-white">Word Correction</option>
          </select>

          {/* AI suggestion button */}
          <button
            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white rounded-lg border border-purple-500/30 hover:border-purple-500/40 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={generateSuggestion}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Get AI Suggestion"}
          </button>
        </div>

        {/* Display AI suggestion */}
        {suggestion && (
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-white/90 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: suggestion }} />
            <button
              className="mt-3 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-500/30 hover:border-green-500/40 transition-all duration-300 font-medium"
              onClick={applySuggestion}
            >
              Apply Suggestion
            </button>
          </div>
        )}

        {/* Editor content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-4">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
